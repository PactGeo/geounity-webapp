import { $, component$, useSignal, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import { useSession, useSignOut } from '~/routes/plugin@auth';
import { Avatar } from "~/components/ui";
import { Button } from "~/components/ui";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuChevronDown, LuGlobe, LuLogOut, LuMapPin, LuMenu, LuSun, LuUser, LuX } from "@qwikest/icons/lucide";
import { Dropdown } from "@qwik-ui/headless";
import Logo from '~/icons/logo.svg?jsx';
import styles from "./header.css?inline";

import { ThemeSwitch } from "~/components/theme-switch/ThemeSwitch";
import Menu from "~/components/menu/menu";

interface LoggedInMenuProps {
    name?: string,
    email?: string;
    image?: string;
}

export const LoggedInMenu = component$<LoggedInMenuProps>((props) => {
    useStyles$(styles);
    const signOut = useSignOut();

    return (
        <Dropdown.Root>
            <Dropdown.Trigger class="bg-light-purple rounded-full px-2 py-1 focus:outline-none focus:ring focus:ring-white">
                {props.image ? (
                    <div class="flex items-center space-x-2">
                        <Avatar.Root class="transition-transform duration-300 ease-in-out">
                            <Avatar.Image
                                src={props.image}
                                alt={props.name}
                                class="transition-all duration-300 ease-in-out group-hover:brightness-125 group-hover:scale-105"
                            />
                            <Avatar.Fallback>{props.name}</Avatar.Fallback>
                        </Avatar.Root>
                        <div style={{ fontSize: '16px' }}>
                            <LuChevronDown />
                        </div>
                    </div>
                ) : null}
            </Dropdown.Trigger>
            <Dropdown.Popover class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dropdown-popover">
                <Dropdown.Group class="py-1">
                    <Dropdown.Item>
                        <Link href="/profile/sebacc" class="dropdown-item">
                            <LuUser /><span>My profile</span>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item class="dropdown-item" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                        <LuLogOut /> <span>Log Out</span>
                    </Dropdown.Item>
                    <Dropdown.Separator class="dropdown-separator" />
                    <Dropdown.Item class="dropdown-item">
                        <LuMapPin /> <span>Location: Argentina</span>
                    </Dropdown.Item>
                    <Dropdown.Item class="dropdown-item">
                        <LuGlobe /> <span>Language: Español</span>
                    </Dropdown.Item>
                    <Dropdown.Item class="dropdown-item">
                        <LuSun /> <span>Theme</span>
                    </Dropdown.Item>
                </Dropdown.Group>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
});

export const LoggedOutMenu = component$(() => {
    const navItems = [
        { label: 'Login', href: '/login' },
        { label: 'Sign Up', href: '/register' },
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
    const session = useSession();
    console.log('SESSION:  ', session.value)
    const showMenu = useSignal(true);

    const onCloseMenu = $(() => showMenu.value = false)

    return (
        <header class="flex justify-center items-center z-50 bg-primary-700 text-white p-4 h-14 md:h-16">
            <div class="flex items-center">
                <button
                    class="p-4 mr-2 cursor-pointer"
                    onClick$={() => showMenu.value = !showMenu.value}
                >
                    <span style={{ fontSize: '24px' }}><LuMenu /></span>
                </button>
                <Link href="/" aria-label="SF Homepage" class="inline-block text-white mr-auto">
                    <Logo
                        style={{ width: '48px', height: '48px' }}
                        class="animate-spin-fast"
                    />
                </Link>
            </div>
            <div class="relative">
                {session.value?.user
                    ? <LoggedInMenu
                        name={session.value?.user?.name ?? ''}
                        email={session.value?.user?.email ?? ''}
                        image={session.value?.user?.image ?? ''}
                    />
                    : <LoggedOutMenu />
                }
            </div>
        </header>
    );
});