import { Metadata } from "next";

export const metadata: Metadata = {
  title: "foti-box.com",
  description: "Gallerie",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
