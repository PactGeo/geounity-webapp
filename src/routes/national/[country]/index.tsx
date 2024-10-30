import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuBuilding, LuGlobe2, LuMap, LuMapPin, LuUsers } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import NavResources from "~/components/navs/NavResources";
import { useGetCountry } from "~/shared/loaders";

export { useGetCountry } from '~/shared/loaders';

export default component$(() => {
    const loc = useLocation();
    const country = loc.params.country
    const country2 = useGetCountry();

    const stats = {
        polls: 3,
        discussions: 5,
        issues: 2,
        projects: 2
    }
    return (
        <div>
            <NavResources />
            <main>
                <div class="grid gap-6 p-6">
                    <div class="grid gap-4">
                        <div class="flex items-center gap-4">
                            <span class="text-4xl">{country2.value.flag}</span>
                            <h1 class="text-3xl font-bold">{country2.value.name}</h1>
                        </div>
                        <div class="grid gap-6 md:grid-cols-2">
                            <div>
                                <div class="p-6">
                                    <h2 class="text-xl font-semibold mb-4">{_`Country Information`}</h2>
                                    <div class="grid gap-4">
                                        <div class="flex items-center gap-2">
                                            <LuGlobe2 class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Native Name:`}</span> {country2.value.native_name}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuBuilding class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Capital:`}</span> {country2.value.capital}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuMap class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Area:`}</span> {country2.value.area} km²
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuUsers class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Population:`}</span> {country2.value.population}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuMapPin class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Bordering Countries:`}</span> {country2.value.borders}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="p-6">
                                    <h2 class="text-xl font-semibold mb-4">Platform Statistics</h2>
                                    <div class="grid gap-4">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">Polls</span>
                                            <span class="text-lg">{stats.polls}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">Discussions</span>
                                            <span class="text-lg">{stats.discussions}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">Issues</span>
                                            <span class="text-lg">{stats.issues}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">Projects</span>
                                            <span class="text-lg">{stats.projects}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="md:col-span-2">
                                <div class="p-6 flex justify-center">
                                    <img
                                        src={country2.value.coat_of_arms_svg}
                                        alt="Coat of Arms of Albania"
                                        class="h-48 w-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Discussions",
    meta: [
        {
            name: "description",
            content: "Global Discussions description",
        },
    ],
};