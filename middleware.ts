import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    // Excluir la página de login del admin (que ya no existe)
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar token en cookies o headers
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verificar token JWT
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
      
      // Verificar si es admin
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
