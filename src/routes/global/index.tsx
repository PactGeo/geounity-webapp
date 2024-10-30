import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetDiscussions, useGetPolls, useGetTags } from "~/shared/loaders";
import NavResources from "~/components/navs/NavResources";
import ListPolls from "~/components/list/ListPolls";
import ListDebates from "~/components/list/ListDebates";

export { useGetPolls, useGetDiscussions } from '~/shared/loaders';

export default component$(() => {
    const polls = useGetPolls()
    const debates = useGetDiscussions();
    return (
        <div>
            <NavResources />
            <ListPolls polls={polls.value} type="GLOBAL" />
            <ListDebates debates={debates.value} type="GLOBAL" />
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