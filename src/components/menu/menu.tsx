/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { $, component$, useContext, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import styles from './menu.css?inline';
import { LuFlag, LuGlobe, LuGlobe2, LuMapPin, LuPanelLeftClose, LuPanelLeftOpen } from '@qwikest/icons/lucide';
import { cn } from '@qwik-ui/utils';
import { Separator } from '~/components/ui';
import { _ } from 'compiled-i18n';
import { useGetCountry } from '~/shared/loaders';
import { dataArray as countries } from "~/data/countries";
import { MenuContext } from '~/contexts/MenuContext';

interface MenuProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default component$<MenuProps>(() => {
    useStyles$(styles);
    const country = useGetCountry();
    const { url } = useLocation();

    const geography = [
        { name: _`International`, path: '/international/', icon: <><LuGlobe class="w-6 h-6" /></> },
        { name: _`Nationals`, path: '/national/', icon: <LuFlag class="w-6 h-6" /> },
    ];

    const isOpenMenu = useContext(MenuContext);
    const toggleMenu = $(() => {
        isOpenMenu.value = !isOpenMenu.value;
    });

    const adminDivisionName = countries.find(c => c?.cca2 === country.value?.cca2)?.adminDivisionName;

    return (
        <nav class={`bg-white overflow-y-auto flex-shrink-0 shadow-lg transition-all duration-300 ease-in-out ${isOpenMenu.value ? 'w-64' : 'w-0 md:w-24'}`}>
            <ul class='m-2 pl-0'>
                {!isOpenMenu.value && <li
                    class="hidden text-lg text-gray-500 rounded-lg md:flex justify-between gap-2 items-center"
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
                {!isOpenMenu.value && <Separator orientation="horizontal" class="separator-top my-2" />}
                <li class="text-lg text-gray-500 rounded-lg flex justify-between gap-2 items-center">
                    <Link href="/global" class={cn(
                        "p-2 flex items-center gap-2 text-slate-500 hover:bg-gray-100 rounded-lg w-full",
                        url.pathname.startsWith('/global') ? 'bg-gray-300 font-extrabold text-primary-700' : '', // Modificado para incluir subrutas
                        isOpenMenu.value ? 'justify-start' : 'justify-center',
                    )}>
                        <span><LuGlobe2 class="w-6 h-6" /></span>
                        <span class={`transition-opacity duration-200 ${isOpenMenu.value ? 'opacity-100' : 'opacity-0 hidden'}`}>{_`Global`}</span>
                    </Link>
                    {isOpenMenu.value && <button class="pl-4 hover:text-slate-700" onClick$={toggleMenu}>
                        <LuPanelLeftClose class="w-6 h-6" />
                    </button>}
                </li>
            </ul>
            <Separator orientation="horizontal" class="separator-top my-2" />
            {isOpenMenu.value && <h3 class='m-2 text-lg text-gray-700 font-bold'>
                {_`Communities`}
            </h3>}
            <ul class='m-2 pl-0'>
                {geography.map(item => (
                    <li
                        key={item.path}
                        class={cn(
                            'p-2 text-lg text-gray-700 hover:bg-gray-100 rounded-lg flex gap-2 items-center text-center',
                            url.pathname.startsWith(item.path) ? 'bg-gray-300 font-extrabold text-primary-700' : '', // Modificado para incluir subrutas
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
                                url.pathname.startsWith(`/national/${country.value.name}/${adminDivisionName}`) ? 'bg-gray-300 font-extrabold text-primary-700' : '',
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
