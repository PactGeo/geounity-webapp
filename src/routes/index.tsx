import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/Hero";
import { useSession } from "./plugin@auth";
import { LocaleSelector } from "~/components/locale-selector";
import { _ } from "compiled-i18n";

export default component$(() => {
  const session = useSession();
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
            <h2>{_`Welcome ${session.value.user.name}`} 👋</h2>
            <LocaleSelector />
          </div>
        )
      }
    </div>
  );
});

export const head: DocumentHead = {
  title: _`Welcome to Geounity`,
  meta: [
    {
      name: "description",
      content: _`Geounity is a platform for building communities.`,
    },
  ],
};
