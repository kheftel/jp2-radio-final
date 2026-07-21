import { Banners } from '../constants/config';

export interface BannerItem {
  imageUrl: string;
  linkUrl: string | null;
}

// In-memory cache: avoids refetching on every Home screen visit.
// Banners change rarely (Raul updates them manually), so 10 minutes is safe.
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { data: BannerItem[]; timestamp: number }>();

/**
 * Parses the JP2 Radio banner XML format:
 * <rotator>
 *   <panel>
 *     <number>1</number>
 *     <image>https://...</image>
 *     <url>https://... or empty or self-closing</url>
 *     <redirect>n</redirect>
 *   </panel>
 * </rotator>
 */
function parseBannerXml(xml: string): BannerItem[] {
  const banners: BannerItem[] = [];

  const panelRegex = /<panel>([\s\S]*?)<\/panel>/g;
  let match;

  while ((match = panelRegex.exec(xml)) !== null) {
    const panel = match[1];

    const imageMatch = panel.match(/<image>(.*?)<\/image>/);
    const imageUrl = imageMatch ? imageMatch[1].trim() : '';

    // Handles both <url>...</url> and self-closing <url/>
    const urlMatch = panel.match(/<url>(.*?)<\/url>|<url\s*\/>/);
    const url = urlMatch && urlMatch[1] ? urlMatch[1].trim() : '';

    if (imageUrl && imageUrl.startsWith('http')) {
      banners.push({
        imageUrl,
        linkUrl: url && url.startsWith('http') ? url : null,
      });
    }
  }

  return banners;
}

/**
 * Single fetch attempt with timeout.
 */
async function fetchOnce(xmlUrl: string): Promise<BannerItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(xmlUrl, {
      headers: { Accept: 'application/xml, text/xml' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseBannerXml(xml);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch banners with cache + one retry.
 * 
 * - Cache hit (under 10 min old): returns instantly, no network.
 * - Cache miss: fetches; on failure waits 2s and retries once.
 * - Both attempts fail: returns stale cache if available, else empty array
 *   (HomeScreen shows the JP2 fallback banner in that case).
 */
export async function fetchBanners(xmlUrl: string): Promise<BannerItem[]> {
  // Serve fresh cache
  const cached = cache.get(xmlUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Attempt 1
  try {
    const banners = await fetchOnce(xmlUrl);
    cache.set(xmlUrl, { data: banners, timestamp: Date.now() });
    return banners;
  } catch (firstError) {
    console.warn('Banner fetch failed, retrying in 2s:', firstError);
  }

  // Attempt 2 (after brief delay)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const banners = await fetchOnce(xmlUrl);
    cache.set(xmlUrl, { data: banners, timestamp: Date.now() });
    return banners;
  } catch (secondError) {
    console.error('Banner fetch failed after retry:', secondError);
    // Fall back to stale cache if we have one — old banners beat no banners
    return cached?.data ?? [];
  }
}

export async function fetchHeroBanners(): Promise<BannerItem[]> {
  return fetchBanners(Banners.hero.xmlUrl);
}

export async function fetchSponsorBanners(): Promise<BannerItem[]> {
  return fetchBanners(Banners.sponsor.xmlUrl);
}
