import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASRONIX TECH AGENCY | AI, Web & Branding Solutions",
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
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
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
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
