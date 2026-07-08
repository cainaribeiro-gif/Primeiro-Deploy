import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase payload limit to support base64 images upload (logos/favicons)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SITE_CONTENT_PATH = path.join(process.cwd(), 'site_content.json');

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET custom site content from disk or Supabase
app.get("/api/site-content", async (req, res) => {
  try {
    try {
      const data = await fs.readFile(SITE_CONTENT_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return res.json(parsed);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // File does not exist yet, return empty object so client uses DEFAULT_SITE_CONTENT
        return res.json({});
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error reading site content:", error);
    res.status(500).json({ error: "Failed to read site content" });
  }
});

// POST to save site content to disk
app.post("/api/site-content", async (req, res) => {
  try {
    const siteContent = req.body;
    if (!siteContent || typeof siteContent !== 'object') {
      return res.status(400).json({ error: "Invalid site content data" });
    }

    // Save to local file
    await fs.writeFile(SITE_CONTENT_PATH, JSON.stringify(siteContent, null, 2), 'utf-8');
    
    console.log("✅ Site content successfully saved to server disk!");
    res.json({ success: true, message: "Site content saved successfully" });
  } catch (error: any) {
    console.error("Error saving site content:", error);
    res.status(500).json({ error: "Failed to save site content" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
