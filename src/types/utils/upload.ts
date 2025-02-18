import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types';
import * as qiniu from 'qiniu';
import type { QiniuAdapterOptions } from '../../types';
import { generateToken } from './token';

export const handleUpload = (options: QiniuAdapterOptions): HandleUpload => {
  return async ({ file, collection, data }) => {
    const { token } = generateToken(options);
    
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone[options.region as keyof typeof qiniu.zone];
    
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    
    const key = `${collection.slug}/${file.filename}`;
    
    return new Promise((resolve, reject) => {
      formUploader.put(token, key, file.buffer, putExtra, function(err, body, info) {
        if (err) {
          return reject(err);
        }
        
        if (info.statusCode === 200) {
          // 更新 data 对象
          data.filename = file.filename;
          data._key = key;
          
          // 如果是图片大小变体，更新对应的 size 信息
          const foundSize = Object.keys(data.sizes || {}).find(
            (sizeKey) => data.sizes?.[sizeKey]?.filename === file.filename
          );
          
          if (foundSize) {
            data.sizes[foundSize]._key = key;
          }
          
          resolve(data);
        } else {
          reject(new Error(`Upload failed with status ${info.statusCode}`));
        }
      });
    });
  };
};