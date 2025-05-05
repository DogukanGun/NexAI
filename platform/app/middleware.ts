import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the protected routes that require authentication
const protectedRoutes = ['/app', '/app/chat'];

export function middleware(request: NextRequest) {
  // Get the path from the URL
  const path = request.nextUrl.pathname;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    // Check for the authentication token in cookies
    const token = request.cookies.get('token')?.value;
    
    // If there's no token or it's empty, redirect to the homepage with a query parameter
    if (!token || token.trim() === '') {
      // Clear any potentially invalid cookies in the response
      const response = NextResponse.redirect(new URL('/?needLogin=true', request.url));
      
      // Explicitly delete the token cookie in the response
      response.cookies.delete('token');
      
      return response;
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/app/:path*'],
}; 