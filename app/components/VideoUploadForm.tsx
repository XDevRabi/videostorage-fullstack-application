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

  const onSuccess = async (response: UploadResponse) => {
    //   {
    //     "fileId": "6895a5ff5c7cd75eb8f1bc8f",
    //     "name": "BB_ZyldzI4F-.mp4",
    //     "size": 8070530,
    //     "versionInfo": {
    //         "id": "6895a5ff5c7cd75eb8f1bc8f",
    //         "name": "Version 1"
    //     },
    //     "filePath": "/BB_ZyldzI4F-.mp4",
    //     "url": "https://ik.imagekit.io/xdevrabi/BB_ZyldzI4F-.mp4",
    //     "height": 720,
    //     "width": 1152,
    //     "bitRate": 239642,
    //     "duration": 172,
    //     "audioCodec": "aac",
    //     "videoCodec": "h264",
    //     "fileType": "non-image",
    //     "AITags": null,
    //     "description": null
    // }
    try {
      const data = {
        title: response.name.split(".")[0],
        description: response.description || "Uploaded video",
        videoUrl: response.url,
        thumbnailUrl: `${response.url}?tr=w-300,h-300`,
        controls: true,
        transformation: {
          height: response.height,
          width: response.width,
          quality: 80,
        },
      };

      const apiResponse = await fetch(
        `/api/video`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to create video record");
      }

      setUploadResult(response);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
      setError(err.message);
      console.error("API Error:", err);
    }
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
