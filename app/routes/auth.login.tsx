import { ActionArgs, redirect } from "@remix-run/cloudflare"

import { authenticator } from "~/auth.server"

export let action = async ({ request }: ActionArgs) => {
  await authenticator.authenticate("auth0", request)

  return redirect("/")
}

export let loader = () => redirect("/")
