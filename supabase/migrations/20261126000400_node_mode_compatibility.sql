-- Sarathi: Mean / True Node compatibility schema
--
-- Equivalent schema changes were previously applied manually
-- to the production database.
--
-- Reconcile migration history before applying this file.
-- Historical True Node defaults preserve existing behaviour.

BEGIN;

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS preferred_node_mode
    text NOT NULL DEFAULT 'true'
    CHECK (preferred_node_mode IN ('mean', 'true'));

ALTER TABLE public.saved_birth_profiles
    ADD COLUMN IF NOT EXISTS node_mode
    text NOT NULL DEFAULT 'true'
    CHECK (node_mode IN ('mean', 'true'));

ALTER TABLE public.user_charts
    ADD COLUMN IF NOT EXISTS node_mode
    text NOT NULL DEFAULT 'true'
    CHECK (node_mode IN ('mean', 'true'));

ALTER TABLE public.astrologer_client_charts
    ADD COLUMN IF NOT EXISTS node_mode
    text NOT NULL DEFAULT 'true'
    CHECK (node_mode IN ('mean', 'true'));

GRANT UPDATE (preferred_node_mode)
    ON public.profiles
    TO authenticated;

COMMIT;