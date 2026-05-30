import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ASRONIX TECH AGENCY | AI-Powered Digital Experiences",
  description: "From strategy to execution, we craft innovative digital solutions that transform ideas into measurable business impact. Web Development, AI Solutions, App Development & more.",
  keywords: "digital agency, web development, AI solutions, app development, branding, marketing, UI/UX design, ASRONIX",
  openGraph: {
    title: "ASRONIX TECH AGENCY | Ideas. Innovation. Impact.",
    description: "Building AI-Powered Digital Experiences For Modern Businesses",
    url: "https://asronixtechagency.com",
    siteName: "ASRONIX TECH AGENCY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASRONIX TECH AGENCY | Ideas. Innovation. Impact.",
    description: "Building AI-Powered Digital Experiences For Modern Businesses",
  },
  robots: "index, follow",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ASRONIX TECH AGENCY",
  "url": "https://asronixtechagency.com",
  "logo": "https://asronixtechagency.com/logo.png",
  "description": "Building AI-Powered Digital Experiences For Modern Businesses",
  "slogan": "Ideas. Innovation. Impact.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7377532141",
    "contactType": "customer service",
    "email": "asronixtechagency@gmail.com"
  },
  "sameAs": [
    "https://www.instagram.com/asronixtechagency/",
    "https://wa.me/917377532141"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
