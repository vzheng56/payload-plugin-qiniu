# payload-plugin-qiniu

Qiniu Cloud Storage adapter for Payload CMS.

## Installation

```bash
pnpm add payload-plugin-qiniu
# or
npm install payload-plugin-qiniu
# or
yarn add payload-plugin-qiniu
```

## Usage

### 1. Environment Variables

```env
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET=your-bucket-name
QINIU_DOMAIN=your-domain  # e.g., media.example.com
```

### 2. Basic Setup

```typescript
import { buildConfig } from 'payload/config';
import { qiniuStorage } from 'payload-plugin-qiniu';

export default buildConfig({
  plugins: [
    qiniuStorage({
      collections: {
        media: true,  // Enable Qiniu storage for media collection
      },
      options: {
        region: 'z0',  // z0: East China, z1: North China, z2: South China, etc.
        acl: 'public-read',  // or 'private'
        accessKey: process.env.QINIU_ACCESS_KEY,
        secretKey: process.env.QINIU_SECRET_KEY,
        bucket: process.env.QINIU_BUCKET,
        domain: process.env.QINIU_DOMAIN,
      },
    }),
  ],
});
```

### 3. Collection Configuration

```typescript
import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    // Optional: Image sizes for thumbnails
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
      }
    ],
    // Optional: Format conversion
    formatOptions: {
      format: 'webp',
    },
    disableLocalStorage: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    }
  ],
};
```

## Features

- 🚀 High-performance file uploads via Qiniu CDN
- 🔒 Supports both public and private access control
- 🖼️ Automatic image processing and thumbnail generation
- 📦 Supports all file types (images, videos, documents, etc.)
- 🌐 Global CDN distribution
- 🔑 Secure URL generation for private files
- ⚡ Direct CDN URLs for optimal performance

## File Access

### Public Files
```typescript
// Direct CDN access (recommended)
https://your-domain.com/collection-name/filename.ext

// Through Payload API
http://your-api.com/api/collection-name/filename.ext
```

### Private Files
Private files URLs include a time-limited token:
```typescript
// URLs are automatically signed with a 1-hour expiration
https://your-domain.com/collection-name/filename.ext?token=xxx...
```

## API Reference

### Plugin Options

```typescript
interface QiniuStorageConfig {
  collections: {
    [key: string]: true;  // Collections to enable Qiniu storage for
  };
  options: {
    region: 'z0' | 'z1' | 'z2' | 'na0' | 'as0';  // Storage region
    acl: 'private' | 'public-read';  // Access control
    accessKey: string;  // Qiniu access key
    secretKey: string;  // Qiniu secret key
    bucket: string;     // Bucket name
    domain: string;     // CDN domain
  };
  enabled?: boolean;    // Optional: Enable/disable the plugin
}
```

## Examples

### Upload a File
```typescript
const response = await payload.create({
  collection: 'media',
  data: {
    alt: 'File description',
  },
  file: fileBuffer,
});
```

### Retrieve File URLs
```typescript
const file = await payload.findByID({
  collection: 'media',
  id: fileId,
});

// Access URLs
const fileUrl = file.url;  // Original file URL
const thumbnailUrl = file.sizes?.thumbnail?.url;  // Thumbnail URL
```

### Delete a File
```typescript
await payload.delete({
  collection: 'media',
  id: fileId,
});
```

## Notes

1. Domain Configuration:
   - Do not include protocol prefix (http:// or https://)
   - The adapter automatically adds https:// prefix
   - Supports custom domains

2. File Naming:
   - Special characters are automatically sanitized
   - Supports UTF-8 filenames
   - Recommended to use URL-safe characters

3. Security:
   - Supports hotlink protection
   - Automatic token generation for private files
   - Access control via Qiniu bucket settings

## License

MIT

## Author

[Your Name or Organization] 