import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const body = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carehomes.lk"),
  title: {
    default: "carehomes.lk — Find a care home in Colombo",
    template: "%s · carehomes.lk",
  },
  description:
    "Compare care homes across Colombo's suburbs by care type, monthly fee and availability. By Blanket Care.",
  openGraph: {
    siteName: "carehomes.lk",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
