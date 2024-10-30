import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { Avatar, Button, Tabs } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";

export const useGetUser = routeLoader$(async (req) => {
    const response = await fetch(`http://localhost:8000/users/${req.params.username}`, {
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    return await response.json();
});

export default component$(() => {
    const userData = useGetUser();
    const session = useSession();
    const username = useLocation().params.username;
    const isEditing = useSignal(false);
    const showModal = useSignal(false);

    const handleSave = () => {
        isEditing.value = false;
        showModal.value = true;
    };

    return (
        <main class="w-full max-w-3xl mx-auto">
            <div class="relative">
                <img
                    src="/placeholder.svg?height=200&width=800"
                    alt="Profile banner"
                    class="w-full h-48 object-cover"
                />
                <Avatar.Root class="absolute bottom-0 left-4 transform translate-y-1/2 w-24 h-24 border-4 border-white">
                    {userData.value?.image
                        ? <Avatar.Image src={userData.value?.image} alt={`Imagen de ${username}`} />
                        : <Avatar.Image src="https://placehold.co/600x400" alt="Image is missing" />
                    }
                    <Avatar.Fallback>UN</Avatar.Fallback>
                </Avatar.Root>
            </div>
            <div class="mt-16 px-4">
                <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-2xl font-bold">John Doe</h1>
                    <p class="text-gray-500">@johndoe</p>
                </div>
                <Button look="outline">Edit profile</Button>
                </div>
                <p class="mt-4">Web Developer. Passionate about creating intuitive and efficient user experiences.</p>
                <div class="mt-4 flex space-x-4 text-gray-500">
                <span>🌍 New York, USA</span>
                <span>🔗 johndoe.com</span>
                </div>
                <div class="mt-4 flex space-x-4 text-gray-500">
                <span>📅 Joined January 2020</span>
                </div>
                <div class="mt-4 flex space-x-4">
                <span><strong>1.5K</strong> Following</span>
                <span><strong>2.3K</strong> Followers</span>
                </div>
                <div class="mt-4">
                <h2 class="font-semibold">Communities</h2>
                <div class="mt-2 flex space-x-2">
                    <span class="bg-gray-200 rounded-full px-3 py-1 text-sm">Web Developers</span>
                    <span class="bg-gray-200 rounded-full px-3 py-1 text-sm">UI/UX Designers</span>
                </div>
                </div>
            </div>
            <section class="lg:w-2/3">
                <Tabs.Root class="w-full">
                    <Tabs.List class="grid w-full grid-cols-4">
                        <Tabs.Tab value="home">Home</Tabs.Tab>
                        <Tabs.Tab value="polls">Polls</Tabs.Tab>
                        <Tabs.Tab value="debates">Debates</Tabs.Tab>
                        <Tabs.Tab value="projects">Projects</Tabs.Tab>
                    </Tabs.List>
                    {/* Panels para cada Tab */}
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">Home</h3>
                        <div class="space-y-6">
                            {/* Contenido de Home */}
                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">Polls</h3>
                        <div class="space-y-6">
                            {/* Contenido de Polls */}
                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">Debates</h3>
                        <ul class="space-y-4">
                            {/* Lista de debates */}
                        </ul>
                    </Tabs.Panel>
                    <Tabs.Panel class="mt-6">
                        <h3 class="text-xl font-semibold mb-4">Projects</h3>
                        <ul class="space-y-4">
                            {/* Lista de proyectos */}
                        </ul>
                    </Tabs.Panel>
                </Tabs.Root>
            </section>
        </main>
    );
});
