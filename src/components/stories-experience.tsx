"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type CurrentUser = {
  id: string;
  name: string;
  avatarUrl: string;
};

import type { Story } from "@/data/stories";
import { StoryRail } from "@/components/story-rail";
import { StoryViewer } from "@/components/story-viewer";

export type StoriesExperienceProps = {
  stories: Story[];
};

const PLAYBACK_DURATION_MS = 5_000;

export function StoriesExperience({ stories }: StoriesExperienceProps) {
  const availableStories = useMemo(() => stories ?? [], [stories]);
  const currentUser = useMemo<CurrentUser>(
    () => ({
      id: "you",
      name: "Your Story",
      avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=60",
    }),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const [isStoryReady, setIsStoryReady] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [seenStoryIds, setSeenStoryIds] = useState<string[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const progressSnapshotRef = useRef(0);

  const totalStories = availableStories.length;

  const activeStory = useMemo(
    () => availableStories[activeIndex] ?? null,
    [availableStories, activeIndex],
  );

  const totalSlides = activeStory?.slides.length ?? 0;
  const activeSlide = totalSlides > 0 ? activeStory?.slides[activeSlideIndex] ?? null : null;
  const isOnLastSlide = totalSlides > 0 && activeSlideIndex >= totalSlides - 1;

  useEffect(() => {
    progressSnapshotRef.current = playbackProgress;
  }, [playbackProgress]);

  useEffect(() => {
    if (totalStories === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= totalStories) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalStories]);

  useEffect(() => {
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
    setIsStoryReady(false);
  }, [activeIndex, activeSlideIndex]);

  const markActiveStoryAsSeen = useCallback(() => {
    const currentStoryId = availableStories[activeIndex]?.id;
    if (!currentStoryId) return;

    setSeenStoryIds((prev) =>
      prev.includes(currentStoryId) ? prev : [...prev, currentStoryId],
    );
  }, [activeIndex, availableStories]);

  const selectStoryById = useCallback(
    (storyId: string) => {
      const index = availableStories.findIndex((story) => story.id === storyId);
      if (index === -1) return;

      if (isViewerOpen && isOnLastSlide) {
        markActiveStoryAsSeen();
      }

      progressSnapshotRef.current = 0;
      setPlaybackProgress(0);
      setIsStoryReady(false);
      setIsManualPause(false);
      setActiveIndex(index);
      setActiveSlideIndex(0);
      setIsViewerOpen(true);
    },
    [availableStories, isOnLastSlide, isViewerOpen, markActiveStoryAsSeen],
  );

  const goToNext = useCallback(() => {
    if (totalStories === 0) return;
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
    setIsStoryReady(false);

    if (totalSlides > 0 && activeSlideIndex < totalSlides - 1) {
      setActiveSlideIndex((prev) => prev + 1);
      return;
    }

    markActiveStoryAsSeen();
    setActiveSlideIndex(0);
    setActiveIndex((prev) => (prev + 1) % totalStories);
  }, [activeSlideIndex, markActiveStoryAsSeen, totalSlides, totalStories]);

  const goToPrevious = useCallback(() => {
    if (totalStories === 0) return;
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
    setIsStoryReady(false);

    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
      return;
    }

    setActiveIndex((prev) => {
      const nextIndex = (prev - 1 + totalStories) % totalStories;
      const nextStory = availableStories[nextIndex];
      const nextSlides = nextStory?.slides ?? [];
      setActiveSlideIndex(Math.max(nextSlides.length - 1, 0));
      return nextIndex;
    });
  }, [activeSlideIndex, availableStories, totalStories]);

  const handleStoryReady = useCallback(() => {
    setIsStoryReady(true);
  }, []);

  const handleManualPauseStart = useCallback(() => {
    setIsManualPause(true);
  }, []);

  const handleManualPauseEnd = useCallback(() => {
    setIsManualPause(false);
  }, []);

  const isPlaybackPaused = !isViewerOpen || isManualPause || !isStoryReady;

  useEffect(() => {
    if (totalStories === 0) return;
    if (!isViewerOpen) return;
    if (isPlaybackPaused) return;

    const playbackDuration = activeSlide?.durationMs ?? PLAYBACK_DURATION_MS;

    let animationFrame = 0;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp - progressSnapshotRef.current * playbackDuration;
      }

      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(elapsed / playbackDuration, 1);

      setPlaybackProgress(nextProgress);

      if (nextProgress >= 1) {
        goToNext();
        return;
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [activeSlide?.durationMs, goToNext, isPlaybackPaused, totalStories, activeIndex, isViewerOpen]);

  const handleCloseViewer = useCallback(() => {
    if (isOnLastSlide) {
      markActiveStoryAsSeen();
    }
    setIsViewerOpen(false);
    setIsManualPause(false);
    setIsStoryReady(false);
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
  }, [isOnLastSlide, markActiveStoryAsSeen]);

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseViewer();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleCloseViewer, isViewerOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isViewerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isViewerOpen]);

  return (
    <>
      <section className="flex flex-col gap-6">
      <StoryRail
        currentUser={currentUser}
        stories={availableStories}
        activeStoryId={activeStory?.id}
        seenStoryIds={seenStoryIds}
        onStorySelect={selectStoryById}
      />
      </section>
      {isViewerOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70"
            aria-hidden
            onClick={handleCloseViewer}
          />
          <button
            type="button"
            aria-label="Close stories"
            className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={handleCloseViewer}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="relative z-40 flex w-full max-w-sm flex-col">
          <StoryViewer
            story={activeStory}
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            progress={playbackProgress}
            isPaused={isPlaybackPaused}
            onNavigatePrevious={goToPrevious}
            onNavigateNext={goToNext}
            onHoldStart={handleManualPauseStart}
            onHoldEnd={handleManualPauseEnd}
            onStoryReady={handleStoryReady}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
