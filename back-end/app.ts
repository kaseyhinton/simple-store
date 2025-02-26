import polka from "polka";
import { json } from "body-parser";
import cors from "cors";
import { initializeDB } from "./db/connection";
import {
  validateApiKey,
  rateLimitMiddleware,
  securityHeaders,
} from "./middleware/index.ts"; // Correct import
import {
  createStoreHandlers,
  createApiKeyHandlers,
  createMetaHandlers,
} from "./routes/index.ts"; // Correct import

async function startApp() {
  const db = await initializeDB();

  const app = polka();
  app.use(json());
  app.use(cors());
  app.use(securityHeaders);

  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
  });
  app.use((req, res, next) => {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    next();
  });

  const { storeData, getData, deleteData } = createStoreHandlers(db);
  const { createApiKey, deleteApiKey } = createApiKeyHandlers(db);
  const { getMetadata } = createMetaHandlers(db);

  app.post(
    "/store/:key",
    validateApiKey(db),
    rateLimitMiddleware(db),
    storeData
  );
  app.get("/store/:key", validateApiKey(db), rateLimitMiddleware(db), getData);
  app.delete(
    "/store/:key",
    validateApiKey(db),
    rateLimitMiddleware(db),
    deleteData
  );

  app.post("/api-keys", createApiKey);
  app.delete("/api-keys/:key", deleteApiKey);

  app.get(
    "/meta/:key",
    validateApiKey(db),
    rateLimitMiddleware(db),
    getMetadata
  );

  app.get("/health", (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "ok" }));
  });

  return app;
}

export { startApp };
