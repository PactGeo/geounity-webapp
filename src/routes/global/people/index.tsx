import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Avatar } from "flowbite-qwik";
import NavResources from "~/components/navs/NavResources";

export { useGetTags } from '~/shared/loaders';

export default component$(() => {
    const people = useSignal(40)
    return (
        <div>
            <NavResources />
            <div class="mt-4 flex justify-center items-center">
                <Avatar
                    img="https://res.cloudinary.com/dkht4mwqi/image/upload/f_auto,q_auto/v1718462568/flowbite-qwik/on9fjbionkpt1fqhtbov.jpg"
                    rounded
                    stacked
                />
                <div class="ml-2">{`+ ${people.value} anonymous users`}</div>
            </div>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global People",
    meta: [
        {
            name: "description",
            content: "Global People description",
        },
    ],
};