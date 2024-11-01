import { component$ } from '@builder.io/qwik';

export default component$(() => {
    // `import.meta.env.PUBLIC_*` variables can be read anywhere, including browser
    return <div>PUBLIC_API_URL: {import.meta.env.PUBLIC_API_URL}</div>
})