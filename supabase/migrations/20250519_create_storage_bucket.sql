
-- Create a storage bucket for public content images
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'Public Storage Bucket', true);

-- Set up RLS policy to allow public access to view the content
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'public');

-- Allow authenticated users to insert into public bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public' AND
    auth.role() = 'authenticated'
  );

-- Allow users to update their own objects
CREATE POLICY "Users can update own objects" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'public' AND
    auth.uid() = owner
  );

-- Allow users to delete their own objects
CREATE POLICY "Users can delete own objects" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'public' AND
    auth.uid() = owner
  );
