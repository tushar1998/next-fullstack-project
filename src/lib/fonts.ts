import { JetBrains_Mono as FontMono } from "next/font/google";
import localfont from "next/font/local";

export const fontsGgSans = localfont({
  src: "../assets/fonts/gg-sans.ttf",
  fallback: ["Noto Sans", "serif"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
