import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['ar', 'fr', 'en'],
  defaultLocale: 'fr',
});

const protectedRoutes = ['/account', '/orders', '/wishlist'];
const adminRoutes = ['/admin'];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = ['ar', 'fr', 'en'].includes(locale)
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;
  
  // Lightweight session check (No Prisma/Bcrypt import)
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value;

  const isAdminRoute = adminRoutes.some((r) => pathWithoutLocale.startsWith(r));
  const isProtectedRoute = protectedRoutes.some((r) => pathWithoutLocale.startsWith(r));

  if ((isAdminRoute || isProtectedRoute) && !sessionToken) {
    // Redirect to login if no session token found
    const redirectLocale = ['ar', 'fr', 'en'].includes(locale) ? locale : 'fr';
    return NextResponse.redirect(new URL(`/${redirectLocale}/login`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
