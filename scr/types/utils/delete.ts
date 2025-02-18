import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types';
import * as qiniu from 'qiniu';
import type { QiniuAdapterOptions } from '../../types';

export const handleDelete = (options: QiniuAdapterOptions): HandleDelete => {
  return async ({ filename, collection }) => {
    const mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    
    const key = `${collection.slug}/${filename}`;
    
    return new Promise((resolve, reject) => {
      bucketManager.delete(options.bucket, key, function(err, respBody, respInfo) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
};