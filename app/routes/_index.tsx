import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/sessions.server";
import type { Env } from '~/Env'

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader ({ context, request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie")
  const session = await getSession(cookie)
  const existCookie = await session.get('exist')

  const authentication = await authenticator.isAuthenticated(request)
  const isAuthenticated = authentication != null
  const { auth0 = false, email = false, verified = false } = authentication ?? {}

  const env = context.env as Env
  let user = ''
  if (isAuthenticated && verified && auth0) {
    user = await env.kv.get(`v1/user/${auth0}`) ?? ''
  }
  const headers = new Headers()
  if (!existCookie) {
    const cookieValue = await commitSession(session)
    headers.set("Set-Cookie", cookieValue)
  }

  return json({
    isAuthenticated,
    auth0,
    email,
    verified,
    user
  }, {
    headers
  })
}

export default function Index() {
  const { auth0, email, isAuthenticated, verified, user } = useLoaderData<typeof loader>()

  return <main>
    <h1>{user}</h1>
    <nav>
      <ul>
        <li>
          <Form method="post" action="/auth/login">
            <button type="submit" disabled={isAuthenticated}>login</button>
          </Form>
        </li>
        <li>
          <Form method="post" action="/auth/logout">
            <button type="submit" disabled={!isAuthenticated}>logout</button>
          </Form>
        </li>
        <li>
          <Link to="/add">adicionar</Link>
        </li>
        <li>
          <Link to="/list">listar</Link>
        </li>
      </ul>
    </nav>
  </main>;
}
