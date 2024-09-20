import { routeLoader$ } from "@builder.io/qwik-city";

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString(),
    };
});

export const useGetTags = routeLoader$(async () => {
    const response = await fetch('http://localhost:8000/tags', {
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    return (await response.json()) as Array<{
        id: string;
        name: string;
    }>;
});