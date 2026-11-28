-- Sarathi: Activate Mean Node defaults
--
-- RELEASE GATE:
-- Apply only as part of the coordinated application rollout.
-- Confirm all active clients explicitly preserve saved conventions.
--
-- This migration changes defaults for future records only.
-- Existing True and Mean Node records must remain unchanged.

BEGIN;

ALTER TABLE public.profiles
    ALTER COLUMN preferred_node_mode SET DEFAULT 'mean';

ALTER TABLE public.saved_birth_profiles
    ALTER COLUMN node_mode SET DEFAULT 'mean';

ALTER TABLE public.user_charts
    ALTER COLUMN node_mode SET DEFAULT 'mean';

ALTER TABLE public.astrologer_client_charts
    ALTER COLUMN node_mode SET DEFAULT 'mean';

COMMIT;

-- Rollback, if required:
--
-- BEGIN;
-- ALTER TABLE public.profiles
--     ALTER COLUMN preferred_node_mode SET DEFAULT 'true';
-- ALTER TABLE public.saved_birth_profiles
--     ALTER COLUMN node_mode SET DEFAULT 'true';
-- ALTER TABLE public.user_charts
--     ALTER COLUMN node_mode SET DEFAULT 'true';
-- ALTER TABLE public.astrologer_client_charts
--     ALTER COLUMN node_mode SET DEFAULT 'true';
-- COMMIT;
--
-- Rollback changes defaults only, not existing records.