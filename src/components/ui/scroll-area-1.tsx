import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="bg-transparent h-72 w-48 rounded-md border border-white/10 text-white">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-semibold text-zinc-300">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm text-zinc-400 font-medium py-1">{tag}</div>
            <Separator className="my-2 bg-white/5" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
