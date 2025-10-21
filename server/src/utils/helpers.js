import bcrypt from "bcryptjs";
import { BCRYPT } from "../config/constants.js";

/**
 * Hash password asynchronously (non-blocking)
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(BCRYPT.SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare plain password with hashed password asynchronously
 * @param {string} plain - Plain text password
 * @param {string} hashed - Hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
export const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
