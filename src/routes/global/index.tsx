import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import NavResources from "~/components/navs/NavResources";

export { useGetPolls, useGetDiscussions } from '~/shared/loaders';

export default component$(() => {
    return (
        <div>
            <NavResources />
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