export interface ParsedVideo {
  type: 'youtube' | 'tiktok' | 'instagram' | 'direct' | 'upload' | 'unknown';
  embedUrl?: string;
  originalUrl: string;
  thumbnailUrl?: string;
  isShortOrReel?: boolean;
}

/**
 * Parses any social media or direct video URL into an embeddable format
 */
export function parseVideoUrl(url: string): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', originalUrl: url || '' };
  }

  const cleanUrl = url.trim();

  // 1. Uploaded video data or blob URL
  if (cleanUrl.startsWith('data:video/') || cleanUrl.startsWith('blob:')) {
    return {
      type: 'upload',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl,
      isShortOrReel: false
    };
  }

  // 2. Direct video file (.mp4, .webm, .mov, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl)) {
    return {
      type: 'direct',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl,
      isShortOrReel: false
    };
  }

  // 3. YouTube (Standard, Shorts, youtu.be, embed)
  // Match youtube shorts: youtube.com/shorts/VIDEO_ID
  const ytShortsMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (ytShortsMatch && ytShortsMatch[1]) {
    const videoId = ytShortsMatch[1];
    return {
      type: 'youtube',
      originalUrl: cleanUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isShortOrReel: true
    };
  }

  // Standard youtube match: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      originalUrl: cleanUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isShortOrReel: false
    };
  }

  // 4. TikTok (tiktok.com/@user/video/ID or vm.tiktok.com/...)
  const tiktokMatch = cleanUrl.match(/(?:tiktok\.com\/@[\w.-]+\/video\/|tiktok\.com\/v\/|vt\.tiktok\.com\/|vm\.tiktok\.com\/)(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    const videoId = tiktokMatch[1];
    return {
      type: 'tiktok',
      originalUrl: cleanUrl,
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      isShortOrReel: true
    };
  }
  if (cleanUrl.includes('tiktok.com/')) {
    return {
      type: 'tiktok',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl.includes('/embed/') ? cleanUrl : cleanUrl,
      isShortOrReel: true
    };
  }

  // 5. Instagram (instagram.com/reel/ID or instagram.com/p/ID)
  const igMatch = cleanUrl.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    const postId = igMatch[1];
    return {
      type: 'instagram',
      originalUrl: cleanUrl,
      embedUrl: `https://www.instagram.com/reel/${postId}/embed/captioned`,
      isShortOrReel: true
    };
  }

  // Fallback as direct url
  return {
    type: 'direct',
    originalUrl: cleanUrl,
    embedUrl: cleanUrl,
    isShortOrReel: false
  };
}
