import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetTags } from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";

export { useGetTags } from '~/shared/loaders';

export default component$(() => {
    const tags = useGetTags();
    const selectedTag = useStore({ id: 0, name: 'all' });
    return (
        <div>
            <NavResources />
            <ListTags tags={tags.value} selectedTag={selectedTag}  />
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