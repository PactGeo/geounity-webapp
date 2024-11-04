import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuBuilding, LuGlobe2, LuMap, LuMapPin, LuUsers } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import NavResources from "~/components/navs/NavResources";
import { useGetCountry } from "~/shared/loaders";

export default component$(() => {
    const loc = useLocation();
    const countryParams = loc.params.country
    const country = useGetCountry();

    // TODO: Implement the following logic
    const stats = {
        polls: 0,
        discussions: 0,
        issues: 0,
        projects: 0
    }
    return (
        <div>
            <NavResources />
            <main>
                <div class="grid gap-6 p-6">
                    <div class="grid gap-4">
                        <div class="flex items-center gap-4">
                            <span class="text-4xl">{country.value.flag}</span>
                            <h1 class="text-3xl font-bold">{country.value.name}</h1>
                        </div>
                        <div class="grid gap-6 md:grid-cols-2">
                            <div>
                                <div class="p-6">
                                    <h2 class="text-xl font-semibold mb-4">{_`Country Information`}</h2>
                                    <div class="grid gap-4">
                                        <div class="flex items-center gap-2">
                                            <LuGlobe2 class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Native Name:`}</span> {country.value.native_name}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuBuilding class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Capital:`}</span> {country.value.capital}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuMap class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Area:`}</span> {country.value.area} km²
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuUsers class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Population:`}</span> {country.value.population}
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <LuMapPin class="w-5 h-5 text-muted-foreground" />
                                            <span class="font-medium">{_`Bordering Countries:`}</span> {country.value.borders}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="p-6">
                                    <h2 class="text-xl font-semibold mb-4">{_`Platform Statistics`}</h2>
                                    <div class="grid gap-4">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">{_`Polls`}</span>
                                            <span class="text-lg">{stats.polls}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">{_`Discussions`}</span>
                                            <span class="text-lg">{stats.discussions}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">{_`Issues`}</span>
                                            <span class="text-lg">{stats.issues}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium">{_`Projects`}</span>
                                            <span class="text-lg">{stats.projects}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="md:col-span-2">
                                <div class="p-6 flex justify-center">
                                    <img
                                        src={country.value.coat_of_arms_svg}
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