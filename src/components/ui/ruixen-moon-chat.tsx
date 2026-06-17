"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function RuixenMoonChat() {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  const handleActionClick = (prefix: string) => {
    setMessage(prefix);
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Small timeout to allow state update before adjusting height
      setTimeout(() => adjustHeight(), 10);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-transparent">
      {/* Centered AI Title */}
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none text-transparent drop-shadow-sm bg-gradient-to-r from-red-500 via-orange-400 to-blue-500 bg-clip-text">
          CodeAarambh
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-300 font-medium tracking-wide">
          The Beginning of Code
        </p>
      </div>

      {/* Input Box Section */}
      <div className="w-full max-w-3xl px-4 mt-8">
        <div className="relative bg-black/60 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl transition-all hover:border-white/20">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            placeholder="Build something amazing — just start typing here..."
            className={cn(
              "w-full px-4 py-3 resize-none border-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "bg-transparent text-white text-sm placeholder:text-neutral-500 min-h-[48px]"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between p-3 border-t border-white/5">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                disabled={!message.trim()}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all border-0 font-bold text-xs uppercase tracking-wider",
                  message.trim()
                    ? "bg-red-600 text-white hover:bg-red-500 cursor-pointer shadow-lg shadow-red-500/20"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                )}
              >
                <ArrowUpIcon className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mt-6">
          <QuickAction icon={<Code2 className="w-3.5 h-3.5 text-red-500" />} label="Generate Code" onClick={() => handleActionClick("Generate code for a ")} />
          <QuickAction icon={<Rocket className="w-3.5 h-3.5 text-orange-500" />} label="Launch App" onClick={() => handleActionClick("Deploy and launch my ")} />
          <QuickAction icon={<Layers className="w-3.5 h-3.5 text-blue-500" />} label="UI Components" onClick={() => handleActionClick("Build UI components for ")} />
          <QuickAction icon={<Palette className="w-3.5 h-3.5 text-purple-500" />} label="Theme Ideas" onClick={() => handleActionClick("Suggest theme and styling ideas for ")} />
          <QuickAction icon={<CircleUserRound className="w-3.5 h-3.5 text-green-500" />} label="User Dashboard" onClick={() => handleActionClick("Create a user profile dashboard for ")} />
          <QuickAction icon={<MonitorIcon className="w-3.5 h-3.5 text-teal-500" />} label="Landing Page" onClick={() => handleActionClick("Build a landing page for ")} />
          <QuickAction icon={<FileUp className="w-3.5 h-3.5 text-yellow-500" />} label="Upload Docs" onClick={() => handleActionClick("Upload and read documentation for ")} />
          <QuickAction icon={<ImageIcon className="w-3.5 h-3.5 text-indigo-500" />} label="Image Assets" onClick={() => handleActionClick("Generate image assets for ")} />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-white/5 bg-black/40 backdrop-blur-xs text-neutral-300 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all text-xs py-1.5 px-3.5 h-auto cursor-pointer shadow-sm"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
