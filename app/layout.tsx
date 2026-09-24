import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ÉcoleConnect — Plateforme de communication école-parents',
  description: 'Solution SaaS pour faciliter la communication entre établissements scolaires, enseignants et parents d\'élèves : annonces ciblées, suivi des absences et retards, et notifications directes.',
  openGraph: {
    title: 'ÉcoleConnect — Plateforme de communication école-parents',
    description: 'Solution SaaS pour faciliter la communication entre établissements scolaires, enseignants et parents d\'élèves.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ÉcoleConnect — Plateforme de communication école-parents',
    description: 'Solution SaaS pour faciliter la communication entre établissements scolaires, enseignants et parents d\'élèves.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className="h-full bg-slate-50">
      <body suppressHydrationWarning className="h-full font-sans antialiased text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
