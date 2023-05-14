INSERT INTO public.counter(name, end_date)
VALUES ($1, $2)
RETURNING $3;