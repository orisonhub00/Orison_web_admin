"use client";

import Image from "next/image";

export default function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative">
        {/* Animated outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-25"></div>
        <div className="absolute -inset-4 rounded-full border-2 border-primary/10 animate-pulse transition-all"></div>
        
        {/* Logo container with rotation/scaling animation */}
        <div className="bg-white p-6 rounded-full shadow-2xl relative z-10 animate-bounce-gentle">
          <Image
            src="/logo.png"
            alt="Orison Logo"
            width={180}
            height={60}
            className="animate-pulse-subtle"
            priority
          />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-primary font-bold text-lg tracking-widest animate-pulse">
          ORISON SERVICES
        </p>
        <div className="mt-2 h-1 w-48 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress-ind"></div>
        </div>
        <p className="mt-3 text-sm text-gray-500 font-medium">
          {message}
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.1); }
        }
        @keyframes progress-ind {
          0% { width: 0%; margin-left: 0; }
          50% { width: 30%; margin-left: 70%; }
          100% { width: 0%; margin-left: 0; }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        .animate-progress-ind {
          animation: progress-ind 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
