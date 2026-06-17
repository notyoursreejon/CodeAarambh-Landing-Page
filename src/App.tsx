import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  Folder, 
  FileCode, 
  Play, 
  Check 
} from "lucide-react";

import logo from "@/assets/logo.png";
import { GlobeBackground } from "@/components/ui/globe-background";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Boxes } from "@/components/ui/background-boxes";
import { MorphPanel } from "@/components/ui/ai-input";

// Custom SVG Brand Icons
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Showcase images for ZoomParallax (high-quality Unsplash tech images)
const parallaxImages = [
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
    alt: "Clean code on a screen"
  },
  {
    src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000",
    alt: "Software development server console"
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
    alt: "Developer workspace laptop"
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
    alt: "Digital system matrix grid"
  },
  {
    src: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000",
    alt: "Abstract visual tech coding"
  },
  {
    src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000",
    alt: "Close-up mechanised programming keyboard"
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000",
    alt: "Modern clean coding setup"
  }
];

// learningPaths constant removed

// Mock IDE files and their contents
const ideFiles = {
  "App.tsx": `import React from 'react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-zinc-800 text-white">
      <Sparkles className="size-8 text-red-500 animate-pulse mb-4" />
      <h1 className="text-xl font-bold">Hello from CodeAarambh!</h1>
      <p className="text-sm text-zinc-400 mt-2">Your app has been built successfully.</p>
    </div>
  );
}`,
  "index.css": `@import "tailwindcss";

@layer base {
  body {
    background-color: #09090b;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
}`,
  "package.json": `{
  "name": "codeaarambh-scaffold",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.450.0"
  }
}`
};

