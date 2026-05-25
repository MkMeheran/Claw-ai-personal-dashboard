import type { Metadata } from "next";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "NEXUS — Custom Personal Productivity System | Md. Mokammel Morshed",
  description: "NEXUS is a fully custom cross-device personal productivity system — clipboard sync, media vault, AI assistant, encrypted vault — built and configured by Md. Mokammel Morshed (Meheran), developer from Bangladesh.",
  keywords: "hire developer to build personal app, someone build me a custom photo vault app, build my own password manager app, custom clipboard sync app Windows Android, personal knowledge base app developer for hire, build me a personal dashboard app, custom note taking app built for me, developer to build personal productivity system, bespoke personal app developer, my own private photo storage app built, custom personal finance tracker app developer, hire someone to build me an app no subscription, who can build a custom personal productivity app for me, is there a developer who builds personal apps like custom photo vaults, I want my own password manager app built privately, find me a developer who can build a personal dashboard, hire someone to set up n8n workflow, freelance n8n AI agent setup developer, AI agent developer for hire affordable, set up AI automation for my business, custom AI assistant setup service, AI agent workflow builder freelancer, n8n workflow developer hire, personal AI chatbot setup service, OpenClaw setup developer for hire, affordable AI automation freelancer, Make.com automation freelancer, Zapier alternative custom automation setup, AI agent that handles my emails automatically, hire developer build custom AI assistant 2025, who can set up an n8n AI agent for my business, find freelancer to automate my workflow with AI, is there a developer who sets up custom AI agents affordably, I want an AI assistant that works on my own server, add unique feature to my ecommerce site, custom web app feature developer, hire developer for custom website feature, add AI to my existing website, custom web app developer Bangladesh affordable, build unique feature for my online store, freelance Next.js React developer for hire, Supabase developer for hire custom app, add AI chatbot to my Shopify store, custom product recommendation engine developer, hire developer add loyalty program my website, custom inventory management small business, NEXUS personal productivity system, custom productivity app Bangladesh, Md Mokammel Morshed, Meheran developer",
  authors: [{ name: "Md. Mokammel Morshed", url: "https://meheran.dev" }],
  creator: "Meheran",
  publisher: "Md. Mokammel Morshed",
  openGraph: {
    title: "NEXUS — Custom Personal Productivity System",
    description: "Cross-device clipboard sync, media vault, AI assistant & encrypted vault. Custom-built and configured by Meheran.",
    url: "https://nexus.meheran.dev", // Change this to your exact deployed URL
    siteName: "NEXUS by Meheran",
    images: [{
      url: "https://meheran.dev/profile.jpg", // Change to exact image URL if different
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS — Custom Personal Productivity System",
    description: "Cross-device clipboard sync, media vault, AI assistant & encrypted vault — built by Meheran.",
    creator: "@Meheran_3005",
    site: "@Meheran_3005",
    images: ["https://meheran.dev/profile.jpg"], // Change to exact image URL if different
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://nexus.meheran.dev", // Change this to your exact deployed URL
  },
  other: {
    "geo.region": "BD-D",
    "geo.placename": "Bangladesh",
    "geo.position": "23.8103;90.4125",
    "ICBM": "23.8103, 90.4125",
    "revisit-after": "7 days",
    "language": "English"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${spaceGrotesk.variable} antialiased bg-stone-100 text-stone-900 font-[family-name:var(--font-space)]`}
      >
        {children}
      </body>
    </html>
  );
}
