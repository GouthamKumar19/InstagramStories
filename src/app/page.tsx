import { getStories } from "@/data/stories";
import { StoryRail } from "@/components/story-rail";
import { StoryViewer } from "@/components/story-viewer";

export default async function HomePage() {
  const stories = await getStories();
  const featuredStory = stories[0] ?? null;

  return (
    <main className="flex min-h-dvh bg-gradient-to-b from-background to-background/60 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pb-10 pt-8 sm:px-6">
        <header className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Stories
            </h1>
            <p className="text-sm text-muted-foreground">
              Catch up with the latest moments from your friends.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            New
          </button>
        </header>
        <StoryRail stories={stories} activeStoryId={featuredStory?.id} />
        <div className="flex flex-1 px-2">
          <StoryViewer story={featuredStory} />
        </div>
      </div>
    </main>
  );
}
