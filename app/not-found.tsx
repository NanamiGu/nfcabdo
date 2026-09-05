import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh w-full bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center px-4 py-12 antialiased">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#141417] border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <CreditCard className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Profile Not Found
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            This digital business card has not been registered or assigned to an
            active profile yet.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Default Card</span>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-neutral-600">
        NFC Digital Profile System
      </p>
    </div>
  );
}
