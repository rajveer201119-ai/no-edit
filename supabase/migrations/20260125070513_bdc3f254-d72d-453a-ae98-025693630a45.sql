-- Create storage policies for post-images bucket to allow authenticated users to upload
-- Using user_id as the first folder segment for proper access control

-- Policy: Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access (bucket is already public)
CREATE POLICY "Public read access for post-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'post-images');