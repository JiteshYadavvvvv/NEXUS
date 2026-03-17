const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'];
const PDF_MIME_TYPE = 'application/pdf';

export const FILE_UPLOAD_ACCEPT = 'image/*,.pdf,application/pdf';

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

export const isPdfFile = (file) => file?.type === PDF_MIME_TYPE;

export const isImageUrl = (value = '') => {
  if (typeof value !== 'string' || !hasHttpProtocol(value)) {
    return false;
  }

  const extension = getFileExtension(value);
  return IMAGE_EXTENSIONS.includes(extension) || /\/image\/upload\//i.test(value);
};

export const isPdfUrl = (value = '') => {
  if (typeof value !== 'string' || !hasHttpProtocol(value)) {
    return false;
  }

  return getFileExtension(value) === 'pdf' || /\.pdf($|[?#])/i.test(value);
};

export const isUploadUrl = (value = '') => {
  if (typeof value !== 'string' || !hasHttpProtocol(value)) {
    return false;
  }

  return isImageUrl(value) || isPdfUrl(value) || hasCloudinaryHost(value);
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
        kind: image ? 'image' : isPdfFile(file) ? 'pdf' : 'file',
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
