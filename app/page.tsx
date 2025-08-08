/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "./components/Header";
import { NotificationProvider } from "./components/Notification";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { cookies } from "next/headers";

async function getVideos(): Promise<IVideo[]> {
  try {
    // Since our api (i.e /api/video) is protected by the middleware. we need to pass the session token in the request headers.
    // Get cookies to pass authentication
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    // Since it is a server side component so we need to use the full URL for our API endpoint
    const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/video`, {
      method: "GET",
      cache: "no-store", // This ensures fresh data on each request
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const videos = await response.json();
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <NotificationProvider>
      <Header />
      <VideoFeed videos={videos} />
    </NotificationProvider>
  );
}
