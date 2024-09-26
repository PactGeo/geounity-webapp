import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuDatabase, LuHome, LuLandmark, LuMessageCircle, LuMessageSquare, LuUser } from "@qwikest/icons/lucide";
import { NavLink } from "~/components/nav-link/NavLink";


export default component$(() => {
    const loc = useLocation();
    const pathname = loc.url.pathname;
    const basePath = pathname.split('/').filter(Boolean)[0];
    const items = [
        { name: 'Overview', icon: <LuHome />, href: `/${basePath}/` },
        { name: 'Polls', icon: <LuDatabase />, href: `/${basePath}/polls/` },
        { name: 'Discussions', icon: <LuMessageSquare />, href: `/${basePath}/discussions/` },
        { name: 'Issues', icon: <LuMessageCircle />, href: `/${basePath}/issues/` },
        { name: 'Projects', icon: <LuLandmark />, href: `/${basePath}/projects/` },
        { name: 'People', icon: <LuUser />, href: `/${basePath}/people/` },
    ];
    return (
        <nav class="px-4 bg-slate-200 border-b border-slate-300">
            <ul class="flex items-center space-x-4">
                {items.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            class="flex items-center py-3 px-1"
                            activeClass="font-bold border-b-2 border-black"
                            href={item.href}
                        >
                            {item.icon}&nbsp;{item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
});