
-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Add missing column to candidatos_cuidadores_rows table
ALTER TABLE public.candidatos_cuidadores_rows 
ADD COLUMN IF NOT EXISTS estado text;

-- Update testimonials table to have proper defaults for required fields
ALTER TABLE public.testimonials 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at SET DEFAULT now();

-- Update partners table to have proper defaults
ALTER TABLE public.partners 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at SET DEFAULT now();
