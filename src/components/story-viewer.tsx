"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Story, StorySlide } from "@/data/stories";
import { cn } from "@/lib/utils";

export type StoryViewerProps = {
  story: Story | null;
  slide: StorySlide | null;
  slideIndex: number;
  progress: number;
  isPaused: boolean;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  onStoryReady?: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function StoryViewer({
  story,
  slide,
  slideIndex,
  progress,
  isPaused,
  onNavigatePrevious,
  onNavigateNext,
  onHoldStart,
  onHoldEnd,
  onStoryReady,
}: StoryViewerProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    setIsImageLoaded(false);
    setShowInstructions(true);
  }, [story?.id, slide?.id]);

  useEffect(() => {
    if (!isImageLoaded) return;

    const timeout = window.setTimeout(() => setShowInstructions(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [isImageLoaded]);

  const clampedProgress = useMemo(() => {
    if (Number.isNaN(progress)) return 0;
    return Math.min(1, Math.max(0, progress));
  }, [progress]);

  const segments = useMemo(() => {
    if (!story) {
      return [] as Array<{ id: string | number }>;
    }

    const slides = story.slides ?? [];
    if (slides.length === 0) {
      return [{ id: `${story.id}-placeholder` }];
    }

    return slides;
  }, [story]);

  if (!story || !slide) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-dashed border-border/60 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Select a story to preview it here.
      </div>
    );
  }

  const postedLabel = dateFormatter.format(new Date(story.postedAt));

  const handleImageReady = () => {
    setIsImageLoaded(true);
    onStoryReady?.();
  };

  const handleHoldStart = () => {
    onHoldStart?.();
  };

  const handleHoldEnd = () => {
    onHoldEnd?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onNavigatePrevious();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      onNavigateNext();
      return;
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      handleHoldStart();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      handleHoldEnd();
    }
  };

  const segmentProgress = (index: number) => {
    if (segments.length === 0) return 0;
    const currentIndex = Math.min(slideIndex, segments.length - 1);
    if (index < currentIndex) return 1;
    if (index > currentIndex) return 0;
    return clampedProgress;
  };

  return (
    <div
      className="relative flex aspect-[9/16] w-full max-w-sm flex-1 items-center justify-center overflow-hidden rounded-[2rem] bg-black shadow-lg shadow-black/30 focus:outline-none"
      role="region"
      aria-label="Story viewer"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <Image
        key={slide.id}
        src={slide.image.url}
        alt={slide.image.alt}
        fill
        priority={slideIndex === 0}
        sizes="(max-width: 768px) 100vw, 480px"
        className={cn(
          "object-cover opacity-0 transition-opacity duration-500 ease-out motion-reduce:opacity-100 motion-reduce:transition-none",
          isImageLoaded && "opacity-100 motion-safe:animate-[story-fade-in_320ms_ease-out_forwards]"
        )}
        onLoadingComplete={handleImageReady}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-transparent" aria-hidden />
          <span className="sr-only">Loading story…</span>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 flex flex-col gap-3 px-6 py-5 text-white">
        <div className="flex items-center gap-2" aria-live="polite" aria-label="Story progress">
          {segments.map((segment, index) => (
            <div key={"id" in segment ? segment.id : `${story.id}-${index}`} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className={cn(
                  "h-full bg-white transition-[width,opacity] duration-200 ease-out",
                  isPaused && index === slideIndex && "opacity-60"
                )}
                style={{ width: `${segmentProgress(index) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <header className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-white/30">
              <Image
                src={story.author.avatarUrl}
                alt={`${story.author.name} avatar`}
                fill
                loading="lazy"
                sizes="44px"
                className="object-cover"
              />
            </span>
            <div className="flex flex-col text-start">
              <span className="font-semibold leading-tight">{story.author.name}</span>
              <span className="text-xs font-medium text-white/80">{postedLabel}</span>
            </div>
          </div>
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Story
          </span>
        </header>
      </div>

      <button
        type="button"
        aria-label="Show previous story"
        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer bg-gradient-to-r from-black/20 to-transparent text-white/0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        onClick={onNavigatePrevious}
        onPointerDown={handleHoldStart}
        onPointerUp={handleHoldEnd}
        onPointerLeave={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
      />
      <button
        type="button"
        aria-label="Show next story"
        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer bg-gradient-to-l from-black/20 to-transparent text-white/0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        onClick={onNavigateNext}
        onPointerDown={handleHoldStart}
        onPointerUp={handleHoldEnd}
        onPointerLeave={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
      />

      {showInstructions && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-between px-6 text-xs font-medium uppercase tracking-wide text-white/70 transition-opacity duration-500 ease-out">
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Tap left
          </span>
          <span className="flex items-center gap-1">
            Tap right
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      )}
    </div>
  );
}
