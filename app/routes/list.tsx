import { LoaderArgs, json, redirect } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { Env } from "~/Env"
import { authenticator } from "~/auth.server"

export async function loader ({ context, request }: LoaderArgs) {
  const { auth0 = false, email = false, verified = false } = await authenticator.isAuthenticated(request) ?? {}
  if (!verified) {
    return redirect('/')
  }
  if (!auth0) {
    return redirect('/')
  }
  const env = context.env as Env
  const user = await env.kv.get(`v1/user/${auth0}`)
  if (user == null) {
    return redirect('/')
  }

  const itens = await env.kv.list({
    prefix: 'v1/despacho/',
  })

  const keynames = itens.keys.map(el => el.name)

  return json({
    keys: keynames
  })
}

export default function List () {
  const { keys } = useLoaderData<typeof loader>()
  return <ul>
    {
      keys.map((el, id) => <li key={id}>{el}</li>)
    }
  </ul>
}