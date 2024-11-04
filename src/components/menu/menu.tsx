/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuGlobe2, LuHome, LuMapPin } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Separator } from '~/components/ui';
import { _ } from 'compiled-i18n';
import { useGetCountry } from '~/shared/loaders';
import {dataArray as countries} from "~/data/countries";

interface MenuProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default component$<MenuProps>(() => {
    useStyles$(styles);
    const country = useGetCountry();
    const { url } = useLocation();

    const geography = [
        { name: _`Global`, path: '/global/', icon: <>🌐</> },
        { name: _`International`, path: '/international/', icon: <><LuGlobe2 /></> },
        { name: _`National`, path: '/national/', icon: <LuMapPin /> },
    ];

    const adminDivisionName = countries.find(c => c?.cca2 === country.value?.cca2)?.adminDivisionName;

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
                {country?.value?.id && (
                    <>
                        <li
                            class={cn(
                                'ml-4 p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                                url.pathname.startsWith('/national/') ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                            )}
                        >
                            <Link href={`/national/${country.value.name}/`} class="flex gap-2 items-center text-slate-500 rounded-lg">
                                <span>{country.value.flag}</span>
                                <span>{country.value.name}</span>
                            </Link>
                        </li>
                        <li
                            class={cn(
                                'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center',
                                url.pathname.startsWith('') ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                            )}
                        >
                            <Link href={`/national/${country.value.name}/${adminDivisionName}`} class="flex gap-2 items-center text-slate-500 rounded-lg">
                                <span><LuMapPin /></span>
                                <span>{adminDivisionName}</span>
                            </Link>
                        </li>
                        
                    </>
                )}
            </ul>
        </nav>
    );
});
