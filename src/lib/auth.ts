export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  clientId?: string;
}

export function verifyAuth(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload as AuthUser;
  } catch {
    return null;
  }
}

export function createToken(user: Omit<AuthUser, "id"> & { id?: string }): string {
  const payload = {
    ...user,
    id: user.id || Math.random().toString(36).slice(2),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${encode(header)}.${encode(payload)}.${encode({ sig: "asronix-auth-" + payload.iat })}`;
}

export const ADMIN_CREDENTIALS = {
  email: "admin@asronixtech.com",
  password: "Asronix@2026",
};

export const STORAGE_KEY = "asronix_auth";
