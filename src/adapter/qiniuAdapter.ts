import type { GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types';
import type { QiniuAdapterOptions } from '../types';
import { generateUrl } from '../types/utils/url';
import { handleDelete } from '../types/utils/delete';
import { handleUpload } from '../types/utils/upload';
import { staticHandler } from '../types/utils/static';

export const createQiniuAdapter = (options: QiniuAdapterOptions): GeneratedAdapter => {
  return {
    name: 'qiniu',
    generateURL: generateUrl(options),
    handleDelete: handleDelete(options),
    handleUpload: handleUpload(options),
    staticHandler: staticHandler(options),
    onInit: () => {
      console.log('Qiniu storage adapter initialized');
    }
  };
};