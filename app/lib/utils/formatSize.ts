/**
 * Converts bytes to a human-readable file size string
 * @param bytes - The size in bytes
 * @returns A formatted string (e.g., "2.5 MB", "1.2 GB")
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
