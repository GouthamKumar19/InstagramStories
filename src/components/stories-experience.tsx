"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
      if (index !== -1) {
        setActiveIndex(index);
        setIsViewerOpen(false);
      }
    },
    [availableStories],
  );

  const goToNext = useCallback(() => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalStories);
  }, [totalStories]);

  const goToPrevious = useCallback(() => {
    if (totalStories === 0) return;
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

  return (
    <section className="flex flex-col gap-6">
      <StoryRail
        currentUser={currentUser}
        stories={availableStories}
        activeStoryId={activeStory?.id}
        onStorySelect={selectStoryById}
      />
      {isViewerOpen ? (
        <div className="flex flex-1 px-2">
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
      ) : null}
    </section>
  );
}