export default function App() {

  // Rotating title state
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = ["amazing", "new", "wonderful", "beautiful", "smart"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber]);

  // Prompt input states
  const [promptInput, setPromptInput] = useState<string>("");
  const selectedModel = "Build (Standard)";

  // IDE mock states
  const [selectedFile, setSelectedFile] = useState<keyof typeof ideFiles>("App.tsx");
  const filenames = ["App.tsx", "index.css", "package.json"] as const;
  const editorTabs = [
    { title: "App.tsx", icon: FileCode },
    { title: "index.css", icon: Sparkles },
    { title: "package.json", icon: Folder },
  ];
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "CodeAarambh Dev Server starting...",
    "Using node v20.10.0",
    "Ready. Type a command or run build below."
  ]);
  const [isRunningBuild, setIsRunningBuild] = useState<boolean>(false);
  const [editorCode, setEditorCode] = useState<string>(ideFiles["App.tsx"]);

  // Track editor code local updates
  useEffect(() => {
    setEditorCode(ideFiles[selectedFile]);
  }, [selectedFile]);

  // Handle quick prompt clicks
  const handleQuickPrompt = (prompt: string) => {
    setPromptInput(prompt);
    handlePromptSubmit(undefined, prompt);
  };

  // Simulate prompt submission in our interactive IDE mockup
  const handlePromptSubmit = (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const activePrompt = customPrompt !== undefined ? customPrompt : promptInput;
    if (!activePrompt.trim()) return;

    setIsRunningBuild(true);
    setTerminalLogs(prev => [
      ...prev,
      `$ build-workspace --prompt="${activePrompt}" --model="${selectedModel}"`,
      "Provisioning new container environment...",
      "Resolving multi-file dependency architecture...",
      "Generating App.tsx component layouts...",
      "Successfully bundled files. Vite preview server reloading..."
    ]);

    // Update code inside our editor based on prompt
    setTimeout(() => {
      const formattedPrompt = activePrompt.toLowerCase();
      let customCode = ideFiles["App.tsx"];
      
      if (formattedPrompt.includes("chart") || formattedPrompt.includes("dashboard")) {
        customCode = `import React from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Sales Analytics</h2>
        <TrendingUp className="size-5 text-green-500" />
      </div>
      <div className="h-24 flex items-end gap-2 px-2 border-b border-zinc-800 pb-2">
        <div className="bg-red-500 w-full h-8 rounded"></div>
        <div className="bg-red-500 w-full h-16 rounded"></div>
        <div className="bg-red-600 w-full h-20 rounded"></div>
        <div className="bg-red-400 w-full h-12 rounded"></div>
      </div>
      <p className="text-xs text-zinc-500 mt-2">Live analytics mockup</p>
    </div>
  );
}`;
      } else if (formattedPrompt.includes("portfolio") || formattedPrompt.includes("about")) {
        customCode = `import React from 'react';
import { User, Mail } from 'lucide-react';

export default function Portfolio() {
  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-white text-center">
      <div className="size-16 rounded-full bg-red-600 mx-auto flex items-center justify-center text-lg font-bold">JD</div>
      <h2 className="font-bold text-xl mt-3">John Doe</h2>
      <p className="text-zinc-400 text-xs">Creative Developer</p>
      <button className="mt-4 px-4 py-1.5 bg-red-600 rounded text-xs hover:bg-red-500">Contact Me</button>
    </div>
  );
}`;
      } else {
        customCode = `import React from 'react';
import { Terminal } from 'lucide-react';

export default function CustomApp() {
  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-white text-center">
      <Terminal className="size-8 text-red-500 mx-auto mb-2" />
      <h2 className="font-bold text-base">Custom Workspace Built</h2>
      <p className="text-zinc-400 text-xs mt-1">Prompt: "${activePrompt}"</p>
    </div>
  );
}`;
      }

      // Update states
      ideFiles["App.tsx"] = customCode;
      if (selectedFile === "App.tsx") {
        setEditorCode(customCode);
      }
      setIsRunningBuild(false);
      setPromptInput("");
    }, 2000);
  };

  // Simulate terminal command runner
  const handleRunCommand = (cmd: string) => {
    setTerminalLogs(prev => [
      ...prev,
      `$ ${cmd}`,
      cmd === "npm run dev" 
        ? "Vite v8.0.16 dev server running at http://localhost:5173/" 
        : cmd === "npm run build"
        ? "✓ built in 1.4s (dist/ compiled successfully)"
        : "command executed successfully."
    ]);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-red-500/30 selection:text-red-200 overflow-x-clip font-sans">
      <GlobeBackground className="pointer-events-none opacity-50 z-0" />
      
      {/* 1. Header/Navigation */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-white/5 bg-[#060608]/75 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12 transition-all">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CodeAarambh Logo" className="size-8 object-contain" />
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-red-500 via-orange-400 to-blue-500 bg-clip-text text-transparent">
            CodeAarambh
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ai-systems" className="hover:text-white transition-colors">AI Systems</a>
          <a href="#curriculum" className="hover:text-white transition-colors">Templates</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#roadmap" className="hover:text-white transition-colors">Docs</a>
          <a href="#manifest" className="hover:text-white transition-colors">Enterprise</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hover:bg-white/5 font-semibold text-xs tracking-wider uppercase text-gray-300">
            Log in
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-red-500/20 border-0 px-4 py-2">
            Get started
          </Button>
        </div>
      </header>

      {/* 2. Hero Section (Including 3D Globe Background) */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Dark radial overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/10 via-[#060608]/60 to-[#060608] z-10 pointer-events-none" />

        {/* Content Box */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-12 w-full">
          <Badge variant="outline" className="mb-6 py-1 px-3 border-red-500/30 bg-red-950/20 text-red-400 gap-1.5 backdrop-blur-md animate-fade-in text-[10px] tracking-wider uppercase font-bold">
            <Sparkles className="size-3 text-red-400 fill-red-400/30" />
            CodeAarambh AI Workspace
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Build something
            <br />
            <span className="relative inline-flex justify-center h-[1.25em] w-full overflow-hidden text-center">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-bold bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: "-100%" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? "-150%" : "150%",
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Create apps and websites by chatting with AI
          </p>



          {/* Quick Start Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-gray-500">
            <span className="font-medium">Try these:</span>
            {[
              "Build a dashboard with sales analytics chart",
              "Create a dark-mode portfolio landing page",
              "Generate a landing page for Nepal trekking"
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPrompt(p)}
                className="px-3 py-1.5 rounded-full border border-white/5 bg-[#0b0b0f]/80 backdrop-blur-sm hover:bg-white/5 hover:border-white/10 hover:text-gray-300 transition-all cursor-pointer text-left truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Transparent Workspace Showcase (Interactive IDE Mockup) */}
      <section id="features" className="relative py-16 border-t border-white/5 overflow-hidden w-full bg-[#060608]">
        {/* Flashing grid hover background */}
        <div className="absolute inset-0 w-full h-full z-0 [mask-image:radial-gradient(transparent,black_75%)] pointer-events-none opacity-20" />
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40">
          <Boxes />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="outline" className="border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
              Transparent Workspace Design
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Inspect every line.
              <br />
              No hidden output.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
              CodeAarambh is a browser-based AI development workspace. Describe what you want to build, and it creates a structured project with editable files, setup commands, and live preview support. Unlike black-box app builders, CodeAarambh keeps the source code visible and editable from the start.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                Documentation
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white border-0 gap-1.5">
                Start Coding <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Interactive IDE Mockup Component */}
          <div className="lg:col-span-7 w-full bg-[#0a0a0e] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col h-[480px]">
            
            {/* IDE Header */}
            <div className="bg-[#0b0b0f] border-b border-white/5 h-11 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-red-500/60 block"></span>
                <span className="size-3 rounded-full bg-yellow-500/60 block"></span>
                <span className="size-3 rounded-full bg-green-500/60 block"></span>
                <span className="text-[11px] font-semibold text-zinc-500 ml-3 uppercase tracking-wider">WORKSPACE SHELL</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-[9px] py-0.5 px-2 rounded">
                  {selectedModel}
                </Badge>
              </div>
            </div>

            {/* IDE Workspace body */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
              
              {/* File Tree Sidebar (col-span-3) */}
              <div className="col-span-3 bg-[#08080b] border-r border-white/5 p-3 flex flex-col gap-2 overflow-y-auto">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Folder className="size-3 text-red-400" /> Files
                </span>
                
                {Object.keys(ideFiles).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setSelectedFile(filename as keyof typeof ideFiles)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-semibold text-left transition-colors cursor-pointer ${
                      selectedFile === filename 
                        ? "bg-white/5 text-white" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <FileCode className={`size-3.5 ${selectedFile === filename ? "text-red-400" : "text-zinc-600"}`} />
                    <span className="truncate">{filename}</span>
                  </button>
                ))}
              </div>

              {/* Code Editor and Preview (col-span-9) */}
              <div className="col-span-9 flex flex-col overflow-hidden">
                
                {/* Editor Tabs bar */}
                <div className="bg-[#0b0b0f] border-b border-white/5 h-11 flex items-center px-3 overflow-hidden">
                  <ExpandableTabs
                    tabs={editorTabs}
                    activeTab={filenames.indexOf(selectedFile)}
                    activeColor="text-red-400"
                    className="border-0 bg-transparent p-0 shadow-none gap-1"
                    onChange={(idx) => {
                      if (idx !== null) {
                        setSelectedFile(filenames[idx]);
                      }
                    }}
                  />
                </div>

                {/* Editor Editor Content */}
                <div className="flex-1 grid grid-rows-2 overflow-hidden">
                  
                  {/* Code Block Tab */}
                  <div className="bg-[#0a0a0e] p-4 font-mono text-[11px] leading-relaxed text-zinc-400 overflow-auto border-b border-white/5 select-text">
                    <pre className="whitespace-pre-wrap">
                      {editorCode.split("\n").map((line, idx) => {
                        // 1. Escape HTML entities first
                        let escaped = line
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;");

                        // 2. Safe single-pass regular expression highlighting
                        const regex = /(".*?"|'.*?'|`.*?`|\/\/.*$|\b(?:import|export|default|function|return|const|let|from|class|className|interface)\b|\b(?:div|h1|p|button|span|svg|path|rect|line|Dashboard|Portfolio|CustomApp|Sparkles|TrendingUp|BarChart2|User|Mail|Terminal|React|useState|useEffect)\b)/g;

                        const styledLine = escaped.replace(regex, (match) => {
                          if (match.startsWith("//")) {
                            return `<span class="text-zinc-600">${match}</span>`;
                          }
                          if (match.startsWith('"') || match.startsWith("'") || match.startsWith("`")) {
                            return `<span class="text-orange-300">${match}</span>`;
                          }
                          const redKeywords = ["import", "export", "default", "function", "return", "const", "let", "from", "class", "className", "interface"];
                          if (redKeywords.includes(match)) {
                            return `<span class="text-red-400">${match}</span>`;
                          }
                          return `<span class="text-blue-400">${match}</span>`;
                        });

                        return (
                          <div key={idx} className="flex gap-4">
                            <span className="w-4 text-right text-zinc-700 select-none">{idx + 1}</span>
                            <span dangerouslySetInnerHTML={{ __html: styledLine }} />
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  {/* Preview & Terminal Side-by-Side */}
                  <div className="grid grid-cols-2 overflow-hidden bg-[#08080b]">
                    
                    {/* Live Preview Viewport */}
                    <div className="border-r border-white/5 p-4 flex flex-col justify-center items-center overflow-auto relative">
                      <div className="absolute top-2 left-2 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        Live Preview
                      </div>
                      
                      {isRunningBuild ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[10px] text-zinc-500">Rebuilding...</span>
                        </div>
                      ) : (
                        <div className="scale-75 w-full flex justify-center">
                          {/* Eval mock render */}
                          {selectedFile === "App.tsx" && editorCode.includes("Sales Analytics") ? (
                            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full max-w-[200px]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-xs">Sales</span>
                                <span className="text-[10px] text-green-500">▲ +12%</span>
                              </div>
                              <div className="h-12 flex items-end gap-1 px-1 border-b border-zinc-800 pb-1">
                                <div className="bg-red-500 w-full h-4 rounded"></div>
                                <div className="bg-red-500 w-full h-8 rounded"></div>
                                <div className="bg-red-600 w-full h-10 rounded"></div>
                                <div className="bg-red-400 w-full h-6 rounded"></div>
                              </div>
                            </div>
                          ) : selectedFile === "App.tsx" && editorCode.includes("John Doe") ? (
                            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-white text-center w-full max-w-[200px]">
                              <div className="size-10 rounded-full bg-red-600 mx-auto flex items-center justify-center text-xs font-bold">JD</div>
                              <h2 className="font-bold text-xs mt-2">John Doe</h2>
                              <p className="text-zinc-500 text-[10px]">Developer</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-white text-center w-full max-w-[200px]">
                              <Sparkles className="size-5 text-red-500 animate-pulse mb-2" />
                              <h1 className="text-xs font-bold">CodeAarambh App</h1>
                              <p className="text-[9px] text-zinc-400 mt-1">Status: Running</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mock Bash Terminal */}
                    <div className="p-3 bg-[#050508] font-mono text-[9px] text-zinc-500 overflow-auto flex flex-col justify-between">
                      <div className="space-y-1 select-text">
                        {terminalLogs.map((log, idx) => (
                          <div key={idx} className={log.startsWith("$") ? "text-zinc-300" : log.includes("Error") ? "text-red-400" : "text-zinc-500"}>
                            {log}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/5 pt-2 mt-2 flex gap-1.5 justify-end">
                        <button 
                          onClick={() => handleRunCommand("npm run dev")}
                          className="px-2 py-0.5 bg-zinc-900 border border-white/10 hover:border-white/20 rounded hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Play className="size-2 text-zinc-400" /> dev
                        </button>
                        <button 
                          onClick={() => handleRunCommand("npm run build")}
                          className="px-2 py-0.5 bg-zinc-900 border border-white/10 hover:border-white/20 rounded hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Play className="size-2 text-zinc-400" /> build
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Physical Workspace Pipeline (01 - 04) */}
      <section className="py-16 bg-gradient-to-b from-[#060608] via-red-950/5 to-[#060608] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
              Real-time Pipeline
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              A physical workspace flow
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm sm:text-base font-medium">
              Watch your abstract commands travel sequentially through a beautiful structured build workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl border border-white/5 bg-[#0b0b0f]/80 backdrop-blur-md group hover:border-white/10 transition-colors">
              <span className="text-4xl font-extrabold text-red-600/20 group-hover:text-red-600/40 transition-colors block mb-4">01</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Prompt</span>
              <h3 className="text-lg font-bold text-white mb-2">1. Describe the app</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Describe what you need in conversational plain English. No coding syntax limits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl border border-white/5 bg-[#0b0b0f]/80 backdrop-blur-md group hover:border-white/10 transition-colors">
              <span className="text-4xl font-extrabold text-red-600/20 group-hover:text-red-600/40 transition-colors block mb-4">02</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Project Files</span>
              <h3 className="text-lg font-bold text-white mb-2">2. Generate the project</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                CodeAarambh immediately provisions the entire file-tree architecture with real code structure.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl border border-white/5 bg-[#0b0b0f]/80 backdrop-blur-md group hover:border-white/10 transition-colors">
              <span className="text-4xl font-extrabold text-red-600/20 group-hover:text-red-600/40 transition-colors block mb-4">03</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Live Preview</span>
              <h3 className="text-lg font-bold text-white mb-2">3. Edit and preview</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Inspect files or trigger running build commands inside a fully secure preview workstation side-by-side.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl border border-white/5 bg-[#0b0b0f]/80 backdrop-blur-md group hover:border-white/10 transition-colors">
              <span className="text-4xl font-extrabold text-red-600/20 group-hover:text-red-600/40 transition-colors block mb-4">04</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Export / Github</span>
              <h3 className="text-lg font-bold text-white mb-2">4. Export or continue</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Download complete code bundles as zip, export directly to GitHub repo with complete Git histories.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Core Capabilities (Ecosystem built for speed) */}
      <section id="ai-systems" className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
            Core Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            An ecosystem built for speed.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm sm:text-base font-medium">
            Engineered with modern developers in mind. No simplified simulators or black-box interfaces.
          </p>
        </div>

        {/* Bento-style Capability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Cap 1 - Multi-file generation (col-span-8) */}
          <GlowCard glowColor="red" customSize className="md:col-span-8 h-80 flex flex-col justify-between p-8">
            <div className="space-y-4">
              <Badge className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold py-0.5 px-2 rounded">
                COMPLEX STRUCTURES
              </Badge>
              <h3 className="text-2xl font-bold text-white">Multi-file project generation</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                Define complex application logic once. CodeAarambh builds nested architectures, installs real packages, generates components, styles correctly with Tailwind, and ties logic in standard TypeScript.
              </p>
            </div>
            <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <Check className="size-4 text-red-500" />
              Inspect and edit every file the AI creates. No hidden black-box output.
            </div>
          </GlowCard>

          {/* Cap 2 - Browser code editor (col-span-4) */}
          <GlowCard glowColor="purple" customSize className="md:col-span-4 h-80 flex flex-col justify-between p-8">
            <div className="space-y-4">
              <Badge className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold py-0.5 px-2 rounded">
                FULL CONTROL
              </Badge>
              <h3 className="text-2xl font-bold text-white">Browser code editor</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Modify individual files using our full coding editor. Fine-tune code, manage standard imports, and refine AI outputs completely at your leisure.
              </p>
            </div>
            <div className="text-xs text-zinc-500 font-semibold flex items-center gap-1.5">
              <span>VS Code inspired</span>
              <span>•</span>
              <span>Fast performance</span>
            </div>
          </GlowCard>

          {/* Cap 3 - Live Preview (col-span-4) */}
          <GlowCard glowColor="blue" customSize className="md:col-span-4 h-80 flex flex-col justify-between p-8">
            <div className="space-y-4">
              <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold py-0.5 px-2 rounded">
                DYNAMIC HOT RELOAD
              </Badge>
              <h3 className="text-2xl font-bold text-white">Live preview</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Real-time viewport reloading dynamically parses changes every time a project file or CSS rule is updated. Test buttons, UI grids, and states instantly as they update.
              </p>
            </div>
            <div className="text-xs text-zinc-500 font-semibold flex items-center gap-1.5">
              <Check className="size-4 text-blue-400" />
              Reactive reload rendering
            </div>
          </GlowCard>

          {/* Cap 4 - Terminal runner (col-span-8) */}
          <GlowCard glowColor="orange" customSize className="md:col-span-8 h-80 flex flex-col justify-between p-8">
            <div className="space-y-4">
              <Badge className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold py-0.5 px-2 rounded">
                WEB SHELL
              </Badge>
              <h3 className="text-2xl font-bold text-white">Terminal runner</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                Initiate scripts, download standard npm client utilities, compile projects, inspect code bundle sizes, and run custom builds comfortably right from our responsive web shell terminal.
              </p>
            </div>
            <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <Check className="size-4 text-orange-400" />
              bash CLI support
            </div>
          </GlowCard>

        </div>

        {/* Secondary Capability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            {
              title: "GitHub export",
              desc: "Direct GitHub repository exports allow clean pull request generations and secure commits without leaving the platform.",
              badge: "COMING SOON"
            },
            {
              title: "Secure API handling",
              desc: "Sensitive third-party credentials, custom prompt layouts, and keys are protected server-side and never saved locally.",
              badge: "NO CLIENT LEAKS"
            },
            {
              title: "Project history",
              desc: "Track full iteration states, project updates, and prior code layouts. Swap, inspect, and check history milestones easily.",
              badge: "HISTORIC STATE LOGS"
            },
            {
              title: "Workspace templates",
              desc: "Scaffold landing page layouts, full admin panels, static HTML forms, or node servers instantly using starter boilerplates.",
              badge: "INSTANT SCAFFOLD"
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0e]/80 backdrop-blur-md flex flex-col justify-between h-48 hover:border-white/10 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-zinc-200">{item.title}</h4>
                  <Badge variant="outline" className="border-red-500/20 bg-red-950/10 text-red-400 text-[8px] py-0.5 px-1.5 rounded">
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Security Manifest Section */}
      <section id="manifest" className="py-16 bg-gradient-to-b from-transparent via-[#060608]/90 to-transparent backdrop-blur-md border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <Badge variant="outline" className="border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
                Security Manifest
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Your code remains yours.
                <br />
                Completely.
              </h2>
              
              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Full Source Visibility:",
                    desc: "Generated code is always inspectable, downloadable, and completely editable. No lock-in."
                  },
                  {
                    title: "Private by Default:",
                    desc: "Your projects are secure and attached solely to your personal workspace account."
                  },
                  {
                    title: "Safe Credentials Handling:",
                    desc: "Private variables, prompts, and server keys stay server-side only. No client exposure."
                  },
                  {
                    title: "Workspace Encapsulation:",
                    desc: "Sessions are secured and authenticated with clean Firebase user roles."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <ShieldCheck className="size-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">
                      <strong className="text-white">{item.title}</strong> {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographical collab badge */}
            <div className="bg-[#0b0b0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center space-y-6 max-w-md mx-auto lg:mr-0 shadow-xl">
              <div className="size-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto">
                <Compass className="size-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Global Collaboration</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Built for the web, made in Nepal in collab with India for developers, founders, and students worldwide.
              </p>
              <Separator className="bg-white/5" />
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs uppercase tracking-wider py-3 border-0">
                CREATE AN ACCOUNT
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Curriculum Accordion Section */}
      <section id="curriculum-slider" className="pt-12 pb-2 border-t border-white/5">
        <LandingAccordionItem />
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" className="py-16 max-w-6xl mx-auto px-6 border-t border-white/5">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
            Pricing Options
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Honest, predictable pricing
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm sm:text-base font-medium">
            Start building absolutely free. Claim complementary lifetime Builder access during launch promo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-white/5 bg-[#0a0a0e]/80 backdrop-blur-md flex flex-col justify-between space-y-8 relative hover:border-white/10 transition-colors">
            <div className="space-y-4">
              <Badge className="bg-zinc-800 border-transparent text-zinc-300 text-[9px] font-bold uppercase tracking-wider">
                STANDARD PROTO
              </Badge>
              <h3 className="text-2xl font-bold text-white">Free</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Excellent for hobby builders, students, and prototypes experimenting with browser AI workspace.
              </p>
              
              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-zinc-500 text-xs">/mo</span>
              </div>

              <Separator className="bg-white/5" />

              <ul className="space-y-3 text-xs text-zinc-300">
                {[
                  "3 project generations/month",
                  "Daily AI generation usage limit",
                  "Full browser code editor",
                  "React/Vite live preview viewer",
                  "Standard ZIP source export",
                  "Community support forum access"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="size-4 text-red-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button className="w-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 mt-4">
              Get Started Free
            </Button>
          </div>

          {/* Plus Premium Tier */}
          <div className="p-8 rounded-2xl border border-red-500/20 bg-[#0c0a0c]/85 backdrop-blur-md flex flex-col justify-between space-y-8 relative shadow-lg shadow-red-950/10 hover:border-red-500/30 transition-colors">
            
            {/* Developer Favorite badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 border border-red-500 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md shadow-red-600/30">
              DEVELOPER FAVORITE
            </div>

            <div className="space-y-4">
              <Badge className="bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                UNLIMITED PRO
              </Badge>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Plus <span className="text-red-500 text-xs font-semibold tracking-wider ml-1 uppercase">PREMIUM</span></h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Best for serious builders. Unlock advanced coding models, deep multi-file debugging, GitHub sync, and fast generation.
              </p>
              
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-zinc-600 text-sm line-through font-semibold">$50.00</span>
                <span className="text-4xl font-extrabold text-white">$19.99</span>
                <span className="text-zinc-500 text-xs">/mo</span>
              </div>

              <Separator className="bg-white/5" />

              <ul className="space-y-3 text-xs text-zinc-300">
                {[
                  "1,000,000+ total AI tokens/month",
                  "Advanced multi-file debugging (Vajra)",
                  "CodeAarambh developer tools & agents",
                  "Secure automatic GitHub export integration",
                  "High-speed faster generation queue",
                  "Up to 50 active projects/workspaces"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="size-4 text-red-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs uppercase tracking-wider py-3 shadow-md shadow-red-500/20 border-0 mt-4">
              Claim Launch Offer
            </Button>
          </div>

        </div>
      </section>

      {/* 9. Scroll Zoom Parallax */}
      <section id="gallery" className="relative py-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
            Asset Gallery
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Developer Canvas Visuals
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm sm:text-base font-medium">
            Scroll down to watch our asset grid zoom open and scale with deep parallax effects.
          </p>
        </div>

        {/* ZoomParallax Component */}
        <ZoomParallax images={parallaxImages} />
      </section>

      {/* 10. Roadmap Timeline (Evolution Path) */}
      <section id="roadmap" className="py-16 max-w-6xl mx-auto px-6 border-t border-white/5">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
            Evolution Path
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Product Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Phase 1 */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0e]/80 backdrop-blur-md space-y-4">
            <Badge className="bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-bold uppercase tracking-wider rounded">
              AVAILABLE NOW
            </Badge>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              {["AI Project Generation", "Browser Editor Interface", "Vite/HTML Live Preview", "Basic Scaffolds / Templates"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-green-400 block shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0e]/80 backdrop-blur-md space-y-4">
            <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-bold uppercase tracking-wider rounded">
              IN PROGRESS
            </Badge>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              {["GitHub Direct Syncing", "Workspace Change History", "More robust terminal run scripts"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-blue-400 block shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0e]/80 backdrop-blur-md space-y-4">
            <Badge className="bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded">
              COMING SOON
            </Badge>
            <ul className="space-y-3 text-sm text-zinc-300 font-medium">
              {["One-click Cloud Deployment", "Collaborative Team Workspaces", "Visual Schema & DB Builder"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-400 block shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 11. Testimonials (Twitter Wall of Love) */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-transparent via-red-950/5 to-[#040406]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 justify-between">
          <div className="max-w-md space-y-6">
            <Badge variant="outline" className="border-red-500/20 bg-red-950/10 text-red-400 uppercase tracking-wider text-[10px] font-bold">
              Wall of Love
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Loved by Builders
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
              Read what developers, visual engineers, and fullstack architects think about the CodeAarambh platform. Hover or tap on the cards to expand and inspect the stacked testimonial list.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="size-4 text-red-500" />
                <span>Over 1,200+ active coders</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <ShieldCheck className="size-4 text-red-500" />
                <span>Verified profiles</span>
              </div>
            </div>
          </div>
          
          {/* Twitter stacked cards */}
          <div className="w-full max-w-lg flex justify-center py-16 pr-8">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* 12. Final CTA Banner */}
      <section className="py-16 max-w-6xl mx-auto px-6 text-center">
        <div className="p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c10] via-[#070709] to-[#0d090d] space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl mx-auto leading-tight">
            Start building with CodeAarambh.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto font-medium">
            Join developers, founders, and students who are using CodeAarambh to turn templates and ideas into live apps.
          </p>
          <div className="pt-4">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs uppercase tracking-wider px-8 shadow-xl shadow-red-600/25 border-0">
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* 13. Rich Footer */}
      <footer className="border-t border-white/5 bg-[#040406] py-16 px-6 md:px-12 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand col (span-4) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="CodeAarambh Logo" className="size-8 object-contain" />
              <span className="font-bold text-white text-base tracking-wider">
                CodeAarambh
              </span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs">
              Built in Nepal in collab with India for students, founders, and developers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/profile.php?id=61589902640825" target="_blank" rel="noreferrer" className="size-8 rounded-full border border-white/5 bg-[#0b0b0f] flex items-center justify-center hover:border-white/10 hover:text-white transition-all">
                <FacebookIcon className="size-4" />
              </a>
              <a href="https://www.instagram.com/codeaarambh/" target="_blank" rel="noreferrer" className="size-8 rounded-full border border-white/5 bg-[#0b0b0f] flex items-center justify-center hover:border-white/10 hover:text-white transition-all">
                <InstagramIcon className="size-4" />
              </a>
              <a href="https://x.com/codeaarambh" target="_blank" rel="noreferrer" className="size-8 rounded-full border border-white/5 bg-[#0b0b0f] flex items-center justify-center hover:border-white/10 hover:text-white transition-all">
                <TwitterIcon className="size-4" />
              </a>
              <a href="https://github.com/codeaarambh" target="_blank" rel="noreferrer" className="size-8 rounded-full border border-white/5 bg-[#0b0b0f] flex items-center justify-center hover:border-white/10 hover:text-white transition-all">
                <GithubIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Nav Links cols (span-8) */}
          <div className="md:col-span-8 grid grid-cols-3 gap-6 font-semibold uppercase tracking-wider text-[10px]">
            <div className="space-y-4">
              <h5 className="text-zinc-400 font-bold">Product</h5>
              <ul className="space-y-2.5 text-zinc-500 font-medium normal-case tracking-normal text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#curriculum-slider" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#roadmap" className="hover:text-white transition-colors">Docs</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-zinc-400 font-bold">Company</h5>
              <ul className="space-y-2.5 text-zinc-500 font-medium normal-case tracking-normal text-xs">
                <li><a href="#manifest" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#manifest" className="hover:text-white transition-colors">About</a></li>
                <li><a href="mailto:codeaarambh@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-zinc-400 font-bold">Legal</h5>
              <ul className="space-y-2.5 text-zinc-500 font-medium normal-case tracking-normal text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] tracking-wider uppercase font-bold text-zinc-600">
            © 2026 CODEAARAMBH. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[10px] font-medium text-zinc-600">
            Contact us: <a href="mailto:codeaarambh@gmail.com" className="hover:text-zinc-400 underline">codeaarambh@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant in the bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        <MorphPanel onSubmit={(prompt) => handlePromptSubmit(undefined, prompt)} />
      </div>
    </div>
  );
}
