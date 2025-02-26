import { Request, Response, Next } from "polka";

/**
 * Middleware to set security headers.
 */
export function securityHeaders(req: Request, res: Response, next: Next) {
  // Set Content Security Policy (CSP)
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Protect against clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Enable browser XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Control referrer information
  res.setHeader("Referrer-Policy", "no-referrer");

  // Set Strict Transport Security (HSTS) for HTTPS requests
  if (req.secure) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Continue to the next middleware or route handler
  next();
}
