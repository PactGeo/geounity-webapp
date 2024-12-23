import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Google from "@auth/qwik/providers/google";
import type { Session } from "@auth/qwik";

interface CustomSession extends Session {
  accessToken?: string
}

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub, Google],
    callbacks: {
      jwt: async ({ token, trigger, session, account }) => {
        console.log('== jwt ==')
        console.log('session', session)
        console.log('trigger', trigger)
        console.log('token', token)
        console.log('account', account)
        // if (trigger === "update") token.name = session.user.name
        if (account?.provider === "github" || account?.provider === "google") {
          try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/${account.provider}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${account.access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('response', response)
            if (!response.ok) {
              return token;
            }
            
            const data = await response.json();
            console.log('data', data)
            
            if (data.access_token) {
              return { ...token, accessToken: data.access_token };
            }
          } catch (error) {
            console.error(`Error making request to ${account.provider}: `, error);
          }
          return { ...token, accessToken: account.access_token }
        }
        return token
      },
      session: async (objSession) => {
        console.log('== session ==')
        console.log('objSession', objSession)
        const { session, token } = objSession
        if (token.accessToken && typeof token.accessToken === 'string') {
          (session as CustomSession).accessToken = token.accessToken
        }
        return session
      },
    },
    trustHost: true
  }),
);
