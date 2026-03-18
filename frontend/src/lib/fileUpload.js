const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'];
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export const FILE_UPLOAD_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

const hasHttpProtocol = (value) => /^https?:\/\//i.test(value);
const hasCloudinaryHost = (value) => /res\.cloudinary\.com/i.test(value);

const createFileId = (fieldKey, index) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${fieldKey}-${index}-${crypto.randomUUID()}`;
  }

  return `${fieldKey}-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getFileExtension = (value = '') => {
  const cleanValue = String(value).trim().split('?')[0].split('#')[0];
  const extension = cleanValue.includes('.') ? cleanValue.split('.').pop() : '';
  return extension?.toLowerCase() || '';
};

export const isImageFile = (file) => Boolean(file?.type?.startsWith('image/'));

export const isAllowedUploadFile = (file) => {
  if (!(file instanceof File)) {
    return false;
  }

  const mime = String(file.type || '').toLowerCase();
  if (ALLOWED_MIME_TYPES.has(mime)) {
    return true;
  }

  const extension = getFileExtension(file.name || '');
  return ALLOWED_EXTENSIONS.has(extension);
};

export const isImageUrl = (value = '') => {
  if (typeof value !== 'string' || !hasHttpProtocol(value)) {
    return false;
  }

  const extension = getFileExtension(value);
  return IMAGE_EXTENSIONS.includes(extension) || /\/image\/upload\//i.test(value);
};

export const isUploadUrl = (value = '') => {
  if (typeof value !== 'string' || !hasHttpProtocol(value)) {
    return false;
  }

  return isImageUrl(value) || hasCloudinaryHost(value);
};

export const formatFileSize = (size = 0) => {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 KB';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const createSelectedFiles = (fileList, fieldKey) => {
  const files = Array.isArray(fileList) ? fileList : Array.from(fileList || []);

  return files
    .filter((file) => file instanceof File)
    .map((file, index) => {
      const image = isImageFile(file);

      return {
        id: createFileId(fieldKey, index),
        file,
        name: file.name,
        size: file.size,
        kind: image ? 'image' : 'file',
        previewUrl: image ? URL.createObjectURL(file) : '',
      };
    });
};

export const revokeSelectedFiles = (items = []) => {
  const revokedUrls = new Set();

  items.forEach((item) => {
    const previewUrl = item?.previewUrl;
    if (!previewUrl || revokedUrls.has(previewUrl)) {
      return;
    }

    revokedUrls.add(previewUrl);
    URL.revokeObjectURL(previewUrl);
  });
};
