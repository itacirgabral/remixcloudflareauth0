import { ActionArgs, redirect } from "@remix-run/cloudflare"

import { authenticator } from "~/auth.server"

import { Auth0LogoutUrl, Auht0ClientID, Auth0ReturnToUrl } from '~/env.server'

export const action = async ({ request }: ActionArgs) => {
  const logoutURL = new URL(Auth0LogoutUrl)
  logoutURL.searchParams.set("client_id", Auht0ClientID)
  logoutURL.searchParams.set("returnTo", Auth0ReturnToUrl)

  const redirectTo = logoutURL.toString()

  return authenticator.logout(request, { redirectTo })
}

export let loader = () => redirect("/")