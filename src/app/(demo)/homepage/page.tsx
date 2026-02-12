"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Herobanner from "./Herobanner";

export default function Homepage() {
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    return(
        <div className="text-center bg-white">
            <div className="p-4">
                {/* Navbar is in layout */}
            </div>
            <div>
                <Herobanner/>
                <div className="mt-8 flex justify-center gap-4">
                    <button 
                        onClick={() => router.push('/register')}
                        className="px-6 py-2.5 bg-white text-primary border border-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Register Staff
                    </button>
                </div>
            </div>
        </div>
    )
}