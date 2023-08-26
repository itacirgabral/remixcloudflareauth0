import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";

import type { Env } from '~/Env'
import mkid from "~/mkid.server";

export async function loader ({ context, request }: LoaderArgs) {
  const { auth0 = false, email = false, verified = false } = await authenticator.isAuthenticated(request) ?? {}
  if (!verified) {
    return redirect('/', { status: 401 })
  }
  if (!auth0) {
    return redirect('/', { status: 401 })
  }
  const env = context.env as Env
  const user = await env.kv.get(`v1/user/${auth0}`)
  if (user == null) {
    return redirect('/', { status: 401 })
  }

  return json({
    user
  })
}

export async function action ({ context, request }: ActionArgs) {
  const { auth0 = false, email = false, verified = false } = await authenticator.isAuthenticated(request) ?? {}
  if (!verified) {
    return redirect('/', { status: 401 })
  }
  if (!auth0) {
    return redirect('/', { status: 401 })
  }
  const env = context.env as Env
  const user = await env.kv.get(`v1/user/${auth0}`)
  if (user == null) {
    return redirect('/', { status: 401 })
  }

  const formData = await request.formData()
  const chave = await formData.get('chave')
  if (chave == null ) {
    return redirect('/', { status: 400 })
  }
  const dados = await formData.get('dados')
  if (dados == null ) {
    return redirect('/', { status: 400 })
  }

  if (typeof chave === 'string' && typeof dados === 'string') {
    const key = mkid()
    const value = JSON.stringify({ chave, dados })

    await env.kv.put(`v1/despacho/${key}`, value)
  
    return redirect('/list')
  }

  return redirect('/', { status: 400 })
}

export default function Add () {
  const { user } = useLoaderData<typeof loader>()
  return <main>
    <h1>{user}</h1>
    <Form method="post">
      <label htmlFor="chaveInput">chave</label>
      <input id="chaveInput" type="text" name="chave" />
      <br />
      <label htmlFor="dadosInput">dados</label>
      <input id="dadosInput" type="text" name="dados" />
      <br />
      <button type="submit">gravar</button>
    </Form>
  </main>
}