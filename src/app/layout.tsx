import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedbackFlow AI",
  description: "Revenue & Feedback Intelligence for Mid-Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1 className="logo">FeedbackFlow AI</h1>
            <p className="text-muted">Turn customer feedback into actionable insights</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
