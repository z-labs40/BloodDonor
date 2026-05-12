import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'BloodConnect — Campus Blood Donor Directory',
  description: 'Find blood donors instantly on your campus during emergencies. Register, search by blood group, and save lives.',
};

export default function RootPage() {
  return <HomePage />;
}
