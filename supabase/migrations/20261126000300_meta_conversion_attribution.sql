BEGIN;

CREATE TABLE public.meta_conversion_attribution (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    consent_session_id uuid NOT NULL
        REFERENCES public.meta_consent_sessions(id)
        ON DELETE CASCADE,

    consent_revision bigint NOT NULL,
    conversion_type text NOT NULL,
    reference_hash text NOT NULL,

    source_path text NOT NULL
        DEFAULT '/sarathi/astrologers',

    created_at timestamptz NOT NULL DEFAULT now(),

    expires_at timestamptz NOT NULL
        DEFAULT (now() + interval '7 days'),

    CONSTRAINT meta_conversion_type_check
        CHECK (
            conversion_type IN (
                'registration',
                'trial',
                'checkout'
            )
        ),

    CONSTRAINT meta_conversion_reference_check
        CHECK (reference_hash ~ '^[a-f0-9]{64}$'),

    CONSTRAINT meta_conversion_revision_check
        CHECK (consent_revision > 0),

    CONSTRAINT meta_conversion_source_check
        CHECK (source_path = '/sarathi/astrologers'),

    CONSTRAINT meta_conversion_expiry_check
        CHECK (expires_at > created_at),

    CONSTRAINT meta_conversion_unique_reference
        UNIQUE (conversion_type, reference_hash)
);

CREATE INDEX meta_conversion_consent_idx
    ON public.meta_conversion_attribution
    (consent_session_id);

CREATE INDEX meta_conversion_expiry_idx
    ON public.meta_conversion_attribution
    (expires_at);

ALTER TABLE public.meta_conversion_attribution
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.meta_conversion_attribution
    FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.meta_conversion_attribution
    FROM PUBLIC, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.meta_conversion_attribution
    TO service_role;

CREATE OR REPLACE FUNCTION public.meta_cleanup_expired()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    DELETE FROM public.meta_conversion_attribution
    WHERE expires_at <= now();

    DELETE FROM public.meta_event_dispatch
    WHERE expires_at <= now();

    DELETE FROM public.meta_rate_limits
    WHERE expires_at <= now();

    DELETE FROM public.meta_consent_sessions
    WHERE expires_at <= now();
END;
$$;

REVOKE ALL ON FUNCTION public.meta_cleanup_expired()
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.meta_cleanup_expired()
    TO service_role;

COMMIT;