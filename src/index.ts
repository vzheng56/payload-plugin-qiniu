import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import type { CollectionOptions } from '@payloadcms/plugin-cloud-storage/types';
import { createQiniuAdapter } from './adapter/qiniuAdapter';
import type { QiniuStorageConfig } from './types';

export const qiniuStorage = (config: QiniuStorageConfig) => {
  const { collections, options, enabled = true } = config;

  return cloudStoragePlugin({
    enabled,
    collections: Object.entries(collections).reduce<Record<string, CollectionOptions>>((acc, [name, enabled]) => {
      if (enabled) {
        acc[name] = {
          adapter: () => createQiniuAdapter(options),
          disableLocalStorage: true,
          ...(options.acl === 'public-read' && { disablePayloadAccessControl: true }),
        };
      }
      return acc;
    }, {}),
  });
};

export * from './types';