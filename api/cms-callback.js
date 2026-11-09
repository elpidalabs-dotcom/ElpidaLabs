import {
  settings,
  verifyState,
  completeOAuth,
  messagePage,
  clearCookie,
  protect,
} from "../lib/cms-oauth.mjs";
export default async function handler(req, res) {
  protect(res);
  res.setHeader("Set-Cookie", clearCookie);
  if (req.method !== "GET") return res.status(405).send("Method not allowed.");
  try {
    const config = settings();
    const { state, code, error } = req.query || {};
    if (error || typeof code !== "string" || code.length > 500)
      throw new Error("GitHub sign-in was cancelled or expired.");
    const verifier = verifyState(req.headers.cookie, state, config.stateSecret);
    const token = await completeOAuth(code, verifier, config);
    const page = messagePage(token);
    res.setHeader("Content-Security-Policy", page.csp);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(page.html);
  } catch {
    // Never log OAuth codes, access tokens, cookies, or GitHub responses.
    return res
      .status(403)
      .send(
        "Sign-in could not be completed. Use an approved GitHub account with repository write access and start again from the content editor.",
      );
  }
}
