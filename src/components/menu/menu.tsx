/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuGlobe, LuGlobe2, LuHome, LuMapPin, LuPanelLeftClose, LuPanelLeftOpen } from '@qwikest/icons/lucide';
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
        { name: _`Global`, path: '/global/', icon: <LuGlobe class="w-6 h-6" /> },
        { name: _`International`, path: '/international/', icon: <><LuGlobe2 class="w-6 h-6" /></>, disabled: true },
        { name: _`National`, path: '/national/', icon: <LuMapPin class="w-6 h-6" />, disabled: true },
    ];

    const isOpenMenu = useSignal(true)
    const toggleMenu = $(() => {
        isOpenMenu.value = !isOpenMenu.value;
    })

    const adminDivisionName = countries.find(c => c?.cca2 === country.value?.cca2)?.adminDivisionName;

    return (
        <nav class={`bg-white overflow-y-auto flex-shrink-0 shadow-lg transition-all duration-300 ease-in-out ${isOpenMenu.value ? 'w-64' : 'w-24'}`}>
            <ul class='m-2 pl-0'>
                {!isOpenMenu.value && <li
                    class="text-lg text-gray-500 rounded-lg flex justify-between gap-2 items-center"
                >
                    <button
                        class={cn(
                            "p-2 flex items-center gap-2 text-slate-500 hover:bg-gray-100 rounded-lg w-full",
                            isOpenMenu.value ? 'justify-start' : 'justify-center',
                        )}
                        onClick$={toggleMenu}
                    >
                        <LuPanelLeftOpen class="w-6 h-6" />
                    </button>
                </li>}
                <li class="text-lg text-gray-500 rounded-lg flex justify-between gap-2 items-center">
                    <Link href="/" class={cn(
                        "p-2 flex items-center gap-2 text-slate-500 hover:bg-gray-100 rounded-lg w-full",
                        url.pathname === '/' ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                        isOpenMenu.value ? 'justify-start' : 'justify-center',
                    )}>
                        <span><LuHome class="w-6 h-6"/></span>
                        <span class={`transition-opacity duration-200 ${isOpenMenu.value ? 'opacity-100' : 'opacity-0 hidden'}`}>{_`Home`}</span>
                    </Link>
                    {isOpenMenu.value && <button class="pl-4 hover:text-slate-700" onClick$={toggleMenu} >
                        <LuPanelLeftClose class="w-6 h-6" />
                    </button>}
                </li>
            </ul>
            <Separator orientation="horizontal" class="separator-top my-2" />
            {isOpenMenu.value && <h3 class='m-2 text-lg text-gray-700 font-bold'>
                {_`Communities`}
            </h3>}
            <ul class='m-2 pl-0'>
                {geography.map(item => !item.disabled && (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center text-center',
                            url.pathname.startsWith(item.path) ? 'bg-gray-300 font-extrabold text-primary-700' : '',
                        )}
                    >
                        <Link
                            href={item.path}
                            class={cn(
                                "p-2 flex items-center gap-2 text-slate-500 hover:bg-gray-100 rounded-lg w-full",
                                isOpenMenu.value ? 'justify-start' : 'justify-center',
                            )}
                        >
                            <span>{item.icon}</span>
                            <span class={`ml-4 transition-opacity duration-200 ${isOpenMenu.value ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.name}</span>
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
