import { Oswald, Geist, Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth_context";
import { ThemeProvider } from "@/context/theme_context";
import { LineupProvider } from "@/context/lineup_context";
import { TeamProvider } from "@/context/team_context";
import { ToastProvider } from "@/components/shared/Toast";
import "./globals.css";
const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
export const metadata = {
  title: "VRTX — Build, Analyze & Share Football Tactics",
  description:
    "Build tactical lineups, analyze formations, organize your squads, and share your game plan with VRTX.",
  openGraph: {
    title: "VRTX — Build, Analyze & Share Football Tactics",
    description:
      "Build tactical lineups, analyze formations, organize your squads, and share your game plan with VRTX.",
    type: "website",
    images: [{ url: "http://localhost:3000/api/og" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VRTX — Build, Analyze & Share Football Tactics",
    description:
      "Build tactical lineups, analyze formations, organize your squads, and share your game plan with VRTX.",
    images: ["http://localhost:3000/api/og"],
  },
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${geist.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <LineupProvider>
                <TeamProvider>{children}</TeamProvider>
              </LineupProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
