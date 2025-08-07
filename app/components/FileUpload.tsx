"use client"; // This component must be a client component

import {
  // ImageKitAbortError,
  // ImageKitInvalidRequestError,
  // ImageKitServerError,
  // ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        setError("Please upload a valid video file (MP4, WebM, or OGG)");
        return false;
      }
    } else if (fileType === "image") {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to fetch ImageKit authentication parameters");
      }
      // get the auth object from the response
      const auth = await authRes.json();

      // Check for error in the response
      if (auth.error) {
        throw new Error(auth.error);
      }

      // Access nested authenticationParameters
      const { token, signature, expire } = auth.authenticationParameters;

      // ImageKit upload options
      const res = await upload({
        file,
        fileName: file.name,
        // publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        publicKey: auth.publicKey, // Use publicKey from the response
        signature,
        expire,
        token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });
      onSuccess(res);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl">
      <div className="flex flex-col items-center space-y-4">
        <label
          htmlFor="file-upload"
          className="w-full px-4 py-3 bg-gray-700 text-white text-center rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition duration-300"
        >
          <span className="font-semibold">
            {fileType === "video" ? "Upload Video" : "Upload Image"}
          </span>
          <input
            id="file-upload"
            type="file"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {uploading && (
          <span className="text-gray-300 flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        )}
        {error && <span className="text-red-500 font-medium">{error}</span>}
      </div>
    </div>
  );
};

export default FileUpload;
