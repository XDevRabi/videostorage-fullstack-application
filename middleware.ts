import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


/**
 * Middleware configuration for authentication and route protection
 * 
 * This middleware uses NextAuth to protect routes and handle authentication:
 * 
 * - Public routes that don't require authentication:
 *   - /api/auth/* (auth endpoints)
 *   - /login
 *   - /register 
 *   - / (homepage)
 *   - /api/videos/* (video endpoints)
 * 
 * - All other routes require a valid authentication token
 * 
 * The middleware checks each request and:
 * 1. Allows access to public routes without authentication
 * 2. Verifies token presence for protected routes
 * 3. Redirects to login if authentication is required but missing
 * 
 * The config.matcher ensures the middleware only runs on relevant paths,
 * excluding static files and assets.
 */

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;

        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
