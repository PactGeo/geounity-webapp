import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import PostgresAdapter from "@auth/pg-adapter"
import pkg from "pg"

const { Pool } = pkg;

const pool = new Pool({
  host: import.meta.env.PUBLIC_DATABASE_HOST,
  user: import.meta.env.PUBLIC_DATABASE_USER,
  password: import.meta.env.PUBLIC_DATABASE_PASSWORD,
  database: import.meta.env.PUBLIC_DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

console.log('host', import.meta.env.PUBLIC_DATABASE_HOST)
console.log('user', import.meta.env.PUBLIC_DATABASE_USER)
console.log('password', import.meta.env.PUBLIC_DATABASE_PASSWORD)
console.log('database', import.meta.env.PUBLIC_DATABASE_NAME)

console.log('pool',  pool)

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub],
    adapter: PostgresAdapter(pool),
    callbacks: {
      async session(obj) {
        // console.log('obj', obj)
        return obj.session
      },
      async signIn(obj) {
        // console.log('obj', obj)
        return true
      }
    }
  }),
);
