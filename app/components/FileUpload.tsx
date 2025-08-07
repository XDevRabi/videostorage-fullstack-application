"use client"; // This component must be a client component

import {
  // ImageKitAbortError,
  // ImageKitInvalidRequestError,
  // ImageKitServerError,
  // ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import React, { useState } from "react";

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({
  onSuccess,
  onProgress,
  onError,
  fileType,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        setError("Please upload a valid video file (MP4, WebM, or OGG)");
        onError?.("Please upload a valid video file (MP4, WebM, or OGG)");
        return false;
      }
    } else if (fileType === "image") {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)");
        onError?.("Please upload a valid image file (JPEG, PNG, or GIF)");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      onError?.("File size must be less than 100 MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);
    setProgress(0);

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
      if (!token || !signature || !expire) {
        throw new Error("Missing authentication parameters");
      }

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
            setProgress(Math.round(percent));
            onProgress(Math.round(percent));
          }
        },
      });
      onSuccess(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMessage = error.message || "Failed to upload file";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
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
          accept={
            fileType === "video"
              ? "video/mp4,video/webm,video/ogg"
              : "image/jpeg,image/png,image/gif"
          }
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {uploading && (
        <div className="w-full mt-5">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-gray-300 text-sm">
                {progress ? `Uploading: ${progress}%` : "Loading..."}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {error && <span className="text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default FileUpload;
