import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/header";
import HeaderMobile from "@/components/header/header-mobile";
import SideNav from "@/components/side-nav/side-nav";
import PageWrapper from "@/components/wrappers/page-wrapper";
import MarginWidthWrapper from "@/components/wrappers/margin-width-wrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: 'https://www.internvista.tech/api/og',
        width: 1200,
        height: 630,
        alt: 'InternVista Home Page, for Students to get Internships.'
      }
    ]
  },
  title: "InternVista",
  description: "Your one app for all your Internship Needs",
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
          <title>InternVista</title>
          <meta name="description" content="InternVista is the ultimate platform for students to showcase their profiles and connect with top employers for internship opportunities." />
          <meta name="keywords" content="internships, internship opportunities, student internships, InternVista" />
          <meta property="og:title" content="InternVista - Find Your Dream Internship" />
          <meta property="og:description" content="InternVista is the ultimate platform for students to showcase their profiles and connect with top employers for internship opportunities." />
          {/* <meta property="og:image" content="" /> */}
          <meta property="og:url" content="https://internvista.tech/api/og" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className={`bg-white ${inter.className}`}>
          <div className="flex">
            <SideNav />
            <main className="flex-1">
              <MarginWidthWrapper>
                <Header />
                <HeaderMobile />
                <PageWrapper>
                  {children}
                </PageWrapper>
              </MarginWidthWrapper>
              <SpeedInsights />
              <Toaster />
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
