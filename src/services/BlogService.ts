import { Links } from "../constants/config";

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  imageUrl: string | null;
}

/**
 * Parses WordPress RSS feed XML
 */
function parseRssFeed(xml: string): BlogPost[] {
  const posts: BlogPost[] = [];

  // Extract all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let index = 0;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    // Extract title
    const titleMatch = item.match(
      /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/,
    );
    const title = titleMatch
      ? (titleMatch[1] || titleMatch[2] || "").trim()
      : "";

    console.log("title: " + title);

    // Extract link
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : "";

    // Extract pubDate
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const pubDate = dateMatch ? formatDate(dateMatch[1].trim()) : "";

    // Extract description/excerpt
    const descMatch = item.match(
      /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s,
    );
    let excerpt = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : "";
    // Strip HTML tags and limit length
    excerpt = excerpt
      .replace(/<[^>]*>/g, "")
      .substring(0, 150)
      .trim();
    if (excerpt.length === 150) excerpt += "...";

    // Extract image
    let imageUrl: string | null = null;
    const mediaMatch = item.match(/<image>(.*?)<\/image>/);
    if (mediaMatch) {
      imageUrl = mediaMatch[1];
    } else {
      // Try to find image in content
      const contentMatch = item.match(
        /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
      );
      if (contentMatch) {
        const imgMatch = contentMatch[1].match(/<img[^>]*src="([^"]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
    }

    if (title && link) {
      posts.push({
        id: `post-${index}`,
        title,
        link,
        pubDate,
        excerpt,
        imageUrl,
      });
      index++;
    }
  }

  return posts;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// In-memory cache: blog posts don't change minute-to-minute.
const CACHE_TTL_MS = 10 * 60 * 1000;
let blogCache: { data: BlogPost[]; timestamp: number } | null = null;

/**
 * Single fetch attempt with timeout.
 */
async function fetchFeedOnce(): Promise<BlogPost[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(Links.blogFeed, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseRssFeed(xml);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch blog posts with cache + one retry.
 * Falls back to stale cache if both attempts fail.
 */
export async function fetchBlogPosts(limit: number = 10): Promise<BlogPost[]> {
  // Serve fresh cache
  if (blogCache && Date.now() - blogCache.timestamp < CACHE_TTL_MS) {
    return blogCache.data.slice(0, limit);
  }

  // Attempt 1
  try {
    const posts = await fetchFeedOnce();
    blogCache = { data: posts, timestamp: Date.now() };
    return posts.slice(0, limit);
  } catch (firstError) {
    console.warn("Blog fetch failed, retrying in 2s:", firstError);
  }

  // Attempt 2
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const posts = await fetchFeedOnce();
    blogCache = { data: posts, timestamp: Date.now() };
    return posts.slice(0, limit);
  } catch (secondError) {
    console.error("Blog fetch failed after retry:", secondError);
    return blogCache?.data.slice(0, limit) ?? [];
  }
}
