import { Request } from 'express';

/**
 * Extracts the token from the Authorization header of a request.
 *
 * @param request - The HTTP request object containing headers.
 * @returns The extracted token if the Authorization header is in the format 'Bearer <token>', otherwise undefined.
 */
export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

/**
 * Extracts the token from the body of a request.
 *
 * @param {Request} request - The request object containing the body.
 * @returns {string | undefined} The extracted token if it exists, otherwise undefined.
 */
export function extractTokenFromBody(request: Request): string | undefined {
  const { token } = request.body;
  return token ? token : undefined;
}

/**
 * Extracts the API key from the authorization header of a request.
 *
 * @param request - The incoming request object containing headers.
 * @returns The API key if the authorization header is of type 'Apikey', otherwise undefined.
 */
export function extractApiKeyFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Apikey' ? token : undefined;
}
