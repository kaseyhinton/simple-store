import { Request, Response } from "polka";
import { Database } from "sqlite";
import { validateApiKey } from "../utils/apiKeys";

/**
 * Handlers for storing, retrieving, and deleting JSON data.
 */
export function createStoreHandlers(db: Database) {
  return {
    /**
     * Stores JSON data under a specific key.
     */
    storeData: async (req: Request, res: Response) => {
      const { key } = req.params;
      const value = JSON.stringify(req.body);
      const apiKey = req.headers["x-api-key"] as string;

      try {
        // Validate the API key and get the userId
        const { userId } = validateApiKey(apiKey);

        // Store the data with ownership information
        await db.run(
          "INSERT OR REPLACE INTO json_storage (key, value, createdBy, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
          [key, value, userId]
        );

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Data stored successfully", key }));
      } catch (err) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid API key",
            error: (err as Error).message,
          })
        );
      }
    },

    /**
     * Retrieves JSON data stored under a specific key.
     */
    getData: async (req: Request, res: Response) => {
      const { key } = req.params;
      const apiKey = req.headers["x-api-key"] as string;

      try {
        // Validate the API key and get the userId and role
        const { userId, role } = validateApiKey(apiKey);

        // Retrieve the data
        const row = await db.get(
          "SELECT value, createdBy FROM json_storage WHERE key = ?",
          [key]
        );

        if (!row) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "Data not found" }));
          return;
        }

        // Check ownership or admin role
        if (role === "admin" || row.createdBy === userId) {
          res.statusCode = 200;
          res.end(row.value);
        } else {
          res.statusCode = 403;
          res.end(
            JSON.stringify({
              message: "Forbidden: You do not have access to this resource",
            })
          );
        }
      } catch (err) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid API key",
            error: (err as Error).message,
          })
        );
      }
    },

    /**
     * Deletes JSON data stored under a specific key.
     */
    deleteData: async (req: Request, res: Response) => {
      const { key } = req.params;
      const apiKey = req.headers["x-api-key"] as string;

      try {
        // Validate the API key and get the userId and role
        const { userId, role } = validateApiKey(apiKey);

        // Check ownership or admin role before deleting
        const row = await db.get(
          "SELECT createdBy FROM json_storage WHERE key = ?",
          [key]
        );

        if (!row) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "Data not found" }));
          return;
        }

        if (role === "admin" || row.createdBy === userId) {
          await db.run("DELETE FROM json_storage WHERE key = ?", [key]);
          res.statusCode = 200;
          res.end(
            JSON.stringify({ message: "Data deleted successfully", key })
          );
        } else {
          res.statusCode = 403;
          res.end(
            JSON.stringify({
              message: "Forbidden: You do not have access to this resource",
            })
          );
        }
      } catch (err) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid API key",
            error: (err as Error).message,
          })
        );
      }
    },
  };
}
