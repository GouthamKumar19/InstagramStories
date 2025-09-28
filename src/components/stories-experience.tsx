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
      avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    }),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const [isStoryReady, setIsStoryReady] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const progressSnapshotRef = useRef(0);

  const totalStories = availableStories.length;

  const activeStory = useMemo(
    () => availableStories[activeIndex] ?? null,
    [availableStories, activeIndex],
  );

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
  }, [activeIndex]);

  const selectStoryById = useCallback(
    (storyId: string) => {
      const index = availableStories.findIndex((story) => story.id === storyId);
      if (index === -1) return;

      progressSnapshotRef.current = 0;
      setPlaybackProgress(0);
      setIsStoryReady(false);
      setIsManualPause(false);
      setActiveIndex(index);
      setIsViewerOpen(true);
    },
    [availableStories],
  );

  const goToNext = useCallback(() => {
    if (totalStories === 0) return;
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
    setIsStoryReady(false);
    setActiveIndex((prev) => (prev + 1) % totalStories);
  }, [totalStories]);

  const goToPrevious = useCallback(() => {
    if (totalStories === 0) return;
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
    setIsStoryReady(false);
    setActiveIndex((prev) => (prev - 1 + totalStories) % totalStories);
  }, [totalStories]);

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

    let animationFrame = 0;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp - progressSnapshotRef.current * PLAYBACK_DURATION_MS;
      }

      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(elapsed / PLAYBACK_DURATION_MS, 1);

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
  }, [goToNext, isPlaybackPaused, totalStories, activeIndex, isViewerOpen]);

  const handleCloseViewer = useCallback(() => {
    setIsViewerOpen(false);
    setIsManualPause(false);
    setIsStoryReady(false);
    progressSnapshotRef.current = 0;
    setPlaybackProgress(0);
  }, []);

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
              progress={playbackProgress}
              isPaused={isPlaybackPaused}
              activeIndex={activeIndex}
              totalStories={totalStories}
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
