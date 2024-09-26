import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetTags} from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";

export { useGetTags } from '~/shared/loaders';

export default component$(() => {
    const tags = useGetTags();
    return (
        <div>
            <NavResources />
            <h1>Issues</h1>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Issues",
    meta: [
        {
            name: "description",
            content: "Global Issues description",
        },
    ],
};