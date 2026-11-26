BEGIN;

-- Persistent Meta marketing consent sessions.
-- No customer profile or astrology data is stored.

CREATE TABLE public.meta_consent_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    consent_version integer NOT NULL DEFAULT 1,

    marketing_granted boolean NOT NULL DEFAULT false,

    revision bigint NOT NULL DEFAULT 1,

    created_at timestamptz NOT NULL DEFAULT now(),

    updated_at timestamptz NOT NULL DEFAULT now(),

    expires_at timestamptz NOT NULL,

    revoked_at timestamptz,

    CONSTRAINT meta_consent_version_check
        CHECK (consent_version > 0),

    CONSTRAINT meta_consent_revision_check
        CHECK (revision > 0),

    CONSTRAINT meta_consent_expiry_check
        CHECK (expires_at > created_at),

    CONSTRAINT meta_consent_updated_at_check
        CHECK (updated_at >= created_at),

    CONSTRAINT meta_consent_revoked_at_check
        CHECK (
            revoked_at IS NULL
            OR revoked_at >= created_at
        ),

    CONSTRAINT meta_consent_state_check
        CHECK (
            NOT marketing_granted
            OR revoked_at IS NULL
        )
);

-- Support expiry-based cleanup.

CREATE INDEX meta_consent_sessions_expiry_idx
    ON public.meta_consent_sessions (expires_at);

-- Prevent ordinary application users from accessing
-- consent records directly.

ALTER TABLE public.meta_consent_sessions
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.meta_consent_sessions
    FORCE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES
    ON TABLE public.meta_consent_sessions
    FROM PUBLIC, anon, authenticated;

REVOKE ALL PRIVILEGES
    ON TABLE public.meta_consent_sessions
    FROM service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.meta_consent_sessions
    TO service_role;

COMMENT ON TABLE public.meta_consent_sessions IS
    'Server-managed marketing consent sessions with persistent revocation.';

COMMIT;