import "./app.css";
import "@appwrite.io/pink-icons";

export const metadata = {
  title: "Appwrite + Next.js",
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
          href="https://fonts.googleapis.com/css2?family=Allura&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body className={"bg-[#FAFAFB] font-[Inter] text-sm text-[#56565C]"}>
        {children}
      </body>
    </html>
  );
}
