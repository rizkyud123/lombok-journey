/**
 * Utility to process uploaded image file and stamp official @lombokjourney watermark
 */
export async function stampWatermarkToImage(
  fileOrDataUrl: File | string,
  watermarkText: string = '@lombokjourney'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create canvas with optimal dimensions (max 800px) for super fast loading and compact storage
      let width = img.width;
      let height = img.height;
      const maxDim = 800;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // Watermark dimensions calculation
      const badgeHeight = Math.max(26, Math.round(height * 0.052));
      const fontSize = Math.max(11, Math.round(badgeHeight * 0.44));
      const subFontSize = Math.max(8, Math.round(badgeHeight * 0.28));
      const paddingX = Math.round(badgeHeight * 0.45);
      const paddingY = Math.round(badgeHeight * 0.2);
      const iconSize = Math.max(14, Math.round(badgeHeight * 0.58));

      ctx.font = `800 ${fontSize}px sans-serif`;
      const textWidth = ctx.measureText(watermarkText).width;
      const badgeWidth = textWidth + iconSize + paddingX * 2.6;

      const badgeX = width - badgeWidth - Math.max(12, width * 0.025);
      const badgeY = height - badgeHeight - Math.max(12, height * 0.025);
      const radius = 6;

      // Draw shadow for watermark badge
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Draw badge background capsule (Navy #112D4E with 90% opacity)
      ctx.fillStyle = 'rgba(17, 45, 78, 0.90)';
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, radius)
        : ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.fill();

      // Reset shadow for inner elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw golden border on capsule
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw circular emblem icon placeholder/gold ring
      const iconCenterX = badgeX + paddingX + iconSize / 2;
      const iconCenterY = badgeY + badgeHeight / 2;

      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, iconSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();

      // Draw mini palm/compass letter in emblem
      ctx.fillStyle = '#112D4E';
      ctx.font = `bold ${Math.round(iconSize * 0.6)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LJ', iconCenterX, iconCenterY);

      // Draw Watermark Main Text
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${fontSize}px "Montserrat", sans-serif`;
      ctx.fillText(
        watermarkText,
        badgeX + paddingX + iconSize + Math.round(paddingX * 0.5),
        badgeY + badgeHeight / 2 - (badgeHeight > 32 ? 2 : 0)
      );

      // If badge is tall enough, draw "TOUR & TRAVEL LOMBOK" subtitle
      if (badgeHeight > 32) {
        ctx.fillStyle = '#30E3CA';
        ctx.font = `700 ${subFontSize}px sans-serif`;
        ctx.fillText(
          'TOUR & TRAVEL',
          badgeX + paddingX + iconSize + Math.round(paddingX * 0.5),
          badgeY + badgeHeight / 2 + subFontSize + 1
        );
      }

      // Convert to compressed web-friendly JPEG data URL (quality 0.75 for compact storage & crisp look)
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Gagal memuat gambar untuk proses watermark'));
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Gagal membaca file gambar'));
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
