import { settings, beginOAuth, protect } from "../lib/cms-oauth.mjs";
export default function handler(req, res) {
  protect(res);
  if (req.method !== "GET") return res.status(405).send("Method not allowed.");
  try {
    const { url, cookie } = beginOAuth(settings());
    res.setHeader("Set-Cookie", cookie);
    return res.redirect(302, url);
  } catch {
    return res
      .status(503)
      .send(
        "Content studio sign-in is awaiting setup. The website administrator must configure the GitHub OAuth application in Vercel.",
      );
  }
}
