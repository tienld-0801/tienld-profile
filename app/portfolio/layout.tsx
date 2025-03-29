import ProgressHeader from '@/components/ProgressHeader/ProgressHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'TienLeDuy',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ProgressHeader />
      {children}
    </section>
  );
}
