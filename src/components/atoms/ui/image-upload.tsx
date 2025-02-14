import React, { useState } from "react";
import { message} from "antd";
import { PlusCircleIcon } from "lucide-react";

interface FileUploadProps {
  onImageUpload: (files: File[]) => void;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, multiple = false }) => {
  const [previews, setPreviews] = useState<string[]>([]); 
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); 

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      message.error("No files selected!");
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        message.error(`${file.name} is too large. Max file size is 5MB.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });
    console.log("Valid files:", validFiles);

    setSelectedFiles((prevFiles) => (multiple ? [...prevFiles, ...validFiles] : validFiles));
    setPreviews((prevPreviews) => (multiple ? [...prevPreviews, ...newPreviews] : newPreviews));

    onImageUpload(validFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);

    setPreviews(newPreviews);
    setSelectedFiles(newSelectedFiles);

    onImageUpload(newSelectedFiles);
  };

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {multiple ? "Upload Images" : "Upload Image"}
      </label>

      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative w-32 h-32 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs shadow hover:bg-red-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
        <label className="w-32 h-32 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple={multiple}
          />
          <PlusCircleIcon color="green" />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex justify-center mt-4 text-gray-500">
          {selectedFiles.length} file(s) selected.
        </div>
      )}
    </div>
  );
};

export default FileUpload;
