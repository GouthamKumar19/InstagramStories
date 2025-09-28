"use client";

import Image from "next/image";

import type { Story } from "@/data/stories";
import { cn } from "@/lib/utils";

export type StoryRailProps = {
  stories: Story[];
  activeStoryId?: string;
  onStorySelect?: (storyId: string) => void;
};

export function StoryRail({ stories, activeStoryId, onStorySelect }: StoryRailProps) {
  return (
    <div className="relative">
      <section
        aria-label="Available stories"
        className="relative flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [mask-image:linear-gradient(to_right,transparent_0,black_8%,black_92%,transparent_100%)] [scrollbar-width:none] [--tw-scroll-shadow:0px] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((story) => {
          const isActive = story.id === activeStoryId;

          return (
            <button
              key={story.id}
              type="button"
              aria-current={isActive ? "true" : undefined}
              aria-label={`Open story from ${story.author.name}`}
              className={cn(
                "group relative flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 text-center text-xs font-medium text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
              )}
              onClick={() => onStorySelect?.(story.id)}
            >
              <span
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background shadow-sm transition",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "group-hover:border-primary/50"
                )}
              >
                <Image
                  src={story.author.avatarUrl}
                  alt={`${story.author.name} avatar`}
                  fill
                  loading="lazy"
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span className="max-w-[4.5rem] truncate">
                {story.author.name.split(" ")[0] ?? story.author.name}
              </span>
            </button>
          );
        })}
      </section>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" aria-hidden />
    </div>
  );
}
