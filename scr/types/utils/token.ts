import * as qiniu from 'qiniu';
import type { QiniuAdapterOptions, QiniuTokenResult } from '../../types';

export const generateToken = (
  options: QiniuAdapterOptions,
  key?: string
): QiniuTokenResult => {
  const mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: key ? `${options.bucket}:${key}` : options.bucket,
    expires: 3600
  });

  return {
    token: putPolicy.uploadToken(mac),
    expires: 3600
  };
};