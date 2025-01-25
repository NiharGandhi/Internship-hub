import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://internvista.tech'),
  title: "InternVista",
  description: "InternVista is the ultimate platform for students to showcase their profiles and connect with top employers for internship opportunities.",
  keywords: "internships, internship opportunities, student internships, InternVista"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link
            rel="apple-touch-icon"
            href="/apple-touch-icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
          />
          <script
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_API}&libraries=places`}
          ></script>
        </head>
        <body className={`bg-white ${inter.className}`}>
          <main>
            {children}
            <SpeedInsights />
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
