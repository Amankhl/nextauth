import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // these conditions returns true or false based on the current path
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

    const token = request.cookies.get("token")?.value || ''
    
    // if the user is logged in and their path is public, and if they try to visit other pages ,except for the profile page, via url, they will be redireted to home page 
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/', request.url))
    }
    // if the user is not logged in, they cannot visit other pages via url
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/signup',
    '/login',
    '/profile',
    '/verifyemail',
    '/profile/:id*' // Matches any nested paths after the dynamic segment
  ], // the middleware will be accessed only on these paths and the middleware will run before the routes
}