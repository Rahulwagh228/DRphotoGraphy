import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";

export const metadata: Metadata = {
  title: "आदिती फोटोग्राफी | व्यावसायिक छायाचित्रण सेवा",
  description: "आदिती फोटोग्राफी - तुमच्या आयुष्यातील सुंदर क्षण कलात्मकतेने टिपण्यासाठी विश्वासार्ह छायाचित्रण सेवा",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
