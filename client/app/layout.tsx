import { ReactChildrenType } from "./types/common.types";
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Explorer",
  description: "Find tours you like",
};

export default function RootLayout({ children }: ReactChildrenType) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
