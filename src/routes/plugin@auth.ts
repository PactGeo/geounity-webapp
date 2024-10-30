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
        // if (trigger === "update") token.name = session.user.name
        if (account?.provider === "github" || account?.provider === "google") {
          console.log(`Fetching ${account.provider} token`);
          try {
            const response = await fetch(`http://localhost:8000/auth/${account.provider}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${account.access_token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log(`Account provider Response ${account.provider}`, response)
            
            if (!response.ok) {
              console.error(`Error to get the token from the provider ${account.provider}`);
              return token;
            }
            
            const data = await response.json();
            console.log(`Account provider data ${account.provider}`, response)
            
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
      session: async ({ session, token }) => {
        if (token?.accessToken && typeof token.accessToken === 'string') {
          (session as CustomSession).accessToken = token.accessToken
        }
        return session
      },
    },
  }),
);
