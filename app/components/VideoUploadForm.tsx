"use client";

import React, { useState } from "react";
import FileUpload from "./FileUpload";

interface UploadResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: { id: string; name: string };
  filePath: string;
  url: string;
  height: number;
  width: number;
  bitRate: number;
  duration: number;
  audioCodec: string;
  videoCodec: string;
  fileType: string;
  AITags: string[] | null;
  description: string | null;
}

const VideoUploadForm = () => {
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSuccess = (response: UploadResponse) => {
    console.log("Upload successful:", response);
    setUploadResult(response);
    setError(null);
  };

  const onProgress = (percent: number) => {
    console.log("Upload progress:", percent + "%");
  };

  return (
    <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
      <p className="text-gray-400 text-center">
        Select a video file (MP4, WebM, or OGG, max 100MB)
      </p>
      <FileUpload
        onSuccess={onSuccess}
        onProgress={onProgress}
        fileType="video"
      />
      {uploadResult && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg text-white">
          <h2 className="text-lg font-semibold">Upload Successful!</h2>
          <p className="mt-2">
            <strong>File Name:</strong> {uploadResult.name}
          </p>
          <p className="mt-1">
            <strong>URL:</strong>{" "}
            <a
              href={uploadResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {uploadResult.url}
            </a>
          </p>
          <p className="mt-1">
            <strong>Duration:</strong> {uploadResult.duration} seconds
          </p>
          <p className="mt-1">
            <strong>Resolution:</strong> {uploadResult.width} x{" "}
            {uploadResult.height}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-600 rounded-lg text-white">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VideoUploadForm;
