import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import NavResources from "~/components/navs/NavResources";

export { useGetTags } from '~/shared/loaders';

export default component$(() => {
    return (
        <div>
            <NavResources />
            <h1>Projects</h1>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Projects",
    meta: [
        {
            name: "description",
            content: "Global Projects description",
        },
    ],
};