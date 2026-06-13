import React, { useState } from 'react';

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Voice Assistant',
    imageUrl: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1000',
  },
  {
    id: 2,
    title: 'AI Image Generation',
    imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=1000',
  },
  {
    id: 3,
    title: 'AI Chatbot + Local RAG',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000',
  },
  {
    id: 4,
    title: 'AI Agent',
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1000',
  },
  {
    id: 5,
    title: 'Visual Understanding',
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=1000',
  },
];

interface AccordionItemProps {
  item: typeof accordionItems[0];
  isActive: boolean;
  onMouseEnter: () => void;
}

// --- Accordion Item Component ---
const AccordionItem: React.FC<AccordionItemProps> = ({ item, isActive, onMouseEnter }) => {
  return (
    <div
      className={`
        relative h-[380px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out select-none
        ${isActive ? 'w-[280px] sm:w-[400px]' : 'w-[50px] sm:w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Caption Text */}
      <span
        className={`
          absolute text-white text-sm sm:text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0' // Active state: horizontal, bottom-center
              // Inactive state: vertical, positioned at the bottom, for all screen sizes
              : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};


// --- Main App Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-transparent font-sans">
      <section className="container mx-auto py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-left space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              You are given a task to integrate an existing React component in the codebase
            </h1>
            <div className="space-y-4">
              <p className="text-sm md:text-base text-zinc-300 font-semibold">
                The codebase should support:
              </p>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 block"></span>
                  <span>shadcn project structure</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 block"></span>
                  <span>Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 block"></span>
                  <span>Typescript</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3 pt-2 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
              <p>
                If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.
              </p>
              <p>
                Determine the default path for components and styles. If default path for components is not <code className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded font-mono">/components/ui</code>, provide instructions on why it's important to create this folder.
              </p>
              <p>
                Copy-paste this component to <code className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded font-mono">/components/ui</code> folder: <code className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded font-mono">interactive-image-accordion.tsx</code>
              </p>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full md:w-1/2 overflow-hidden flex justify-center">
            {/* Flex-row layout consistent across screen sizes */}
            <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 p-2 w-full">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
