import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

const NEW_UI_ENABLED = process.env.NEXT_PUBLIC_ORANGE_NEW_UI === "true";
const CLIENT_ROOT = path.resolve(import.meta.dirname, "..", "legacy-client");
const NEXT_DIR = path.resolve(import.meta.dirname, "..", "client");

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupFrontend(app: Express, server: Server) {
  if (NEW_UI_ENABLED) {
    await setupNext(app, true);
    return;
  }

  await setupVite(app, server);
}

export async function serveFrontend(app: Express) {
  if (NEW_UI_ENABLED) {
    await setupNext(app, false);
    return;
  }

  serveStatic(app);
}

async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(CLIENT_ROOT, "index.html");

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

async function setupNext(app: Express, dev: boolean) {
  const mod = await import("next").catch((error: unknown) => {
    viteLogger.error(
      `Failed to load Next.js runtime. Did you run \`npm install\`?\n${String(error)}`,
      { timestamp: true }
    );
    throw error;
  });

  const nextApp = mod.default({
    dev,
    dir: NEXT_DIR,
  });

  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  app.all("*", async (req, res) => {
    try {
      await handle(req, res);
    } catch (error) {
      viteLogger.error((error as Error).message, { timestamp: true });
      res.status(500).send("Internal Server Error");
    }
  });
}
