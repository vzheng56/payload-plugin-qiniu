import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types';
import * as qiniu from 'qiniu';
import type { QiniuAdapterOptions } from '../../types';

const ensureHttps = (domain: string) => {
  if (!domain.startsWith('http')) {
    return `https://${domain}`;
  }
  return domain;
};

export const generateUrl = (options: QiniuAdapterOptions): GenerateURL => {
  return ({ filename, collection }) => {
    const domain = ensureHttps(options.domain);
    
    if (options.acl === 'public-read') {
      return `${domain}/${collection.slug}/${filename}`;
    }

    const mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
    const key = `${collection.slug}/${filename}`;
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时有效期
    
    return qiniu.util.generateAccessToken(mac, `${domain}/${key}`, deadline.toString());
  };
};