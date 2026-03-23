const encoder = new TextEncoder();
const sessionPayload = "subsvault-authenticated-v1";

function bytesToHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  const leftLength = left.length;
  const rightLength = right.length;
  const maxLength = Math.max(leftLength, rightLength);
  let mismatch = leftLength === rightLength ? 0 : 1;

  for (let index = 0; index < maxLength; index += 1) {
    const leftCode = index < leftLength ? left.charCodeAt(index) : 0;
    const rightCode = index < rightLength ? right.charCodeAt(index) : 0;
    mismatch |= leftCode ^ rightCode;
  }

  return mismatch === 0;
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );
}

async function signPayload(payload: string, secret: string) {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return bytesToHex(new Uint8Array(signature));
}

export async function createSessionToken(secret: string) {
  const signature = await signPayload(sessionPayload, secret);
  return `${sessionPayload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined, secret: string) {
  if (!token) {
    return false;
  }

  const [payload, providedSignature] = token.split(".");

  if (!payload || !providedSignature) {
    return false;
  }

  const expectedSignature = await signPayload(payload, secret);
  return payload === sessionPayload && constantTimeEqual(providedSignature, expectedSignature);
}

export function verifyPassword(input: string, expected: string) {
  return constantTimeEqual(input, expected);
}

export function normalizeRedirectPath(input: string | null | undefined) {
  if (!input || !input.startsWith("/")) {
    return "/";
  }

  if (input.startsWith("//") || input.startsWith("/auth/")) {
    return "/";
  }

  return input;
}
