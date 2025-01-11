import { Button } from '@/ui/components/shared/button';
import { Input } from '@/ui/components/shared/input';
import { Toaster } from '@/ui/components/shared/toaster';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUploadFile } from './hooks/use-upload-file';

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const { isUploading, mutateAsync } = useUploadFile({
    onSuccess: (file) => {
      toast.success(`Upload do arquivo ${file.name} finalizado`);
      setFile(null);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    await mutateAsync({ file });
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
