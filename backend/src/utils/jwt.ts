import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

export class JWTUtils {
  static generateToken(payload: { id: number; email: string }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
