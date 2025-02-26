import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

/**
 * Generates a new API key (JWT) for a user.
 * @param userId - Unique identifier for the user.
 * @param role - Role of the user (default: 'user').
 * @returns A signed JWT as the API key.
 */
export function createApiKey(userId: string, role: string = "user"): string {
  const payload = { userId, role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1y" }); // Expires in 1 year
}

/**
 * Validates an API key (JWT) and returns its decoded payload.
 * @param apiKey - The API key (JWT) to validate.
 * @returns Decoded payload containing userId and role.
 * @throws Error if the API key is invalid.
 */
export function validateApiKey(apiKey: string): {
  userId: string;
  role: string;
} {
  try {
    const decoded = jwt.verify(apiKey, SECRET_KEY) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch (err) {
    throw new Error("Invalid API key");
  }
}
