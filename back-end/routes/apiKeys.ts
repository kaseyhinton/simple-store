import { Request, Response } from "polka";
import { insertApiKey, deleteApiKey } from "../db/queries";
import { validate as isValidUUID } from "uuid";
import { Database } from "sqlite";

export function createApiKeyHandlers(db: Database) {
  return {
    createApiKey: async (req: Request, res: Response) => {
      const { key, rateLimit } = req.body;

      if (!isValidUUID(key)) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Invalid API key format. Must be a valid UUID.",
          })
        );
        return;
      }

      try {
        await insertApiKey(db, key, rateLimit || 100);
        res.statusCode = 201;
        res.end(
          JSON.stringify({ message: "API key created successfully", key })
        );
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Failed to create API key",
            error: (err as Error).message,
          })
        );
      }
    },

    deleteApiKey: async (req: Request, res: Response) => {
      const { key } = req.params;

      try {
        const result = await deleteApiKey(db, key);
        if (result?.changes ?? 0 > 0) {
          res.statusCode = 200;
          res.end(
            JSON.stringify({ message: "API key deleted successfully", key })
          );
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "API key not found" }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Failed to delete API key",
            error: (err as Error).message,
          })
        );
      }
    },
  };
}
