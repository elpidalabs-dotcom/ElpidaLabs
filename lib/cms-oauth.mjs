import {
  createHmac,
  randomBytes,
  createHash,
  timingSafeEqual,
} from "node:crypto";

export const ORIGIN = "https://elpidalabs.xyz";
export const REPOSITORY = "elpidalabs-dotcom/ElpidaLabs";
const COOKIE = "__Host-elpida-cms-oauth";
export function settings(env = process.env) {
  if (
    !env.CMS_GITHUB_CLIENT_ID ||
    !env.CMS_GITHUB_CLIENT_SECRET ||
    !env.CMS_STATE_SECRET ||
    env.CMS_STATE_SECRET.length < 32
  )
    throw new Error("Content studio sign-in has not been configured.");
  return {
    id: env.CMS_GITHUB_CLIENT_ID,
    secret: env.CMS_GITHUB_CLIENT_SECRET,
    stateSecret: env.CMS_STATE_SECRET,
    allowed: (env.CMS_ALLOWED_USERS || "elpidalabs-dotcom,AbdulganiyuMalik01")
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean),
  };
}
const signature = (value, secret) =>
  createHmac("sha256", secret).update(value).digest("base64url");
export function beginOAuth(config, now = Date.now()) {
  const state = randomBytes(32).toString("base64url"),
    verifier = randomBytes(32).toString("base64url");
  const encoded = Buffer.from(
    JSON.stringify({ state, verifier, created: now }),
  ).toString("base64url");
  const url = new URL("https://github.com/login/oauth/authorize");
  for (const [key, value] of Object.entries({
    client_id: config.id,
    redirect_uri: ORIGIN + "/api/cms-callback",
    scope: "public_repo",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
  }))
    url.searchParams.set(key, value);
  return {
    url: url.href,
    cookie: `${COOKIE}=${encoded}.${signature(encoded, config.stateSecret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  };
}
export function verifyState(cookieHeader, state, secret, now = Date.now()) {
  const cookie = (cookieHeader || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(COOKIE + "="))
    ?.slice(COOKIE.length + 1);
  if (!cookie || typeof state !== "string" || state.length > 200)
    throw new Error(
      "Sign-in expired or could not be verified. Start again from the content editor.",
    );
  const [encoded, mac] = cookie.split(".");
  const expected = Buffer.from(signature(encoded, secret)),
    actual = Buffer.from(mac || "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new Error("Invalid sign-in state.");
  const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
  const age = now - data.created;
  if (data.state !== state || age < 0 || age > 600000 || !data.verifier)
    throw new Error("Sign-in expired or could not be verified.");
  return data.verifier;
}
export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
export function protect(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
}
export async function completeOAuth(code, verifier, config, fetcher = fetch) {
  const response = await fetcher(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: config.id,
        client_secret: config.secret,
        code,
        code_verifier: verifier,
        redirect_uri: ORIGIN + "/api/cms-callback",
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error("GitHub sign-in failed. Please try again.");
  const data = await response.json();
  if (!data.access_token || data.token_type !== "bearer")
    throw new Error("GitHub did not authorize the content editor.");
  const headers = {
    Authorization: "Bearer " + data.access_token,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ElpidaLabs-ContentStudio",
  };
  const userResponse = await fetcher("https://api.github.com/user", {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!userResponse.ok) throw new Error("Could not verify the GitHub account.");
  const user = await userResponse.json();
  if (!config.allowed.includes(String(user.login).toLowerCase()))
    throw new Error(
      "This GitHub account is not approved for the content studio.",
    );
  const repoResponse = await fetcher(
    "https://api.github.com/repos/" + REPOSITORY,
    { headers, signal: AbortSignal.timeout(15000) },
  );
  if (!repoResponse.ok || !(await repoResponse.json()).permissions?.push)
    throw new Error(
      "This GitHub account needs write access to the website repository.",
    );
  return data.access_token;
}
export function messagePage(token) {
  const nonce = randomBytes(20).toString("base64");
  const message = JSON.stringify(
    "authorization:github:success:" +
      JSON.stringify({ token, provider: "github" }),
  ).replace(/</g, "\\u003c");
  // Decap's popup handshake is restricted to this exact origin and opener.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="robots" content="noindex,nofollow"/><title>GitHub sign-in complete</title></head><body><p>Completing sign-in. You can close this window after the editor opens.</p><script nonce="${nonce}">if(window.opener){const receive=function(event){if(event.origin!==${JSON.stringify(ORIGIN)}||event.source!==window.opener)return;window.opener.postMessage(${message},${JSON.stringify(ORIGIN)});window.removeEventListener('message',receive);window.close();};window.addEventListener('message',receive);window.opener.postMessage('authorizing:github',${JSON.stringify(ORIGIN)});}</script></body></html>`;
  return {
    html,
    csp: `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
  };
}
