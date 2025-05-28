import { S3Client } from "bun";

/**
 * Initializes and exports an S3 client instance configured for the application's storage needs.
 *
 * @remarks
 * This client is set up to interact with the S3-compatible storage at `https://storage.esportsapp.gg`.
 * Credentials and configuration are sourced from environment variables using Bun's environment API.
 *
 * @example
 * ```typescript
 * import { client } from './utils/s3';
 * // Use `client` to perform S3 operations
 * ```
 *
 * @see {@link https://bun.sh/docs/api/s3 S3Client Documentation}
 * For questions regarding the server itself, please contact Harry or Fabian.
 *
 * @constant
 */
export const client = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_KEY,
  region: "eu-west",
  bucket: "static",
  endpoint: "https://storage.esportsapp.gg",
}); 