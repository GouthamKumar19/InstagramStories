import Image from "next/image";

import type { Story } from "@/data/stories";
import { cn } from "@/lib/utils";

export type StoryRailProps = {
  stories: Story[];
  activeStoryId?: string;
};

export function StoryRail({ stories, activeStoryId }: StoryRailProps) {
  return (
    <section
      aria-label="Available stories"
      className="relative flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4"
    >
      {stories.map((story) => {
        const isActive = story.id === activeStoryId;

        return (
          <button
            key={story.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "group relative flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 text-center text-xs font-medium text-foreground transition", 
              isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
            )}
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
  );
}
