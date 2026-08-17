import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "AI Revenue Engine | B2B Prospecting & Sales Automation",
  description: "AI-powered prospecting, ICP qualification, cold outreach, compliance validation, and CRM pipeline analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex min-h-screen">
        <Navigation />
        <main className="flex-1 min-w-0 overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
