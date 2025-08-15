import React, { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  id?: string;
  isRequired?: boolean;
  label?: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUploader = ({
  value,
  onChange,
  disabled = false,
  isRequired = false,
  label,
  id,
}: ImageUploaderProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === "string" && value) {
      setPreview(value);
      setError(null);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
      setError(null);
    } else {
      setPreview(null);
      setError(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500"> *</span>}
      </label>
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-pink-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`
            flex flex-col items-center justify-center w-full h-32 
            border-2 border-dashed border-pink-400 rounded-lg cursor-pointer 
            bg-pink-50 hover:bg-pink-100 transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click to upload image</span>
            </p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUploader;
