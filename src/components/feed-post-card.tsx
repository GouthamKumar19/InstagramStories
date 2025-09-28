import Image from "next/image";

export type FeedPost = {
  id: string;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  caption: string;
  likes: number;
  postedAt: string;
};

function getRelativeTime(postedAt: string) {
  const now = new Date();
  const postedDate = new Date(postedAt);
  const diffMs = postedDate.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 24 * 365],
    ["month", 60 * 24 * 30],
    ["week", 60 * 24 * 7],
    ["day", 60 * 24],
    ["hour", 60],
    ["minute", 1],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, minutesInUnit] of units) {
    const elapsed = Math.round(diffMinutes / minutesInUnit);
    if (Math.abs(elapsed) >= 1) {
      return rtf.format(elapsed, unit);
    }
  }

  return "just now";
}

export function FeedPostCard({ post }: { post: FeedPost }) {
  const postedLabel = getRelativeTime(post.postedAt);

  return (
    <article className="rounded-3xl border border-border/60 bg-background shadow-sm">
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-border/40">
            <Image
              src={post.author.avatarUrl}
              alt={`${post.author.name} avatar`}
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <div className="flex flex-col text-sm">
            <span className="font-semibold leading-tight text-foreground">
              {post.author.username}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {postedLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full px-2 py-1 text-base font-semibold text-muted-foreground/80 transition hover:text-foreground"
          aria-label="More options"
        >
          ···
        </button>
      </header>

      <div className="relative aspect-square w-full overflow-hidden bg-black/10">
        <Image
          src={post.image.url}
          alt={post.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 px-4 py-4 text-sm">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{post.likes.toLocaleString()} likes</span>
          <span className="text-muted-foreground/70">·</span>
          <span>View comments</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-foreground">{post.author.username}</span>{" "}
          {post.caption}
        </p>
        <button
          type="button"
          className="w-fit text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-foreground"
        >
          View all comments
        </button>
      </div>
    </article>
  );
}
