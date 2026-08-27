// app/dashboard/search/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Search Results</h1>
      <p className="text-slate-500 mt-2">Results for: "{query}"</p>
    </div>
  );
}