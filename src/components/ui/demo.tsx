"use client";

import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";

export default function DemoPage() {
  return (
    <main className="min-h-screen w-full bg-transparent text-white">
      {/* Chat Component */}
      <section className="flex justify-center items-start w-full">
        <RuixenMoonChat />
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral-500 py-4 border-t border-neutral-800/40 text-sm backdrop-blur-xs">
        © {new Date().getFullYear()} CodeAarambh Workspace Demo
      </footer>
    </main>
  );
}
