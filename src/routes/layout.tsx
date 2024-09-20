import { component$, Slot } from "@builder.io/qwik";
import { Link, type RequestHandler } from "@builder.io/qwik-city";
import Footer from "~/components/footer/footer";
import Header from "~/components/header/header";

import { useServerTimeLoader } from "~/shared/loaders";
export { useServerTimeLoader } from '~/shared/loaders';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const serverTime = useServerTimeLoader();
  const currentYear = new Date(serverTime.value.date).getFullYear();
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <Link href="/">Home</Link>
      <Link href="/debates">Debates</Link>
      <br />
      <br />
      <div class="flex flex-grow">
        <main>
          <Slot />
        </main>        
      </div>
      <Footer currentYear={currentYear} />
    </div>
  )
});
