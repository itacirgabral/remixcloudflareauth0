import { Authenticator } from "remix-auth"
import { Auth0Strategy } from "remix-auth-auth0"
import sessionStorage from '~/sessions.server'
import { Auht0CallbackURL, Auht0ClientID, Auht0ClientSecret, Auht0Domain } from '~/env.server'

const auth0Strategy = new Auth0Strategy({
  callbackURL: Auht0CallbackURL,
  clientID: Auht0ClientID,
  clientSecret: Auht0ClientSecret,
  domain: Auht0Domain
},
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const email = profile._json?.email ?? ''
    const verified = profile._json?.email_verified ?? false
    const auth0 = profile.id ?? ''

    return {
      email,
      verified,
      auth0,
    }
  }
)

interface AuthData {
  email: string;
  verified: boolean;
  auth0: string
}

const authenticator = new Authenticator<AuthData>(sessionStorage)

authenticator.use(auth0Strategy)

export {
  authenticator
}