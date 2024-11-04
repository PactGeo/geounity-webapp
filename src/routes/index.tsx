import { component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/Hero";
import { LocaleSelector } from "~/components/locale-selector";
import { _ } from "compiled-i18n";
import { UserContext } from "~/contexts/UserContext";

export default component$(() => {
  const user = useContext(UserContext);
  return (
    <div>
      {!user.isAuthenticated
        ? (
          <div class="w-full">
            <Hero />
          </div>
        ) 
        : (
          <div class="w-full">
            <h2>{_`Welcome ${user.name}`} 👋</h2>
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
