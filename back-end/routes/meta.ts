import { Request, Response } from "polka";
import { getMetadata } from "../db/queries";
import { Database } from "sqlite";

export function createMetaHandlers(db: Database) {
  return {
    getMetadata: async (req: Request, res: Response) => {
      try {
        const row = await getMetadata(db);
        const metadata = {
          totalSize: row?.totalSize || 0,
          totalCollections: row?.totalCollections || 0,
          createdAt: row?.createdAt,
          updatedAt: row?.updatedAt,
        };
        res.statusCode = 200;
        res.end(JSON.stringify(metadata));
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Failed to fetch metadata",
            error: (err as Error).message,
          })
        );
      }
    },
  };
}
