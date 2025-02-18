import type { Field } from 'payload';
import type { 
  GenerateURL, 
  HandleDelete, 
  HandleUpload, 
  StaticHandler 
} from '@payloadcms/plugin-cloud-storage/types';

export interface QiniuAdapterOptions {
  region: 'z0' | 'z1' | 'z2' | 'na0' | 'as0';
  acl: 'private' | 'public-read';
  accessKey: string;
  secretKey: string;
  bucket: string;
  domain: string;
}

export interface QiniuStorageConfig {
  collections: {
    [key: string]: true;
  };
  options: QiniuAdapterOptions;
  enabled?: boolean;
}

export interface QiniuUploadResult {
  filename: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
}

export interface QiniuTokenResult {
  token: string;
  expires: number;
}