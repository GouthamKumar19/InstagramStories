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

export type Story = {
  id: string;
  author: StoryAuthor;
  image: StoryImage;
  postedAt: string;
};

const stories: Story[] = [
  {
    id: "sunrise-chase",
    postedAt: "2024-11-02T07:15:00.000Z",
    author: {
      id: "amina-h",
      name: "Amina Hassan",
      avatarUrl: "https://images.unsplash.com/profile-1690388644615-60470c6fa7b1image",
    },
    image: {
      url: "https://images.unsplash.com/photo-1494526585095-c41746248156",
      alt: "Golden sunrise light breaking over a mountain ridge",
      width: 1080,
      height: 1920,
    },
  },
  {
    id: "city-neon",
    postedAt: "2024-11-03T02:45:00.000Z",
    author: {
      id: "liam-j",
      name: "Liam Johnson",
      avatarUrl: "https://images.unsplash.com/profile-1662203927051-efd502220dc9image",
    },
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      alt: "City street at night with neon reflections after rain",
      width: 1080,
      height: 1920,
    },
  },
  {
    id: "surf-check",
    postedAt: "2024-11-03T10:21:00.000Z",
    author: {
      id: "sora-p",
      name: "Sora Park",
      avatarUrl: "https://images.unsplash.com/profile-1532004590789-2043614d00f5image",
    },
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      alt: "Surfer watching a wave at sunrise",
      width: 1080,
      height: 1920,
    },
  },
  {
    id: "studio-session",
    postedAt: "2024-11-04T18:05:00.000Z",
    author: {
      id: "claire-t",
      name: "Claire Thompson",
      avatarUrl: "https://images.unsplash.com/profile-1695039471711-1e8a489346d5image",
    },
    image: {
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      alt: "Fashion designer pinning fabric on a mannequin",
      width: 1080,
      height: 1920,
    },
  },
  {
    id: "campfire-sky",
    postedAt: "2024-11-04T23:18:00.000Z",
    author: {
      id: "diego-m",
      name: "Diego Mora",
      avatarUrl: "https://images.unsplash.com/profile-1672963944860-0c4f113fb9fcimage",
    },
    image: {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      alt: "Friends sitting around a campfire under a starry sky",
      width: 1080,
      height: 1920,
    },
  },
  {
    id: "gallery-opening",
    postedAt: "2024-11-05T01:55:00.000Z",
    author: {
      id: "aya-n",
      name: "Aya Nakamoto",
      avatarUrl: "https://images.unsplash.com/profile-1605119607867-bd1cc4031462image",
    },
    image: {
      url: "https://images.unsplash.com/photo-1528330279209-bea111aadb27",
      alt: "Visitors walking through a contemporary art gallery",
      width: 1080,
      height: 1920,
    },
  },
];

export async function getStories() {
  return stories;
}

