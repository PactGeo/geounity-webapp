import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuDatabase, LuGlobe2, LuHome, LuLandmark, LuLogOut, LuMapPin, LuMessageCircle, LuMessageSquare, LuSettings, LuUser } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Separator } from '~/components/ui';
import { _ } from 'compiled-i18n';
import { useGetCountry } from '~/shared/loaders';

interface MenuProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default component$<MenuProps>((props) => {
    useStyles$(styles);
    const country2 = useGetCountry();
    const { url } = useLocation();

    const geography = [
        { name: _`Global`, path: '/global/', icon: <>🌐</> },
        { name: _`International`, path: '/international/', icon: <><LuGlobe2 /></> },
        { name: 'National'+`${country2.value.flag || ''}`, path: '/national/', icon: <LuMapPin /> },
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
                        <span>{_`Home`}</span>
                    </Link>
                </li>
            </ul>
            <Separator orientation="horizontal" class="separator-top my-2" />
            <h3 class='m-2 text-lg text-gray-700 font-bold'>
                {_`Communities`}
            </h3>
            <ul class='m-2 pl-0'>
                {geography.map(item => (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                            url.pathname.startsWith(item.path) ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                        )}
                    >
                        <Link href={item.path} class="flex gap-2 items-center text-slate-500 rounded-lg">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
                {country2.value.id && (
                    <li
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                            url.pathname.startsWith('/national/') ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                        )}
                    >
                        <Link href={`/national/${country2.value.id}/`} class="flex gap-2 items-center text-slate-500 rounded-lg">
                            <span>{country2.value.flag}</span>
                            <span>{country2.value.name}</span>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
});
