/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "./components/Header";
import { NotificationProvider } from "./components/Notification";
import VideoFeed from "./components/VideoFeed";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";

export default async function Home() {
  let videos: IVideo[] = [];
  let error: string | null = null;

  try {
    videos = await apiClient.getVideos();
  } catch (err: any) {
    error = err.message || "Failed to load videos";
    console.error("Home component error:", error, err.stack);
  }

  return (
    <NotificationProvider>
      <Header />
      <VideoFeed videos={videos} />
    </NotificationProvider>
  );
}
