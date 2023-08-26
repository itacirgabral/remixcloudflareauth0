import {  LoaderArgs } from "@remix-run/cloudflare"

import { authenticator } from "~/auth.server"

export let loader = ({ request }: LoaderArgs) => authenticator.authenticate("auth0", request, {
  successRedirect: "/",
  failureRedirect: "/",
})