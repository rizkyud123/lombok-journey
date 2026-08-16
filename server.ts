import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  BUSINESS_INFO,
  TRIP_SERVICES,
  DESTINATIONS,
  ACTIVITY_GALLERY,
  DEFAULT_ESTIMATOR_CONFIG,
  INITIAL_BOOKINGS
} from './src/data';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 photo uploads from admin
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Persistent storage directory and file path
  const storageDir = path.join(process.cwd(), 'data');
  const storageFile = path.join(storageDir, 'app-data.json');
  const uploadsDir = path.join(process.cwd(), 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploaded media files with proper headers for streaming & caching
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }));

  const getDefaultData = () => ({
    businessInfo: BUSINESS_INFO,
    services: TRIP_SERVICES,
    destinations: DESTINATIONS,
    galleryActivities: ACTIVITY_GALLERY,
    estimatorConfig: DEFAULT_ESTIMATOR_CONFIG,
    bookings: INITIAL_BOOKINGS,
    updatedAt: new Date().toISOString(),
    version: 1
  });

  const readDataFromDisk = () => {
    try {
      if (fs.existsSync(storageFile)) {
        const raw = fs.readFileSync(storageFile, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading data file from disk:', err);
    }
    return null;
  };

  const writeDataToDisk = (data: any) => {
    try {
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing data file to disk:', err);
      return false;
    }
  };

  // Keep in-memory cache synchronized with disk
  let globalMemoryData = readDataFromDisk() || getDefaultData();

  // Ensure file exists on disk
  if (!fs.existsSync(storageFile)) {
    writeDataToDisk(globalMemoryData);
  }

  // Anti-cache headers for all API requests to ensure every browser gets real-time data
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      updatedAt: globalMemoryData.updatedAt
    });
  });

  // Upload Media (Photos & Videos) to server disk storage
  app.post('/api/upload', (req, res) => {
    try {
      const { data, filename, folder } = req.body;
      if (!data || typeof data !== 'string') {
        return res.status(400).json({ success: false, message: 'Data media (base64) wajib disertakan' });
      }

      // Detect mime type and extension from data URL header
      let ext = 'jpg';
      let cleanBase64 = data;
      
      const matches = data.match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        cleanBase64 = matches[2];
        if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('webp')) ext = 'webp';
        else if (mimeType.includes('gif')) ext = 'gif';
        else if (mimeType.includes('mp4')) ext = 'mp4';
        else if (mimeType.includes('webm')) ext = 'webm';
        else if (mimeType.includes('quicktime') || mimeType.includes('mov')) ext = 'mov';
        else if (mimeType.includes('ogg')) ext = 'ogg';
        else ext = 'jpg';
      } else if (filename && filename.includes('.')) {
        ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
      }

      // If specific folder requested (e.g. 'gallery', 'video')
      const targetDir = folder ? path.join(uploadsDir, folder) : uploadsDir;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const safePrefix = ext === 'mp4' || ext === 'webm' || ext === 'mov' ? 'video' : 'img';
      const uniqueFilename = `${safePrefix}-${Date.now()}-${randomSuffix}.${ext}`;
      const filePath = path.join(targetDir, uniqueFilename);

      const buffer = Buffer.from(cleanBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      const relativeUrl = folder ? `/uploads/${folder}/${uniqueFilename}` : `/uploads/${uniqueFilename}`;
      console.log(`[Lombok Journey Upload] Saved media file ${relativeUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

      res.json({
        success: true,
        url: relativeUrl,
        filename: uniqueFilename,
        size: buffer.length,
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error uploading media to server:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Get current global data (accessible by all browsers and devices)
  app.get('/api/data', (req, res) => {
    // If disk has newer data or in-memory, serve memory data
    res.json({
      success: true,
      data: globalMemoryData,
      serverTime: new Date().toISOString()
    });
  });

  // Save changes from Admin Dashboard to server storage
  app.post('/api/data', (req, res) => {
    try {
      const current = globalMemoryData || readDataFromDisk() || getDefaultData();
      const updated = {
        ...current,
        ...req.body,
        updatedAt: new Date().toISOString(),
        version: (current.version || 0) + 1
      };
      
      // Update in-memory immediately
      globalMemoryData = updated;
      
      // Persist to disk
      writeDataToDisk(updated);

      console.log(`[Lombok Journey Server] Data updated at ${updated.updatedAt}, version: ${updated.version}`);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      console.error('Error saving data on server:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Reset data to defaults
  app.post('/api/data/reset', (req, res) => {
    try {
      const defaults = getDefaultData();
      globalMemoryData = defaults;
      writeDataToDisk(defaults);
      console.log(`[Lombok Journey Server] Data reset to defaults at ${defaults.updatedAt}`);
      res.json({ success: true, data: defaults, message: 'Data berhasil direset ke default' });
    } catch (err: any) {
      console.error('Error resetting server data:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lombok Journey server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
