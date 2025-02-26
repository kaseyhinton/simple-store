import { Request, Response, Next } from "polka";
import { getJson } from "../db/queries";
import { Database } from "sqlite";

export function enforceOwnership(db: Database) {
  return async (req: Request, res: Response, next: Next) => {
    const { key } = req.params;
    const apiKey = req.apiKey as string;

    try {
      const row = await getJson(db, key);

      if (!row) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Data not found" }));
        return;
      }

      // Allow access if the user is an admin or the resource owner
      if (req.role === "admin" || row.createdBy === apiKey) {
        next();
      } else {
        res.statusCode = 403;
        res.end(
          JSON.stringify({
            message: "Forbidden: You do not have access to this resource",
          })
        );
      }
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
