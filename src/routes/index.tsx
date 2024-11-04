import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/Hero";
import { useSession } from "./plugin@auth";
import { LocaleSelector } from "~/components/locale-selector";
import { _ } from "compiled-i18n";

export default component$(() => {
  const session = useSession();
  const name = 'John'
  const emoji = '👋'
  const greeting = _`Hello ${name} ${emoji}!`
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
            <h2>Bienvenido {session.value.user.name}</h2>
            <h3>{_`Hola Mundo`}</h3>
            <p>{greeting}</p>
            <h3>{_`Hola Mundo dos`}</h3>
            <LocaleSelector />
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
