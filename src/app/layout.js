import "./app.css";
import "@appwrite.io/pink-icons";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const qellia = localFont({
  src: "./fonts/Fz_Qellia_Fix.ttf",
  variable: "--font-qellia",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
});

const highSpirited = localFont({
  src: "./fonts/1KHighSpirited.otf",
  variable: "--font-high-spirited",
  display: "swap",
});

export const metadata = {
  title: "Khanh Huyen\'s Graduation Ceremony",
  description: "Appwrite starter for Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/appwrite.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Great+Vibes&family=Parisienne&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body
        className={`${qellia.variable} ${highSpirited.variable} ${inter.variable} bg-[#FAFAFB] font-[Inter] text-sm text-[#56565C]`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
