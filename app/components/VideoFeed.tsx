import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoComponent key={video._id?.toString()} video={video} />
          ))}
        </div>
        {videos.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-blue-400 animate-pulse">
              No videos found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}