"use client";

import Navbar from './(demo)/components/Navbar/Navbar';
import Herobanner from './(demo)/homepage/Herobanner';

export default function Home() {
  return (
    <div className="text-center bg-white min-h-screen">
        <div className="p-4">
             <Navbar />
        </div>
        <div>
            <Herobanner/>
        </div>
    </div>
  );
}
