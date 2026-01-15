import React from 'react';
import { SendHorizontal } from 'lucide-react';

export const FooterSection = ({ title, children }) => (
  <div className="flex flex-col gap-6">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <div className="flex flex-col gap-4 text-base text-white/90 font-light">
      {children}
    </div>
  </div>
);

export const FooterLink = ({ href = "#", children }) => (
  <a href={href} className="hover:underline transition-all">
    {children}
  </a>
);
