import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuDatabase, LuHome, LuLandmark, LuMessageCircle, LuMessageSquare, LuUser } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { NavLink } from "~/components/nav-link/NavLink";


export default component$(() => {
    const loc = useLocation();
    const pathname = loc.url.pathname;
    const country = loc.params.country;
    const segments = pathname.split('/').filter(Boolean);
    const isGlobal = segments[0] === 'global';
    const isInternational = segments[0] === 'international';
    const isNational = segments[0] === 'national';
    console.log('isNational', isNational)
    const basePath = pathname.split('/').filter(Boolean)[0];

    let items
    if (country) {
        items = [
            { name: _`Overview`, icon: <LuHome />, href: `/${basePath}/${country}`, },
            { name: _`Polls`, icon: <LuDatabase />, href: `/${basePath}/${country}/polls/` },
            { name: _`Discussions`, icon: <LuMessageSquare />, href: `/${basePath}/${country}/discussions/` },
            { name: _`Issues`, icon: <LuMessageCircle />, href: `/${basePath}/${country}/issues/`, hidden: isGlobal || isInternational },
            { name: _`Projects`, icon: <LuLandmark />, href: `/${basePath}/${country}/projects/`, hidden: isGlobal || isInternational },
            { name: _`People`, icon: <LuUser />, href: `/${basePath}/${country}/people/`, hidden: isGlobal || isInternational },
        ];
    } else {
        items = [
            { name: _`Overview`, icon: <LuHome />, href: `/${basePath}/` },
            { name: _`Polls`, icon: <LuDatabase />, href: `/${basePath}/polls/` },
            { name: _`Discussions`, icon: <LuMessageSquare />, href: `/${basePath}/discussions/` },
            { name: _`Issues`, icon: <LuMessageCircle />, href: `/${basePath}/issues/`, hidden: isGlobal || isInternational },
            { name: _`Projects`, icon: <LuLandmark />, href: `/${basePath}/projects/`, hidden: isGlobal || isInternational },
            { name: _`People`, icon: <LuUser />, href: `/${basePath}/people/`, hidden: isGlobal || isInternational },
        ];
    }

    return (
        <div class="sticky top-0 z-10"> {/* Ajusta según el tamaño de tu header */}
            <nav class="px-4 bg-slate-200 border-b border-slate-300">
                <ul class="flex items-center space-x-4">
                    {items.filter(item => !item.hidden).map((item) => (
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
        </div>
    );


});