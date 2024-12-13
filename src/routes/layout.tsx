import { component$, Slot, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { type Cookie, type RequestHandler } from "@builder.io/qwik-city";
import Footer from "~/components/footer/footer";
import Header from "~/components/header/header";
import Menu from "~/components/menu/menu";

import { useServerTimeLoader, useUser } from "~/shared/loaders";
import { useSession } from "./plugin@auth";
export { useServerTimeLoader } from '~/shared/loaders';

import { guessLocale } from 'compiled-i18n'
import { UserContext, type UserType } from "~/contexts/UserContext";
import { MenuContext } from "~/contexts/MenuContext";

export { useGetCountry, useUser } from '~/shared/loaders';

function loadUserFromCookie(cookie: Cookie): string | null {
  const user = cookie.get('geounity.user');
  if (user) {
    return JSON.parse(user.value)
  } else {
    return null;
  }
}

export const onRequest: RequestHandler = async ({ cookie, query, headers, locale, sharedMap }) => {
  // Allow overriding locale with query param `locale`
  const maybeLocale = query.get('locale') || headers.get('accept-language')
  locale(guessLocale(maybeLocale))
  const user = loadUserFromCookie(cookie);
  if (user) {
    sharedMap.set('user', user);
  }
}
export const onGet: RequestHandler = async (requestEvent) => {
  const { cacheControl } = requestEvent;
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
  const session = useSession();
  const user = useUser()
  console.log('user0', user.value)
  const serverTime = useServerTimeLoader();
  const currentYear = new Date(serverTime.value.date).getFullYear();

  const userStore = useStore<UserType>({
    id: 0,
    name: session.value?.user?.name || '',
    email: session.value?.user?.email || '',
    image: session.value?.user?.image || '',
    username: user.value?.username || '',
    role: user.value?.role || '',
    bio: user.value?.bio || '',
    location: user.value?.location || '',
    website: user.value?.website || '',
    banner: user.value?.banner || '',
    language: user.value?.language || 'en',
    isAuthenticated: !!session.value?.user?.email,
  });
  const isOpenMenu = useSignal(true);

  useContextProvider(UserContext, userStore);
  useContextProvider(MenuContext, isOpenMenu);

  return (
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1 overflow-hidden">
        {!!session.value?.user?.email && <Menu />}
        <main class="flex-1 overflow-y-auto">
          <Slot />
        </main>
      </div>
      <Footer currentYear={currentYear} />
    </div>
  )
});
