"use client";

export default function Herobanner() {
  return (
    <section className="min-h-[calc(100vh-60px)] w-full bg-white">
      <div className="min-h-[calc(100vh-60px)] w-full bg-gradient-to-b from-white via-[#fff3dc] to-[#f26b2a]">
        <div className="mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-6xl flex-col px-5 pt-24 pb-20">
          {/* ✅ TOP CENTER CONTENT */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[34px] font-bold text-black">
              Empower Your School.
            </h1>

            <p className="mt-2 text-[15px] font-semibold text-gray-500">
              Simplified ERP for Modern Education.
            </p>

            <button className="mt-6 rounded-full bg-black px-6 py-2 text-[11px] font-semibold text-white hover:opacity-90 transition">
              Learn More
            </button>
          </div>

          {/* ✅ MORE VERTICAL GAP (EXTRA SPACE LIKE REFERENCE) */}
          <div className="h-40 md:h-56 lg:h-64" />

          {/* ✅ BOTTOM SECTION */}
          <div className="grid grid-cols-1 items-end md:grid-cols-2">
            {/* ✅ LEFT TEXT (ALIGNED PROPERLY) */}
            <div className="flex flex-col items-start text-left">
              <h2 className="text-[16px] font-bold text-black">
                Student management.
              </h2>

              <p className="mt-2 max-w-[260px] text-[13px] font-medium leading-relaxed text-white/90">
                Automate admissions and streamline student records.
              </p>
            </div>

            {/* Right side empty (no dashboard) */}
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
