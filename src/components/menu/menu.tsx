import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuDatabase, LuGlobe2, LuHome, LuLandmark, LuLogOut, LuMapPin, LuMessageCircle, LuMessageSquare, LuSettings, LuUser } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Separator } from '~/components/ui';

interface MenuProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default component$<MenuProps>((props) => {
    useStyles$(styles);
    const { url } = useLocation();

    const geography = [
        { name: 'Global', path: '/global/', icon: <>🌐</> },
        { name: 'International', path: '/international/', icon: <><LuGlobe2 /></> },
        { name: 'America', path: '/continents/america/', icon: <LuMapPin /> },
        { name: 'Argentina', path: '/countries/argentina/', icon: <LuMapPin /> },
        { name: 'Buenos Aires', path: '/countries/argentina/buenos-aires/', icon: <LuMapPin />, disabled: true },
        { name: 'Miramar', path: '/countries/argentina/buenos-aires/miramar/', icon: <LuMapPin />, disabled: true },
    ];

    const actions = [
        { name: 'Polls', path: '/polls', icon: <LuDatabase /> },
        { name: 'Issues', path: '/issues/', icon: <LuMessageCircle /> },
        { name: 'Debates', path: '/debates/', icon: <LuMessageSquare /> },
        { name: 'Projects and Fundraising', path: '/projects-fundraising/', icon: <LuLandmark /> },
    ];

    const otherOptions = [
        { name: 'Profile', path: '/profile/', icon: <LuUser /> },
        { name: 'Settings', path: '/settings/', icon: <LuSettings /> },
        { name: 'Logout', path: '/logout/', icon: <LuLogOut /> },
        { name: 'Messages', path: '/messages/', icon: <LuMessageCircle /> },
        { name: 'Notifications', path: '/notifications/', icon: <LuMessageSquare /> },
        { name: 'Location: Argentina', path: '/location/argentina/', icon: <LuMapPin /> },
    ];

    return (
        <nav class="w-64 bg-white overflow-y-auto flex-shrink-0 shadow-lg">
            <ul class='m-2 pl-0'>
                <li
                    class={cn(
                        'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                        url.pathname === '/' ? 'bg-gray-300 font-extrabold text-primary-700' : ''
                    )}
                >
                    <Link href="/" class="flex gap-2 items-center text-slate-500 rounded-lg">
                        <span><LuHome /></span>
                        <span>Home</span>
                    </Link>
                </li>
            </ul>
            <Separator orientation="horizontal" class="separator-top my-2" />
            <h3 class='m-2 text-lg text-gray-700 font-bold'>
                Communities
            </h3>
            <ul class='m-2 pl-0'>
                {geography.map(item => (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                            url.pathname.startsWith(item.path) ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                            item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                    >
                        {!item.disabled ? (
                            <Link href={item.path} class="flex gap-2 items-center text-slate-500 rounded-lg">
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ) : (
                            <div class="flex gap-2 items-center text-slate-500 rounded-lg opacity-50 cursor-not-allowed">
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {/* <Separator orientation="horizontal" class="separator-top my-2" />
            <ul class='m-2 pl-0'>
                {actions.map(item => (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                            url.pathname === item.path ? 'bg-gray-300 font-extrabold text-primary-700' : ''
                        )}
                    >
                        <Link href={item.path} class="flex gap-2 items-center text-slate-500 rounded-lg">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <Separator orientation="horizontal" class="separator-top my-2" />
            <ul class='m-2 pl-0'>
                {otherOptions.map(item => (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                            url.pathname === item.path ? 'bg-gray-300 font-extrabold text-primary-700' : ''
                        )}
                    >
                        <Link href={item.path} class="flex gap-2 items-center text-slate-500 rounded-lg">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul> */}
        </nav>
    );
});
