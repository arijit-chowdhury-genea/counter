DELETE FROM public.counter
WHERE uuid = $1
RETURNING $2;