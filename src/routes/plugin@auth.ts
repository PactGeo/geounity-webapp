import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Google from "@auth/qwik/providers/google";
import type { Session } from "@auth/qwik";
// import PostgresAdapter from "@auth/pg-adapter"
// import pkg from "pg"

// const { Pool } = pkg;

// const pool = new Pool({
//   host: import.meta.env.PUBLIC_DATABASE_HOST,
//   user: import.meta.env.PUBLIC_DATABASE_USER,
//   password: import.meta.env.PUBLIC_DATABASE_PASSWORD,
//   database: import.meta.env.PUBLIC_DATABASE_NAME,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// })

// console.log('host', import.meta.env.PUBLIC_DATABASE_HOST)
// console.log('user', import.meta.env.PUBLIC_DATABASE_USER)
// console.log('password', import.meta.env.PUBLIC_DATABASE_PASSWORD)
// console.log('database', import.meta.env.PUBLIC_DATABASE_NAME)

// console.log('pool',  pool)

interface CustomSession extends Session {
  accessToken?: string
}

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub, Google],
    // adapter: PostgresAdapter(pool),
    callbacks: {
      jwt: async ({ token, trigger, session, account }) => {
        console.log('======= callback jwt =======')
        console.log('token', token)
        console.log('trigger', trigger)
        console.log('session', session)
        console.log('account', account)
        // if (trigger === "update") token.name = session.user.name
        if (account?.provider === "github") {
          console.log('Obteniendo token de GitHub');
          try {
            const githubResponse = await fetch('http://localhost:8000/auth/github', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${account.access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('githubResponse', githubResponse)
            if (!githubResponse.ok) {
              console.error('Error al obtener el token de GitHub');
              return token;
            }
            
            const githubData = await githubResponse.json();
            console.log('Respuesta de GitHub:', githubData);
            
            // Asumiendo que el backend devuelve un nuevo token en la respuesta
            if (githubData.access_token) {
              return { ...token, accessToken: githubData.access_token };
            }
          } catch (error) {
            console.error('Error al hacer la petición a GitHub:', error);
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
      // async jwt({ token, user, account, trigger }) {
      //   console.log('callback JWT')
      //   console.log('trigger', trigger)
      //   console.log('token', token)
      //   console.log('user', user)
      //   console.log('account', account)
      //   if (trigger === 'signIn') {
      //     const response = await fetch('http://localhost:8000/auth/token', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         provider: account?.provider,
      //         providerAccountId: account?.providerAccountId,
      //         email: user.email,
      //         name: user.name,
      //       }),
      //     });
      //     if (!response.ok) {
      //       console.error('Error al obtener el token del backend');
      //       return false;
      //     }
      //     const data = await response.json();
      //     console.log('data3', data)
      //     return { ...token, accessToken: data.access_token }
      //   }
      //   return { ...token, accessToken3: 'hey' }
      // },
      // session: ({ session, token }): CustomSession => {
      //   console.log('callback session2')
      //   console.log('session', session)
      //   if(session && typeof token.accessToken === 'string'){
      //     (session as CustomSession).accessToken = token.accessToken
      //   }
      //   return session
      // },
      // async signIn(obj) {
        // console.log('signIn', obj)
        // const { user, account } = obj
        // // Enviar solicitud al backend para generar el token JWT
        // try {
        //   console.log('111')
        //   const response = await fetch('http://localhost:8000/auth/token', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       provider: account?.provider,
        //       providerAccountId: account?.providerAccountId,
        //       email: user.email,
        //       name: user.name,
        //     }),
        //   });
        //   console.log('response', response)

        //   if (!response.ok) {
        //     console.error('Error al obtener el token del backend');
        //     return false;
        //   }

        //   const data = await response.json();
        //   console.log('data -0-0-0-0--', data)
        //   const token = data.access_token;

        //   // Guardar el token en la sesión para acceder a él desde el frontend
        //   user.accessToken = token;
        //   console.log('user1', user)

        //   return true;
        // } catch (error) {
        //   console.error('Error en signIn callback:', error);
        //   return false;
        // }
      // },
    },
    // events: {
    //   createUser: message => {
    //     console.log('createUser', message)
    //   },
    //   signIn: message => {
    //     console.log('signIn', message)
    //   },
    //   signOut: message => {
    //     console.log('signOut', message)
    //   },
    //   updateUser: message => {
    //     console.log('updateUser', message)
    //   },
    //   session: message => {
    //     console.log('session', message)
    //   },
    //   linkAccount: message => {
    //     console.log('linkAccount', message)
    //   }
    // },
    // logger: {
    //   error(code, ...message) {
    //     console.log('error')
    //     console.log('code', code)
    //     console.log('message', message)
    //   },
    //   warn(code, ...message) {
    //     console.log('warn')
    //     console.log('code', code)
    //     console.log('message', message)
    //   },
    //   debug(code, ...message) {
    //     console.log('debug')
    //     console.log('code', code)
    //     console.log('message', message)
    //   }
    // }
  }),
);
