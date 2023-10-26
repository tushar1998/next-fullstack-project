export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Untitled UI",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    { id: "teams", title: "Teams", href: "/teams" },
    // { id: "events", title: "Events", href: "/events" },
  ],
  app: {
    signout: "/api/auth/signout",
  },
  api: {
    config: {
      timeout: 2000,
    },
    baseUrl: process.env.API_BASE_URL,
    greeting: `/api`,
  },
  links: {
    twitter: "https://twitter.com/Tushar98Mistry",
    github: "https://github.com/tushar1998",
    docs: "https://ui.shadcn.com",
  },
  images: {
    signin: {
      banner: "https://images.pexels.com/photos/3934623/pexels-photo-3934623.jpeg",
    },
  },
};
