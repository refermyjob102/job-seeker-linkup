
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (
  file: File,
  folder: string,
  oldPath?: string
): Promise<string> => {
  try {
    // Delete old file if it exists
    if (oldPath) {
      await supabase.storage
        .from('user-files')
        .remove([oldPath]);
    }

    // Upload new file
    const fileExt = file.name.split('.').pop();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const filePath = `${userId}/${folder}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('user-files')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
