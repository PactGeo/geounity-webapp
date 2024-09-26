import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/Hero";
import { useSession } from "./plugin@auth";

export default component$(() => {
  const session = useSession();
  console.log('session.value', session.value)
  return (
    <div>
      {!session.value?.user
        ? (
          <div class="w-full">
            <Hero />
          </div>
        ) 
        : (
          <div class="w-full">
            <h2>Bienvenido {session.value?.user.name}</h2>
          </div>
        )
      }
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Geounity",
  meta: [
    {
      name: "description",
      content: "Geounity",
    },
  ],
};
