import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "800"],
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  title: "HeartPost",
  description: "Trải nghiệm gửi thư điện tử chân thật như cầm trên tay.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans bg-background text-foreground antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            <main>{children}</main>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
