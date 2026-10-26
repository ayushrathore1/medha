import jwt from "jsonwebtoken";

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface TokenPayload {
  userId: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Generates a JWT token for a user.
 */
export function generateToken(
  payload: TokenPayload,
  options: jwt.SignOptions = {}
): string {
  const signOptions: jwt.SignOptions = {
    ...options,
    expiresIn: options.expiresIn ?? (EXPIRES_IN as jwt.SignOptions["expiresIn"]),
  };
  return jwt.sign(payload, JWT_SECRET, signOptions);
}

/**
 * Verifies and decodes a JWT token.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export default generateToken;
