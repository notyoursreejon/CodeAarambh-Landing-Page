import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="bg-background/80 backdrop-blur-md h-72 w-48 rounded-md border border-white/10 text-white">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-semibold text-red-400">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-xs text-zinc-300 font-medium">{tag}</div>
            <Separator className="my-2 bg-white/5" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
