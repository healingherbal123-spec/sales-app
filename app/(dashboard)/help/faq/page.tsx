// app/dashboard/help/faq/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const router = useRouter();
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/help')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileQuestion className="w-6 h-6 text-blue-600" /> Knowledge Base
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <p className="text-slate-500">Knowledge base articles coming soon</p>
      </div>
    </div>
  );
}