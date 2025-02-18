import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types';
import type { QiniuAdapterOptions } from '../../types';
import { generateUrl } from './url';

const ensureHttps = (domain: string) => {
  if (!domain.startsWith('http')) {
    return `https://${domain}`;
  }
  return domain;
};

export const staticHandler = (options: QiniuAdapterOptions): StaticHandler => {
  return async (_req, { doc, params: { collection, filename } }) => {
    try {
      // 如果是公开访问，直接重定向到七牛
      if (options.acl === 'public-read') {
        const domain = ensureHttps(options.domain);
        const url = `${domain}/${collection}/${filename}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: url,
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 生成私有访问链接
      const url = await generateUrl(options)({ 
        filename, 
        collection: { 
          slug: collection, 
          fields: [] 
        },
        data: doc
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: url,
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  };
};