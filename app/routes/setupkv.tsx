import { LoaderArgs, redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/auth.server";
import type { Env } from '~/Env'

import { nodeEnv } from '~/env.server'

export async function loader ({ context, request }: LoaderArgs) {
  if (nodeEnv !== 'development') {
    return redirect("/")
  }

  const { auth0 = false, email = false, verified = false } = await authenticator.isAuthenticated(request) ?? {}
  if (!verified || !email || !auth0) {
    return redirect("/")
  }

  const env = context.env as Env
  await env.kv.put(`v1/user/${auth0}`, email)

  return redirect("/")
}