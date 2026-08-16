/**
 * Media upload utility: preserves compact compressed base64 Data URLs so images
 * are 100% self-contained, stored in Cloud Firestore, and visible on Computer B, mobile, and Vercel.
 */
export async function uploadMediaToServer(
  base64OrDataUrl: string,
  filename?: string,
  folder: 'gallery' | 'video' | 'destinations' = 'gallery'
): Promise<string> {
  if (!base64OrDataUrl || typeof base64OrDataUrl !== 'string') {
    return base64OrDataUrl;
  }

  // If already an HTTP/HTTPS URL, return as is
  if (base64OrDataUrl.startsWith('http://') || base64OrDataUrl.startsWith('https://')) {
    return base64OrDataUrl;
  }

  // Also notify server backend if running in fullstack mode
  try {
    fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: base64OrDataUrl,
        filename: filename || 'media.jpg',
        folder
      })
    }).catch(() => {});
  } catch {}

  // Return the self-contained compressed Data URL so any computer, Vercel, or mobile device
  // can render the image directly from Cloud Firestore without depending on local disk paths.
  return base64OrDataUrl;
}

