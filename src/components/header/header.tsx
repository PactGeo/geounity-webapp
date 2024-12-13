import { $, component$, useContext, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import { Button } from "~/components/ui";
import { Link } from "@builder.io/qwik-city";
import { LuBell, LuPanelLeftOpen } from "@qwikest/icons/lucide";
import Logo from '~/icons/logo.svg?jsx';
import styles from "./header.css?inline";

import { _ } from "compiled-i18n";
import { UserContext } from "~/contexts/UserContext";
import { MenuContext } from "~/contexts/MenuContext";
import { Dropdown } from "flowbite-qwik";
import { NestedDropdown } from "../nested-dropdown";

interface LoggedInMenuProps {
    name?: string,
    email?: string;
    image?: string;
}

const LuBellIcon = component$(() => <div class="mt-1 p-3 hover:bg-purple-500 rounded-full"><LuBell class="w-5 h-5" /></div>);

export const LoggedInMenu = component$<LoggedInMenuProps>(() => {
    useStyles$(styles);
    
    const user = useContext(UserContext);

    return (
        <div class="flex items-center gap-4 text-lg">
            <Dropdown as={<LuBellIcon />}>
                <Dropdown.Item>
                    <span>{_`No notificacions here.`}</span>
                </Dropdown.Item>
            </Dropdown>
            <NestedDropdown
                name={user.name}
                email={user.email}
                image={user.image}
            />
        </div>
    );
});

export const LoggedOutMenu = component$(() => {
    const navItems = [
        { label: _`Help`, href: '/help' },
    ];
    return (
        <nav class="flex flex-row flex-nowrap">
            {navItems.map((navItem) => (
                <Link href={navItem.href}>
                    <Button
                        aria-label={navItem.label}
                        class="p-2 text-white hover:text-white rounded"
                        key={navItem.label}
                        look="link"
                    >
                        {navItem.label}
                    </Button>
                </Link>
            ))}
        </nav>
    );
});

export default component$(() => {
    useStylesScoped$(styles);
    const user = useContext(UserContext);
    const isOpenMenu = useContext(MenuContext)

    const toggleMenu = $(() => {
        isOpenMenu.value = !isOpenMenu.value;
    })

    return (
        <header class="flex justify-center items-center z-40 bg-primary-700 text-white p-4 h-14 md:h-16">
            <div class="flex items-center py-1 gap-1">
                {!isOpenMenu.value && <button
                    class="block md:hidden"
                    onClick$={toggleMenu}
                >
                    <LuPanelLeftOpen class="w-6 h-6" />
                </button>}
                <Link href="/" aria-label="SF Homepage" class="inline-block text-white mr-auto">
                    <Logo
                        style={{ width: '48px', height: '48px' }}
                        class="animate-spin-fast"
                    />
                </Link>
            </div>
            <div class="relative">
                {user.isAuthenticated
                    ? <LoggedInMenu
                        name={user.name}
                        email={user.email}
                        image={user.image}
                    />
                    : <LoggedOutMenu />
                }
            </div>
        </header>
    );
});