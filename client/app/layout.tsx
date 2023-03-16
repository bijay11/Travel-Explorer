import { ReactChildrenType } from "./types/common.types";
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: ReactChildrenType) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}