import { Request, Response, Next } from "polka";
import { getApiKey } from "../db/queries";
import { Database } from "sqlite";

export function validateApiKey(db: Database) {
  return async (req: Request, res: Response, next: Next) => {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "API key is required" }));
      return;
    }

    try {
      const row = await getApiKey(db, apiKey);
      if (!row) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Invalid API key" }));
        return;
      }

      req.apiKey = apiKey;
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
