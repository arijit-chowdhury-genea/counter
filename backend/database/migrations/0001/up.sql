CREATE TABLE IF NOT EXISTS public.counter (
    uuid       uuid                   NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name       character varying(255) NOT NULL,
    end_date   timestamp              NOT NULL,
    created_at timestamp              NOT NULL DEFAULT now(),
    updated_at timestamp              NOT NULL DEFAULT now()
);