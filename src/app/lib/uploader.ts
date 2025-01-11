import { FILE_CHUNK_SIZE } from '@/constants/file';
import { uploadFile } from '../services/uploada-file';

type Part = {
  url: string;
  partNumber: number;
};

type Params = {
  parts: Part[];
  file: File;
};

export class Uploader {
  private readonly chunkSize = 6;
  private readonly chunks: Part[][] = [[]];
  private readonly file: File;

  constructor({ file, parts }: Params) {
    this.file = file;
    this.separateChunks(parts);
  }

  async upload() {
    const list: { partNumber: number; entityTag: string }[] = [];

    for await (const chunk of this.chunks) {
      const promises = chunk.map((part, index) => this.uploadPart(part, index));
      list.push(...(await Promise.all(promises)));
    }

    return list;
  }

  private async uploadPart(part: Part, index: number) {
    const { partNumber, url } = part;

    const chunkStart = index * FILE_CHUNK_SIZE;
    const end = Math.min(chunkStart + FILE_CHUNK_SIZE, this.file.size);
    const chunk = this.file.slice(chunkStart, end);

    const { entityTag } = await uploadFile({ url, blob: chunk });

    return { partNumber, entityTag };
  }

  private separateChunks(parts: Part[]) {
    let currentIndex = 0;

    parts.forEach((part) => {
      if (!this.chunks[currentIndex]) {
        this.chunks[currentIndex] = [];
      }

      if (this.chunks[currentIndex].length >= this.chunkSize) {
        ++currentIndex;
        this.chunks[currentIndex] = [part];
        return;
      }

      this.chunks[currentIndex].push(part);
    });
  }

  private formatEntityTag(etag: string) {
    return etag?.replace(/"/g, '');
  }
}
