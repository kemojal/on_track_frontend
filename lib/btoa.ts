/**
 * Base64 encode a string
 * @param str String to encode
 * @returns Base64 encoded string
 */
export function btoa(str: string): string {
  if (typeof window !== "undefined") {
    // Browser environment
    return window.btoa(str);
  } else {
    // Node.js environment
    return Buffer.from(str).toString("base64");
  }
}

/**
 * Base64 decode a string
 * @param str Base64 encoded string
 * @returns Decoded string
 */
export function atob(str: string): string {
  if (typeof window !== "undefined") {
    // Browser environment
    return window.atob(str);
  } else {
    // Node.js environment
    return Buffer.from(str, "base64").toString();
  }
}
