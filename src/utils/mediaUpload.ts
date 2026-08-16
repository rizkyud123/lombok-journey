/**
 * Media upload utility to send base64 image or video data to backend server
 * Returns a permanent static URL (e.g. /uploads/img-123456.jpg)
 */
export async function uploadMediaToServer(
  base64OrDataUrl: string,
  filename?: string,
  folder: 'gallery' | 'video' | 'destinations' = 'gallery'
): Promise<string> {
  if (!base64OrDataUrl || typeof base64OrDataUrl !== 'string') {
    return base64OrDataUrl;
  }

  // If already an HTTP/HTTPS URL or static /uploads path, return as is
  if (
    base64OrDataUrl.startsWith('http://') ||
    base64OrDataUrl.startsWith('https://') ||
    base64OrDataUrl.startsWith('/uploads/') ||
    base64OrDataUrl.startsWith('/')
  ) {
    return base64OrDataUrl;
  }

  // If it's a data URL or raw base64, upload to server
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: base64OrDataUrl,
        filename: filename || 'media.jpg',
        folder
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.url) {
        return json.url;
      }
    }
  } catch (error) {
    console.warn('Upload to server endpoint notice, using original data:', error);
  }

  return base64OrDataUrl;
}
