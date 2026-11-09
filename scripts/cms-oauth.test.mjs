import test from "node:test";
import assert from "node:assert/strict";
import {
  beginOAuth,
  verifyState,
  completeOAuth,
  messagePage,
  settings,
  ORIGIN,
} from "../lib/cms-oauth.mjs";
import auth from "../api/cms-auth.js";
import callback from "../api/cms-callback.js";
const config = {
  id: "fixture-client",
  secret: "fixture-secret",
  stateSecret: "synthetic-test-signing-secret-32-characters",
  allowed: ["approved-fixture"],
};
test("OAuth state is signed, bound to a cookie, expiring and PKCE protected", () => {
  const { url, cookie } = beginOAuth(config, 1000000),
    parsed = new URL(url),
    state = parsed.searchParams.get("state");
  const verifier = verifyState(cookie, state, config.stateSecret, 1000500);
  assert.equal(verifier.length, 43);
  assert.equal(parsed.searchParams.get("code_challenge_method"), "S256");
  assert.equal(
    parsed.searchParams.get("redirect_uri"),
    ORIGIN + "/api/cms-callback",
  );
  assert.match(cookie, /HttpOnly; Secure; SameSite=Lax/);
  assert.throws(() =>
    verifyState(cookie, "wrong", config.stateSecret, 1000500),
  );
  assert.throws(() => verifyState(cookie, state, "wrong-signing-key", 1000500));
  assert.throws(() => verifyState(cookie, state, config.stateSecret, 1600001));
  assert.throws(() => verifyState("", state, config.stateSecret));
});
test("OAuth refuses accounts outside the allowlist and non-writers", async () => {
  const mock = (login, push) => async (url) => ({
    ok: true,
    json: async () =>
      url.includes("access_token")
        ? { access_token: "synthetic-token", token_type: "bearer" }
        : url.endsWith("/user")
          ? { login }
          : { permissions: { push } },
  });
  assert.equal(
    await completeOAuth(
      "code",
      "verifier",
      config,
      mock("approved-fixture", true),
    ),
    "synthetic-token",
  );
  await assert.rejects(
    completeOAuth("code", "verifier", config, mock("unapproved-fixture", true)),
  );
  await assert.rejects(
    completeOAuth("code", "verifier", config, mock("approved-fixture", false)),
  );
});
test("callback messages restrict origin and source and escape token data", () => {
  const page = messagePage("synthetic</script>token");
  assert.ok(page.html.includes('event.origin!=="https://elpidalabs.xyz"'));
  assert.ok(page.html.includes("event.source!==window.opener"));
  assert.ok(!page.html.includes("synthetic</script>"));
  assert.ok(page.csp.includes("frame-ancestors 'none'"));
  assert.ok(!page.html.includes("postMessage('*'"));
});
test("unconfigured auth and invalid callbacks fail closed without echoing credentials", async () => {
  assert.throws(() => settings({}));
  const makeRes = () => ({
    headers: {},
    statusCode: 0,
    body: "",
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
    redirect() {
      throw Error("unexpected redirect");
    },
  });
  const response = makeRes();
  await callback(
    {
      method: "GET",
      query: { code: "synthetic-sensitive-code", state: "bad" },
      headers: {},
    },
    response,
  );
  assert.equal(response.statusCode, 403);
  assert.ok(!response.body.includes("synthetic-sensitive-code"));
  assert.equal(response.headers["Cache-Control"], "no-store");
  const invalid = makeRes();
  auth({ method: "POST" }, invalid);
  assert.equal(invalid.statusCode, 405);
});
