import React, { useEffect, useState } from "react";
import { message } from "antd";
import { PlusCircleIcon } from "lucide-react";

interface FileUploadProps {
  onImageUpload: (files: File[]) => void;
  multiple?: boolean;
  initialData?: string[]; 
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload, multiple = false, initialData = [] }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // 🟢 Load dữ liệu mặc định khi component được mount
  useEffect(() => {
    if (initialData.length > 0) {
      setPreviews(initialData); // Set ảnh mặc định
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      message.warning("No files selected!");
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        message.error(`${file.name} is not an image.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        message.error(`${file.name} is too large. Max file size is 5MB.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    // Cập nhật danh sách file và preview
    setSelectedFiles((prevFiles) => (multiple ? [...prevFiles, ...validFiles] : validFiles));
    setPreviews((prevPreviews) => (multiple ? [...prevPreviews, ...newPreviews] : newPreviews));

    onImageUpload(validFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    onImageUpload(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
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

        {/* Input Upload */}
        <label className="w-32 h-32 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple={multiple}
          />
          <PlusCircleIcon color="green" size={32} />
          <span className="text-xs mt-1">Add Image</span>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="text-gray-500 text-center mt-2">
          {selectedFiles.length} file(s) selected.
        </div>
      )}
    </div>
  );
};

export default FileUpload;
