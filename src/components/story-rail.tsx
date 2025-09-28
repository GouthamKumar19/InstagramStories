"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

import type { Story } from "@/data/stories";
import { cn } from "@/lib/utils";

export type CurrentUserSummary = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type StoryRailProps = {
  currentUser: CurrentUserSummary;
  stories: Story[];
  activeStoryId?: string;
  onStorySelect?: (storyId: string) => void;
};

export function StoryRail({ currentUser, stories, activeStoryId, onStorySelect }: StoryRailProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const comingSoonTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (comingSoonTimeout.current) {
        clearTimeout(comingSoonTimeout.current);
      }
    };
  }, []);

  const handleAddStory = () => {
    setShowComingSoon(true);
    if (comingSoonTimeout.current) {
      clearTimeout(comingSoonTimeout.current);
    }
    comingSoonTimeout.current = setTimeout(() => {
      setShowComingSoon(false);
    }, 2200);
  };

  return (
    <div className="relative">
      <section
        aria-label="Available stories"
        className="relative flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [mask-image:linear-gradient(to_right,transparent_0,black_8%,black_92%,transparent_100%)] [scrollbar-width:none] [--tw-scroll-shadow:0px] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={handleAddStory}
          className="group relative flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-2 text-center text-xs font-medium text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Add to your story"
        >
          <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-primary/50 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <Image
              src={currentUser.avatarUrl}
              alt="Your avatar"
              fill
              sizes="64px"
              className="object-cover"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-background shadow-sm">
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </span>
          </span>
          <span className="max-w-[4.5rem] truncate text-foreground/80 group-hover:text-foreground">
            Your story
          </span>
        </button>

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
      {showComingSoon ? (
        <div className="pointer-events-none absolute left-6 top-full mt-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm" aria-live="assertive">
          Story uploads coming soon
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" aria-hidden />
    </div>
  );
}
