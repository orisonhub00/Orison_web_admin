// update this section
'use client';

import Homepage from '@/components/Homepage/Homepage';
import { useState } from 'react';

export default function Home() {
  const [stage, setStage] = useState('phone');
  const [phone, setPhone] = useState<string | undefined>(undefined); // Changed initial value to undefined
  const [otp, setOtp] = useState('');

  return (
    <main className="">
      <Homepage />
    </main>
  );
}