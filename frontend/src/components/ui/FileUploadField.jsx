import React from 'react';
import { File, FileText, ImageIcon, Upload, X } from 'lucide-react';

import { formatFileSize } from '@/lib/fileUpload';

const kindIcon = {
  image: ImageIcon,
  pdf: FileText,
  file: File,
};

export default function FileUploadField({
  label,
  required = false,
  files = [],
  onFilesSelected,
  onRemoveFile,
  accept,
  helperText = 'Upload one or more files.',
  errorText = '',
  inputId,
  multiple = true,
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <label
        htmlFor={inputId}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/60"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 transition group-hover:scale-[1.02] group-hover:ring-blue-200">
          <Upload className="h-5 w-5" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-900">Choose files to upload</p>
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        <input
          id={inputId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files || []);
            if (nextFiles.length > 0) {
              onFilesSelected?.(nextFiles);
            }
            event.target.value = '';
          }}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((item) => {
            const Icon = kindIcon[item.kind] || File;

            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative">
                  {item.kind === 'image' && item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.name} className="h-36 w-full object-cover" />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                          {item.kind === 'pdf' ? 'PDF' : 'File'}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveFile?.(item.id)}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:bg-white hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1 px-4 py-3">
                  <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errorText && <p className="text-sm font-medium text-red-600">{errorText}</p>}
    </div>
  );
}
