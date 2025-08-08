# Video Storage Platform

A secure cloud platform for storing and managing video content, built with Next.js, MongoDB, and NextAuth.

## Features

- **User Authentication**: Secure sign-in/sign-up with NextAuth
- **Video Upload**: Upload videos with progress tracking
- **Video Management**: View, organize, and manage uploaded videos
- **Responsive Design**: Works on all device sizes
- **Modern Stack**: Built with Next.js App Router and TypeScript

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Mongoose)
- **Authentication**: NextAuth.js
- **File Storage**: ImageKit (for video hosting)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- ImageKit account (for video storage)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env.local` file based on `.sample.env`
4. Start the development server:
```bash
npm run dev
```

## Configuration

Required environment variables:
- MONGODB_URI=your_mongodb_connection_string
- NEXTAUTH_SECRET=your_secret_key
- NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
- NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
- IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
- API_BASE_URL=http://localhost:3000


## Project Structure

Key directories:

- `app/api`: API route handlers
- `app/components`: Reusable UI components
- `app/(auth)`: Authentication pages
- `app/upload`: Video upload page
- `lib`: Utility functions and configurations
- `models`: MongoDB schemas

## API Endpoints

- `POST /api/video`: Create new video record
- `GET /api/video`: Get all videos
- `POST /api/upload`: Upload video file

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT