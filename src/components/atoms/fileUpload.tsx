import React, { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  file: File;
}

interface FileUploadProps {
  onFileSelect?: (files: UploadedFile[]) => void;
  onFileRemove?: (fileId: string) => void;
  label?: string;
  maxFiles?: number;
  acceptedTypes?: string;
  className?: string;
}

const XIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  label = 'File',
  maxFiles = 1,
  acceptedTypes = "image/*,application/pdf,.doc,.docx,.txt",
  className = ""
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach(file => {
      if (newFiles.length >= maxFiles) {
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      };

      newFiles.push(uploadedFile);
    });

    if (newFiles.length > 0) {
      uploadedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });

      setUploadedFiles(newFiles);
      onFileSelect?.(newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(file => file.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFileRemove?.(fileId);
    onFileSelect?.(updatedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full mb-6 ${className}`}>
      <label className="text-base text-gray-800 mb-3 flex text-left">
        {label}
      </label>
      <div
        className={`relative border-1 bg-white rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer
          ${dragActive 
            ? 'border-purple-primary bg-purple-primary/5' 
            : 'hover:border-purple-primary hover:bg-gray-50'
          }`}
        style={{
          borderColor: dragActive ? undefined : '#CBB6E5'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          {uploadedFiles.length > 0 ? (
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {uploadedFiles[0].name}
              </p>
              </div>

              <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(uploadedFiles[0].id);
              }}
              className="w-5 h-5 flex-shrink-0 flex items-center justify-center p-0 text-white !bg-gray-800 hover:!bg-red-500 transition-colors duration-200 border-0 outline-none focus:outline-none"
              style={{ borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer' }}
              title="Удалить файл"
              >
              <span className="flex items-center justify-center">
                <XIcon className="w-4 h-4" />
              </span>
              </button>
            </div>
          ) : (
            <div>
              <span 
                className="text-lg font-base cursor-pointer" 
                style={{
                  color: 'var(--purple-primary)',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--purple-primary)'
                }}
              >
                Upload а file
              </span>
              <span className="hidden lg:inline text-lg font-base text-gray-600">
                {' '}or drag and drop here
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;