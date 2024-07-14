import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/auth(.*)", "/portal(.*)", "/api/uploadthing(/*)", "/api/landingPage(/*)", "/internships(/*)", "/api/internshipsPage(/*)"],
    ignoredRoutes: [""],
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};