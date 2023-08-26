import {
  createCookieSessionStorage,
} from "@remix-run/cloudflare";
import { nodeEnv, domain, sessionSecret } from '~/env.server'

type SessionData = {
  exist: true
};

type SessionFlashData = {
  error: string;
};

const sessionStorage =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      domain: nodeEnv === 'production' ? domain : undefined,
      httpOnly: nodeEnv === 'production',
      maxAge: nodeEnv === 'production' ? 60 * 60 * 24 : undefined,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: nodeEnv === 'production',
    },
  })

export default sessionStorage

const { getSession, commitSession, destroySession } = sessionStorage

export { getSession, commitSession, destroySession };