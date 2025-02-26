import { Request, Response, Next } from "polka";
import { getApiKey } from "../db/queries";
import { Database } from "sqlite";

const rateLimitMap = new Map<string, { count: number; startTime: number }>();

export function rateLimitMiddleware(db: Database) {
  return async (req: Request, res: Response, next: Next) => {
    const apiKey = req.apiKey as string;

    if (!apiKey) {
      return next(); // Skip rate limiting if no API key is provided
    }

    try {
      const row = await getApiKey(db, apiKey);
      if (!row) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Invalid API key" }));
        return;
      }

      const rateLimit = row.rateLimit;
      const currentTime = Date.now();
      const windowSize = 60 * 60 * 1000; // 1 hour window

      if (!rateLimitMap.has(apiKey)) {
        rateLimitMap.set(apiKey, { count: 0, startTime: currentTime });
      }

      const rateLimitData = rateLimitMap.get(apiKey)!;

      if (currentTime - rateLimitData.startTime > windowSize) {
        rateLimitData.count = 0;
        rateLimitData.startTime = currentTime;
      }

      if (rateLimitData.count >= rateLimit) {
        res.statusCode = 429;
        res.end(JSON.stringify({ message: "Rate limit exceeded" }));
        return;
      }

      rateLimitData.count++;
      next();
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          message: "Internal server error",
          error: (err as Error).message,
        })
      );
    }
  };
}
