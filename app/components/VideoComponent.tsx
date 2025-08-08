import { Video } from '@imagekit/next';
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="group bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative block w-full">
          <div
            className="rounded-lg overflow-hidden relative w-full bg-gray-700"
            style={{ aspectRatio: "9/16" }}
          >
            <Video
              path={video.videoUrl}
              src={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
      </figure>
      <div className="p-4 space-y-2">
        <Link
          href={`/videos/${video._id}`}
          className="block hover:opacity-80 transition-opacity duration-300"
        >
          <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {video.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-400 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}