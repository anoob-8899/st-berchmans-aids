import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  isValid: boolean;
  isImage: boolean;
  isDoc: boolean;
  detectedMime: string;
  detectedExt: string;
  error?: string;
}

/**
 * Server-side File Inspection using Binary Magic Numbers (Header Signatures).
 * Never trusts client-reported MIME types or extensions alone.
 */
export function inspectFileBuffer(buffer: Buffer, originalFilename: string): FileValidationResult {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, isImage: false, isDoc: false, detectedMime: '', detectedExt: '', error: 'Empty file buffer' };
  }

  // 1. Magic byte signatures
  const headerHex = buffer.subarray(0, 12).toString('hex').toUpperCase();

  let isImage = false;
  let isDoc = false;
  let detectedMime = '';
  let detectedExt = '';

  // JPEG: FF D8 FF
  if (headerHex.startsWith('FFD8FF')) {
    isImage = true;
    detectedMime = 'image/jpeg';
    detectedExt = '.jpg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  else if (headerHex.startsWith('89504E47')) {
    isImage = true;
    detectedMime = 'image/png';
    detectedExt = '.png';
  }
  // GIF: 47 49 46 38
  else if (headerHex.startsWith('47494638')) {
    isImage = true;
    detectedMime = 'image/gif';
    detectedExt = '.gif';
  }
  // WEBP: 52 49 46 46 ... 57 45 42 50
  else if (headerHex.startsWith('52494646') && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    isImage = true;
    detectedMime = 'image/webp';
    detectedExt = '.webp';
  }
  // PDF: 25 50 44 46 (%PDF)
  else if (headerHex.startsWith('25504446')) {
    isDoc = true;
    detectedMime = 'application/pdf';
    detectedExt = '.pdf';
  }
  // Office OpenXML / ZIP (DOCX, PPTX, XLSX): 50 4B 03 04 (PK..)
  else if (headerHex.startsWith('504B0304')) {
    isDoc = true;
    const lowerName = originalFilename.toLowerCase();
    if (lowerName.endsWith('.docx')) {
      detectedMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      detectedExt = '.docx';
    } else if (lowerName.endsWith('.pptx')) {
      detectedMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      detectedExt = '.pptx';
    } else {
      detectedMime = 'application/zip';
      detectedExt = '.zip';
    }
  }
  // Text / ASCII check
  else if (isPrintableAscii(buffer.subarray(0, Math.min(buffer.length, 512)))) {
    isDoc = true;
    detectedMime = 'text/plain';
    detectedExt = '.txt';
  }

  if (!isImage && !isDoc) {
    return {
      isValid: false,
      isImage: false,
      isDoc: false,
      detectedMime: '',
      detectedExt: '',
      error: 'File type verification failed. Uploaded content header signature is not a recognized image (JPEG, PNG, WEBP, GIF) or document (PDF, DOCX, PPTX, TXT).',
    };
  }

  return { isValid: true, isImage, isDoc, detectedMime, detectedExt };
}

function isPrintableAscii(buf: Buffer): boolean {
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    if (byte !== 9 && byte !== 10 && byte !== 13 && (byte < 32 || byte > 126)) {
      return false;
    }
  }
  return true;
}

/**
 * Uploads file buffer to Cloudinary persistent cloud storage.
 * Works for both images and documents with fallback data-uri support in local dev if credentials are not set.
 */
export async function uploadToCloudStorage(
  buffer: Buffer,
  filename: string,
  inspection: FileValidationResult
): Promise<string> {
  const isCloudinaryConfigured =
    Boolean(process.env.CLOUDINARY_URL) ||
    Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud');

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const folder = inspection.isImage ? 'sbc_aids/images' : 'sbc_aids/documents';
      const resourceType = inspection.isImage ? 'image' : 'auto';

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${Date.now()}_${filename.replace(/[^a-zA-Z0-9]/g, '_')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error(`Cloud storage upload failed: ${error.message}`));
          }
          if (result && result.secure_url) {
            return resolve(result.secure_url);
          }
          return reject(new Error('Cloud storage upload returned invalid URL response'));
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Cloudinary storage required for durable production file persistence
  throw new Error(
    'Cloud storage is not configured. Please set valid Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET or CLOUDINARY_URL) for durable media and document storage.'
  );
}
