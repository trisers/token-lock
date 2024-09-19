// src/app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }


// src/app/layout.tsx

// import { Inter } from "next/font/google";
import "./globals.css";
import  RouteGuard  from '../app/components/RouteGuard';

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RouteGuard>{children}</RouteGuard>
      </body>
    </html>
  );
}