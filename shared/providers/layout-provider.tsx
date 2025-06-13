'use client';

import { LayoutGroup } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionLayoutProps {
  children: ReactNode;
}

export function MotionLayout({ children }: MotionLayoutProps) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
