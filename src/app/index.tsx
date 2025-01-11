import { FILE_CHUNK_SIZE } from '@/constants/file';
import { Button } from '@/ui/components/shared/button';
import { Input } from '@/ui/components/shared/input';
import { Toaster } from '@/ui/components/shared/toaster';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Uploader } from './lib/uploader';
import { completeUpload } from './services/complete-upload';
import { prepareUpload } from './services/prepare-upload';

export default function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    const totalChunks = Math.ceil(file.size / FILE_CHUNK_SIZE);

    if (totalChunks < 1) {
      toast('Handle default upload');
      return;
    }

    try {
      setIsUploading(true);

      const { key, parts, uploadId } = await prepareUpload({ fileName: file.name, totalChunks });

      const uploader = new Uploader({ file, parts });
      const completedParts = await uploader.upload();

      await completeUpload({ uploadId, fileKey: key, parts: completedParts });

      toast.success(`Upload do arquivo ${file.name} finalizado`);

      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Toaster />

      <div className="grid min-h-screen w-full place-items-center">
        <div className="w-full max-w-lg">
          <h1 className="mb-10 text-4xl font-semibold tracking-tighter">Selecione um arquivo</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input type="file" onChange={(event) => setFile(event.target.files?.[0]!)} />

            <Button type="submit" className="w-full" disabled={!file || isUploading}>
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
