import { Request } from 'express';

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function extractTokenFromBody(request: Request): string | undefined {
  const { token } = request.body;
  return token ? token : undefined;
}

export function extractApiKeyFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Apikey' ? token : undefined;
}
