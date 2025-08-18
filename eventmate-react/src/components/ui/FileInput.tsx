import Button from "./Button";
import Label from "./Label";
import { useRef, useState } from "react";

interface FileInputProps {
  label: string;
  accept: "image/*" | "audio/*" | "video/*" | "audio/mp3";
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  limitMb?: number;
  initialFileName?: string;
}

const FileInput = ({
  label,
  accept,
  onChange,
  error,
  required = false,
  limitMb = 5,
  initialFileName,
}: FileInputProps) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    initialFileName || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > limitMb * 1024 * 1024) {
        onChange(null);
        setSelectedFileName(null);
        return;
      }

      if (!file.type.startsWith(accept.split("/")[0])) {
        onChange(null);
        setSelectedFileName(null);
        return;
      }

      onChange(file);
      setSelectedFileName(file.name);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange(null);
    setSelectedFileName(null);
  };

  return (
    <div className="mb-4">
      <Label required={required}>{label}</Label>

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={`w-full px-4 py-3 border rounded-lg placeholder:text-pink-300 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-pink-400 focus:ring-pink-300"
          } bg-pink-50 text-pink-900`}
          required={required}
        />

        {selectedFileName && (
          <div className="mt-2 flex items-center justify-between bg-pink-100 p-3 rounded-lg border border-pink-300 shadow-sm">
            <span
              className="text-sm text-pink-900 truncate max-w-[70%]"
              title={selectedFileName}
            >
              📎 {selectedFileName}
            </span>
            <Button
              variant="destructive"
              type="button"
              onClick={clearFile}
              className="text-sm px-3 py-1"
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-pink-700">
        Accepted file types: {accept}. Max size: {limitMb}MB
      </p>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
