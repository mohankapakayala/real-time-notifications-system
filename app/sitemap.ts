const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://real-time-notifications-system.vercel.app";

export default function sitemap() {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/notifications` },
    { url: `${SITE_URL}/analytics` },
    { url: `${SITE_URL}/dashboard` },
    { url: `${SITE_URL}/settings` },
  ];
}

