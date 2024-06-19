import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/auth(.*)", "/portal(.*)", "/api/uploadthing(/*)"],
    ignoredRoutes: [""],
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};