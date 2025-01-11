import { FILE_CHUNK_SIZE } from '@/constants/file';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { MPUUploader } from '../lib/mpu-uploader';
import { abortMPU } from '../services/abort-mpu';
import { completeUpload } from '../services/complete-upload';
import { prepareMPUUpload, prepareSingleUpload } from '../services/prepare-upload';
import { uploadFile } from '../services/upload-file';

type Options = {
  onSuccess?: (file: File) => void;
};

type UploadParams = {
  file: File;
};

export function useUploadFile(options?: Options) {
  const [isUploading, setIsUploading] = useState(false);

  const mutateAsync = useCallback(
    async ({ file }: UploadParams) => {
      const fileName = file.name;
      const totalChunks = Math.ceil(file.size / FILE_CHUNK_SIZE);

      try {
        setIsUploading(true);

        if (totalChunks > 1) {
          const { key, parts, uploadId } = await prepareMPUUpload({ fileName, totalChunks });

          try {
            const completedParts = await new MPUUploader({ file, parts }).upload();
            await completeUpload({ uploadId, fileKey: key, parts: completedParts });
          } catch (error) {
            await abortMPU({ fileKey: key, uploadId });
            throw error;
          }
        }

        if (totalChunks <= 1) {
          const { url } = await prepareSingleUpload({ fileName });
          await uploadFile({ url, blob: file });
        }

        options?.onSuccess?.(file);
      } catch {
        toast.error('Ocorreu um erro ao fazer upload');
      } finally {
        setIsUploading(false);
      }
    },
    [options],
  );

  return { mutateAsync, isUploading };
}
