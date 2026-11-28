-- Transit Query distributed rate limiting.
-- Previously applied through Supabase SQL Editor.
-- Limits: 10 requests per minute and 60 per hour per user.

BEGIN;

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint text NOT NULL,
    window_seconds integer NOT NULL,
    window_start timestamptz NOT NULL,
    request_count integer NOT NULL DEFAULT 1
        CHECK (request_count > 0),
    PRIMARY KEY (
        user_id,
        endpoint,
        window_seconds,
        window_start
    )
);

ALTER TABLE public.api_rate_limits
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.api_rate_limits
    FROM PUBLIC, anon, authenticated;

CREATE INDEX IF NOT EXISTS api_rate_limits_cleanup_idx
    ON public.api_rate_limits(window_start);

CREATE OR REPLACE FUNCTION
    public.check_transit_query_rate_limit()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_now timestamptz := clock_timestamp();
    v_minute timestamptz;
    v_hour timestamptz;
    v_minute_count integer;
    v_hour_count integer;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;

    v_minute := date_trunc('minute', v_now);
    v_hour := date_trunc('hour', v_now);

    INSERT INTO public.api_rate_limits AS limits
        (user_id, endpoint, window_seconds,
         window_start, request_count)
    VALUES
        (v_user_id, 'transit-query', 60, v_minute, 1)
    ON CONFLICT
        (user_id, endpoint, window_seconds, window_start)
    DO UPDATE SET
        request_count = LEAST(limits.request_count + 1, 11)
    RETURNING request_count INTO v_minute_count;

    IF v_minute_count > 10 THEN
        RETURN false;
    END IF;

    INSERT INTO public.api_rate_limits AS limits
        (user_id, endpoint, window_seconds,
         window_start, request_count)
    VALUES
        (v_user_id, 'transit-query', 3600, v_hour, 1)
    ON CONFLICT
        (user_id, endpoint, window_seconds, window_start)
    DO UPDATE SET
        request_count = LEAST(limits.request_count + 1, 61)
    RETURNING request_count INTO v_hour_count;

    RETURN v_hour_count <= 60;
END;
$$;

REVOKE ALL ON FUNCTION
    public.check_transit_query_rate_limit()
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.check_transit_query_rate_limit()
    TO authenticated;

COMMIT;

-- Automatic cleanup of expired rate-limit records.

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'sarathi-api-rate-limit-cleanup',
    '15 3 * * *',
    $job$
        DELETE FROM public.api_rate_limits
        WHERE window_start < now() - interval '48 hours';
    $job$
);