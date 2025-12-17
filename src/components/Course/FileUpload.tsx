import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { courseApi } from '../../api/courseApi';

interface FileUploadProps {
  apiKey: string | null;
  onUploadSuccess: (data: { text: string; pageCount: number; fileName: string }) => void;
  onError: (error: string) => void;
}

export function FileUpload({ apiKey, onUploadSuccess, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check if it's an image and we need API key
    const isImage = file.type.startsWith('image/');
    if (isImage && !apiKey) {
      onError('Please add your Gemini API key first to process images');
      return;
    }

    setIsUploading(true);

    try {
      const response = await courseApi.uploadFile(file, apiKey || undefined);

      if (response.success) {
        onUploadSuccess({
          text: response.text,
          pageCount: response.page_count,
          fileName: file.name,
        });
      } else {
        onError(response.error || 'Failed to process file');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      onError(axiosError.response?.data?.detail || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer bg-white transition-colors ${
        isDragging
          ? 'border-purple-400 bg-purple-50'
          : 'border-gray-300 hover:border-purple-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,.docx,.png,.jpg,.jpeg,.gif,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isUploading ? (
        <>
          <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Processing...</h3>
          <p className="text-gray-500">Extracting text from your document</p>
        </>
      ) : (
        <>
          <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Course Material
          </h3>
          <p className="text-gray-500 mb-4">
            Drag & drop your PDF, Word, text file, or image
          </p>
          <button className="btn-primary">Select File</button>
          <p className="text-xs text-gray-400 mt-4">
            Supports: PDF, DOCX, TXT, MD, PNG, JPG
          </p>
        </>
      )}
    </div>
  );
}
