"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Simple check for token cookie (adjust key if needed, assuming 'token' or 'authToken')
    // The login page sets 'token' in cookie via setAuthToken (saw in login/page.tsx)
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/homepage');
    }
  }, [router]);

  return <div className="flex h-screen items-center justify-center">Loading...</div>;
}
