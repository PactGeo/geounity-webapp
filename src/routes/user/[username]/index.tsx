import { component$, useContext, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuExternalLink, LuImageOff, LuUser2 } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import FormEditUser from "~/components/forms/FormEditUser";
import Modal from "~/components/modal/modal";
import { Avatar, Button, Tabs } from "~/components/ui";
import { UserContext } from "~/contexts/UserContext";
import { useGetUserByUsername } from "~/shared/loaders";

export { useGetUserByUsername, useUserFormLoader } from '~/shared/loaders';
export { useUserFormAction } from '~/shared/actions';

export default component$(() => {
    const user = useContext(UserContext);
    const userPage = useGetUserByUsername();
    const username = useLocation().params.username;

    const isOpenModalEditUser = useSignal(false)

    return (
        <main class="w-full">
            <div class="relative w-full">
                {userPage.value.banner
                    ? (
                        <img
                            src={userPage.value.banner}
                            alt="Profile banner"
                            class="w-full h-48 object-cover"
                        />
                    )
                    : <div class="w-full h-48 object-cover flex justify-center items-center text-5xl bg-gray-200"><LuImageOff /></div>
                }
                <Avatar.Root class="absolute bottom-0 left-10 transform translate-y-1/2 w-24 h-24 border-4 border-white">
                    {userPage.value.image
                        ? <Avatar.Image src={userPage.value.image} alt={`Imagen de ${username}`} />
                        : <LuUser2 class="w-10 h-10" />
                    }
                    <Avatar.Fallback><LuUser2 class="w-10 h-10" /></Avatar.Fallback>
                </Avatar.Root>
            </div>
            <div class="max-w-3xl mx-auto px-4 mt-16">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold">{userPage.value.name}</h1>
                        <p class="text-gray-500">@{userPage.value.username}</p>
                    </div>
                    {userPage.value.username === user.username ? (
                        <Button look="outline" onClick$={() => isOpenModalEditUser.value = !isOpenModalEditUser.value}>{_`Edit profile`}</Button>
                    )
                    : (
                        <Button look="primary">{_`Follow`}</Button>
                    )}
                </div>
                {userPage.value.bio && <p class="mt-4">{userPage.value.bio}</p>}
                <div class="mt-4 flex space-x-4 text-gray-500">
                    {userPage.value.location && <span>🌍 {userPage.value.location}</span>}
                    {userPage.value.website && <span class="flex flex-nowrap items-center gap-1">🔗 <a href={userPage.value.website}>{userPage.value.website}</a><LuExternalLink class="h-3 w-3" /></span>}
                </div>
                <div class="mt-4 flex space-x-4">
                    <span><strong>{userPage.value.following_count}</strong> {_`Following`}</span>
                    <span><strong>{userPage.value.followers_count}</strong> {_`Followers`}</span>
                </div>
            </div>
            <section class="max-w-3xl mx-auto px-4 mt-16">
                <Tabs.Root class="w-full">
                    <Tabs.List class="grid w-full grid-cols-4">
                        <Tabs.Tab value="home">{_`Communities`}</Tabs.Tab>
                        <Tabs.Tab value="polls">{_`Polls`}</Tabs.Tab>
                        <Tabs.Tab value="debates">{_`Debates`}</Tabs.Tab>
                        <Tabs.Tab value="projects">{_`Projects`}</Tabs.Tab>
                    </Tabs.List>
                    {/* Panels para cada Tab */}
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">{_`Communities`}</h3>
                        <div class="space-y-6">
                            {/* Contenido de Home */}
                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">{_`Polls`}</h3>
                        <div class="space-y-6">
                            {/* Contenido de Polls */}
                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">{_`Debates`}</h3>
                        <ul class="space-y-4">
                            {/* Lista de debates */}
                        </ul>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">{_`Projects`}</h3>
                        <ul class="space-y-4">
                            {/* Lista de proyectos */}
                        </ul>
                    </Tabs.Panel>
                </Tabs.Root>
            </section>
            <Modal
                isOpen={isOpenModalEditUser}
                title={_`Edit profile`}
            >
                <FormEditUser />
            </Modal>
        </main>
    );
});
