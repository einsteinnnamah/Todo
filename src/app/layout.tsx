import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Remove unused geistMono font declaration

export const metadata = {
  title: "Todo App",
  description: "A mobile-first todo application",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  themeColor: "#3b82f6",
};

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
