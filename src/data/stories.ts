export type StoryImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type StoryAuthor = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type StorySlide = {
  id: string;
  image: StoryImage;
  durationMs?: number;
};

export type Story = {
  id: string;
  author: StoryAuthor;
  postedAt: string;
  slides: StorySlide[];
};

const stories: Story[] = [
  {
    id: "sunrise-chase",
    postedAt: "2024-11-02T07:15:00.000Z",
    author: {
      id: "amina-h",
      name: "Amina Hassan",
      avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "sunrise-ridge",
        image: {
          url: "https://images.unsplash.com/photo-1494526585095-c41746248156",
          alt: "Golden sunrise light breaking over a mountain ridge",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "sunrise-trail",
        image: {
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          alt: "Trail leading down a misty mountain valley at sunrise",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  {
    id: "city-neon",
    postedAt: "2024-11-03T02:45:00.000Z",
    author: {
      id: "liam-j",
      name: "Liam Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "city-crosswalk",
        image: {
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          alt: "City street at night with neon reflections after rain",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "city-rooftop",
        image: {
          url: "https://images.unsplash.com/photo-1477958946873-4c12bfd295d0",
          alt: "Friends on a rooftop overlooking downtown with neon lights",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  {
    id: "surf-check",
    postedAt: "2024-11-03T10:21:00.000Z",
    author: {
      id: "sora-p",
      name: "Sora Park",
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "surf-lookout",
        image: {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          alt: "Surfer watching a wave at sunrise",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "surf-board",
        image: {
          url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
          alt: "Surfboard resting on the sand with ocean in the background",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  {
    id: "studio-session",
    postedAt: "2024-11-04T18:05:00.000Z",
    author: {
      id: "claire-t",
      name: "Claire Thompson",
      avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "studio-sketch",
        image: {
          url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
          alt: "Fashion designer pinning fabric on a mannequin",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "studio-textiles",
        image: {
          url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
          alt: "Close up of textiles and fabrics in a studio",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  {
    id: "campfire-sky",
    postedAt: "2024-11-04T23:18:00.000Z",
    author: {
      id: "diego-m",
      name: "Diego Mora",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "campfire-night",
        image: {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
          alt: "Friends sitting around a campfire under a starry sky",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "campfire-embers",
        image: {
          url: "https://images.unsplash.com/photo-1470246973918-29a93221c455",
          alt: "Close up of campfire embers glowing at night",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  {
    id: "gallery-opening",
    postedAt: "2024-11-05T01:55:00.000Z",
    author: {
      id: "aya-n",
      name: "Aya Nakamoto",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60",
    },
    slides: [
      {
        id: "gallery-floor",
        image: {
          url: "https://images.unsplash.com/photo-1528330279209-bea111aadb27",
          alt: "Visitors walking through a contemporary art gallery",
          width: 1080,
          height: 1920,
        },
      },
      {
        id: "gallery-detail",
        image: {
          url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
          alt: "Close up of abstract art piece with vibrant colors",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
];

export async function getStories() {
  return stories;
}
