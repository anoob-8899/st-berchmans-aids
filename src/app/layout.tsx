import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Department of Artificial Intelligence & Data Science | St. Berchmans College (Autonomous)',
  description: 'Official Portal of the Department of Artificial Intelligence and Data Science at St. Berchmans College (Autonomous), Changanassery. Offering 4-Year B.Sc (Hons.) in AI & Data Science under MG University FYUGP.',
  icons: {
    icon: '/sbc-crest.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
