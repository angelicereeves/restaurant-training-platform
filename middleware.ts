export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/r/:slug/roles/:path*",
    "/r/:slug/modules/:path*",
    "/r/:slug/lessons/:path*",
  ],
}
