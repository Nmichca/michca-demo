import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Michca Demo — Consulting Data/IA",
  description: "Analysez vos transcripts et documents sectoriels avec Claude",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
