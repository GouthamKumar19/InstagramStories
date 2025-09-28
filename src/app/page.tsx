import { getStories } from "@/data/stories";
import { StoriesExperience } from "@/components/stories-experience";
import { FeedPostCard, type FeedPost } from "@/components/feed-post-card";

const feedPosts: FeedPost[] = [
  {
    id: "sunlit-coffee",
    author: {
      name: "Maya Chen",
      username: "maya.chen",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60",
    },
    image: {
      url: "https://images.unsplash.com/photo-1504898770365-14faca6a7320",
      alt: "Hands holding a latte with art in a bright cafe",
      width: 1080,
      height: 1350,
    },
    caption: "Slow mornings and even slower sips ☕️✨",
    likes: 1284,
    postedAt: "2024-11-05T08:24:00.000Z",
  },
  {
    id: "studio-vibes",
    author: {
      name: "Leo Martínez",
      username: "leo.draws",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=60",
    },
    image: {
      url: "https://images.unsplash.com/photo-1503602642458-232111445657",
      alt: "Artist desk with sketches and color swatches",
      width: 1080,
      height: 1350,
    },
    caption: "Sketching late into the night. Which palette are you feeling?",
    likes: 2039,
    postedAt: "2024-11-04T22:10:00.000Z",
  },
  {
    id: "coast-hike",
    author: {
      name: "Sofia Reyes",
      username: "sofia.reyes",
      avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=60",
    },
    image: {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      alt: "Hiker standing on a cliff overlooking the ocean",
      width: 1080,
      height: 1350,
    },
    caption: "Chasing the last light along the coast 🌊",
    likes: 3567,
    postedAt: "2024-11-03T17:42:00.000Z",
  },
];

export default async function HomePage() {
  const stories = await getStories();

  return (
    <main className="flex min-h-dvh justify-center bg-gradient-to-b from-background to-background/60 px-0 text-foreground">
      <div className="flex w-full max-w-md flex-col gap-8 pb-24">
        <header className="flex items-center justify-between px-6 pt-8">
          <h1 className="text-2xl font-semibold tracking-tight">Instagram</h1>
          <button
            type="button"
            className="rounded-full border border-border/50 bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            New post
          </button>
        </header>

        <section className="flex flex-col gap-4">
          {/* <div className="flex items-center justify-between px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Stories
            </h2>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-foreground"
            >
              Watch all
            </button>
          </div> */}
          <StoriesExperience stories={stories} />
        </section>

        <section className="flex flex-col gap-6 px-6">
          {feedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </section>
      </div>
    </main>
  );
}
