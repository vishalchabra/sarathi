'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = { result: any };

export default function TimingNarrative({ result }: Props) {
  const md: string | undefined = result?.extra?.structured?.text;
  if (!md) return null; // nothing to show

  return (
    <section className="mt-6 border-t pt-4">
      <h3 className="text-base font-semibold mb-2">Detailed narrative</h3>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>
    </section>
  );
}
