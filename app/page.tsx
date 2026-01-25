'use client';

import { useState } from 'react';
import Homepage from '@/components/Homepage/Homepage'; // ⬅️ fixed import

export default function Home() {
  const [stage, setStage] = useState('phone');
  const [phone, setPhone] = useState<string | undefined>(undefined); 
  const [otp, setOtp] = useState('');

  return (
    <main className="">
      <Homepage />
    </main>
  );
}
