import Image from "next/image";

import type { Story } from "@/data/stories";
import { cn } from "@/lib/utils";

export type StoryViewerProps = {
  story: Story | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function StoryViewer({ story }: StoryViewerProps) {
  if (!story) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-dashed border-border/60 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Select a story to preview it here.
      </div>
    );
  }

  const postedLabel = dateFormatter.format(new Date(story.postedAt));

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[2rem] bg-black shadow-lg shadow-black/30">
      <Image
        src={story.image.url}
        alt={story.image.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-white/30">
            <Image
              src={story.author.avatarUrl}
              alt={`${story.author.name} avatar`}
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <div className="flex flex-col text-start text-sm">
            <span className="font-semibold leading-tight">{story.author.name}</span>
            <span className="text-xs font-medium text-white/80">{postedLabel}</span>
          </div>
        </div>
        <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
          Preview
        </span>
      </header>
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-7">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className={cn(
              "h-full w-1/3 rounded-full bg-white",
              "animate-[pulse_2s_ease-in-out_infinite]"
            )}
          />
        </div>
      </footer>
    </div>
  );
}
