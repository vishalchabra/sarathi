BEGIN;

-- Persistent rate limiting

CREATE TABLE public.meta_rate_limits (
    scope text NOT NULL,
    key_hash text NOT NULL,
    window_start timestamptz NOT NULL,
    request_count integer NOT NULL DEFAULT 1,
    expires_at timestamptz NOT NULL,

    PRIMARY KEY (scope, key_hash, window_start),

    CHECK (request_count > 0),
    CHECK (key_hash ~ '^[a-f0-9]{64}$'),
    CHECK (expires_at > window_start)
);

CREATE INDEX meta_rate_limits_expiry_idx
    ON public.meta_rate_limits (expires_at);


-- Event deduplication and dispatch state

CREATE TABLE public.meta_event_dispatch (
    event_id text PRIMARY KEY,
    event_name text NOT NULL,
    consent_session_id uuid NOT NULL
        REFERENCES public.meta_consent_sessions(id)
        ON DELETE CASCADE,

    status text NOT NULL DEFAULT 'pending',
    attempt_count integer NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz,
    expires_at timestamptz NOT NULL
        DEFAULT (now() + interval '30 days'),

    CHECK (char_length(event_id) BETWEEN 1 AND 128),
    CHECK (char_length(event_name) BETWEEN 1 AND 64),
    CHECK (attempt_count >= 0),
    CHECK (status IN (
        'pending',
        'processing',
        'sent',
        'failed',
        'cancelled'
    ))
);

CREATE INDEX meta_event_dispatch_expiry_idx
    ON public.meta_event_dispatch (expires_at);

CREATE INDEX meta_event_dispatch_session_idx
    ON public.meta_event_dispatch (consent_session_id);


-- Restrict table access

ALTER TABLE public.meta_rate_limits
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.meta_rate_limits
    FORCE ROW LEVEL SECURITY;

ALTER TABLE public.meta_event_dispatch
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.meta_event_dispatch
    FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
    public.meta_rate_limits,
    public.meta_event_dispatch
FROM PUBLIC, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
    public.meta_rate_limits,
    public.meta_event_dispatch
TO service_role;


-- Atomic consent session creation

CREATE FUNCTION public.meta_create_consent_session()
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.meta_consent_sessions (
        marketing_granted,
        expires_at
    )
    VALUES (
        true,
        now() + interval '180 days'
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;


-- Persistent consent verification

CREATE FUNCTION public.meta_verify_consent_session(
    p_session_id uuid,
    p_revision bigint
)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.meta_consent_sessions
        WHERE id = p_session_id
          AND revision = p_revision
          AND consent_version = 1
          AND marketing_granted = true
          AND revoked_at IS NULL
          AND expires_at > now()
    );
$$;


-- Persistent consent withdrawal

CREATE FUNCTION public.meta_revoke_consent_session(
    p_session_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.meta_consent_sessions
    SET marketing_granted = false,
        revoked_at = now(),
        updated_at = now(),
        revision = revision + 1
    WHERE id = p_session_id
      AND revoked_at IS NULL;

    UPDATE public.meta_event_dispatch
    SET status = 'cancelled',
        updated_at = now()
    WHERE consent_session_id = p_session_id
      AND status IN ('pending', 'failed');

    RETURN true;
END;
$$;


-- Atomic fixed-window rate limiting

CREATE FUNCTION public.meta_check_rate_limit(
    p_scope text,
    p_key_hash text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_limit integer;
    v_window timestamptz;
    v_count integer;
BEGIN
    v_limit := CASE p_scope
        WHEN 'consent_grant' THEN 10
        WHEN 'consent_status' THEN 60
        WHEN 'discovery_session' THEN 30
        WHEN 'discovery_ip' THEN 120
        ELSE NULL
    END;

    IF v_limit IS NULL
       OR p_key_hash IS NULL
       OR p_key_hash !~ '^[a-f0-9]{64}$'
    THEN
        RETURN false;
    END IF;

    v_window := date_trunc('minute', clock_timestamp());

    INSERT INTO public.meta_rate_limits AS limits (
        scope,
        key_hash,
        window_start,
        request_count,
        expires_at
    )
    VALUES (
        p_scope,
        p_key_hash,
        v_window,
        1,
        v_window + interval '24 hours'
    )
    ON CONFLICT (
        scope,
        key_hash,
        window_start
    )
    DO UPDATE SET
        request_count = LEAST(
            limits.request_count + 1,
            v_limit + 1
        )
    RETURNING request_count INTO v_count;

    RETURN v_count <= v_limit;
END;
$$;


-- Expired record cleanup

CREATE FUNCTION public.meta_cleanup_expired()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    DELETE FROM public.meta_event_dispatch
    WHERE expires_at <= now();

    DELETE FROM public.meta_rate_limits
    WHERE expires_at <= now();

    DELETE FROM public.meta_consent_sessions
    WHERE expires_at <= now();
END;
$$;


-- Restrict RPC execution

REVOKE ALL ON FUNCTION
    public.meta_create_consent_session(),
    public.meta_verify_consent_session(uuid, bigint),
    public.meta_revoke_consent_session(uuid),
    public.meta_check_rate_limit(text, text),
    public.meta_cleanup_expired()
FROM PUBLIC, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
    public.meta_create_consent_session(),
    public.meta_verify_consent_session(uuid, bigint),
    public.meta_revoke_consent_session(uuid),
    public.meta_check_rate_limit(text, text),
    public.meta_cleanup_expired()
TO service_role;


-- Daily cleanup at 03:00 database scheduler time

SELECT cron.schedule(
    'sarathi-meta-cleanup',
    '0 3 * * *',
    'SELECT public.meta_cleanup_expired();'
);

COMMIT;