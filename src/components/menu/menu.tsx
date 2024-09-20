import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuDatabase, LuFlag, LuGlobe, LuGlobe2, LuHome, LuLandmark, LuMap, LuMapPin, LuMessageCircle, LuMessageSquare, LuThumbsUp, LuX } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Button, Separator } from '~/components/ui';

interface MenuProps {
    class?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default component$<MenuProps>((props) => {
    useStyles$(styles);
    const { url } = useLocation();

    const geography = [
        { name: 'Home', path: '/', icon: <LuHome /> },
        { name: 'Global', path: '/global/', icon: <>🌐</> },
        { name: 'International', path: '/international/', icon: <><LuGlobe2 /></> },
        { name: 'America', path: '/continents/america/', icon: <LuMapPin /> },
        { name: 'Argentina', path: '/countries/argentina/', icon: <LuMapPin /> },
        { name: 'Buenos Aires', path: '/countries/argentina/buenos-aires/', icon: <LuMapPin />, disabled: true },
        { name: 'Miramar', path: '/countries/argentina/buenos-aires/miramar/', icon: <LuMapPin />, disabled: true },
    ];

    const actions = [
        { name: 'Polls and Data', path: '/polls-data/', icon: <LuDatabase /> },
        { name: 'Issues', path: '/issues/', icon: <LuMessageCircle /> },
        { name: 'Debates', path: '/debates/', icon: <LuMessageSquare /> },
        { name: 'Projects and Fundraising', path: '/projects-fundraising/', icon: <LuLandmark /> },
    ];

    return (
        <nav class={cn('bg-white w-64 shadow-lg h-full overflow-y-auto sticky top-20', props.class)}>
            <ul class='m-2 pl-0'>
            {geography.map(item => (
                <li
                    key={item.path}
                    class={cn(
                        'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                        url.pathname == item.path ? 'bg-gray-300 font-extrabold text-primary-700' : '',
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
            <Separator orientation="horizontal" class="separator-top my-2" />
            <h3 class='m-2 text-lg text-gray-700 font-bold'>
                Actions
            </h3>
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
        </nav>
    );
});
