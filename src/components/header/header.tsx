import { component$, useSignal, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import { useSession, useSignOut } from '~/routes/plugin@auth';
import { Avatar } from "~/components/ui";
import { Button } from "~/components/ui";
import { Link } from "@builder.io/qwik-city";
import { LuChevronDown, LuGlobe, LuLogOut, LuMapPin, LuMenu, LuUser } from "@qwikest/icons/lucide";
import { Dropdown } from "@qwik-ui/headless";
import Logo from '~/icons/logo.svg?jsx';
import styles from "./header.css?inline";

import { ThemeSwitch } from "~/components/theme-switch/ThemeSwitch";
import { _ } from "compiled-i18n";

interface LoggedInMenuProps {
    name?: string,
    email?: string;
    image?: string;
}

export const LoggedInMenu = component$<LoggedInMenuProps>((props) => {
    useStyles$(styles);
    const signOut = useSignOut();

    const actions = [
        { key: 'location', icon: <LuMapPin />, label: _`Location`, href: '/user/sebacc', disabled: false },
        { key: 'language', icon: <LuGlobe />, label: _`Language`, href: '/user/sebacc', disabled: false },
        { key: 'theme', label: <ThemeSwitch />, href: '/user/sebacc', disabled: false },
    ]

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
            <Dropdown.Popover class="mt-2 pt-2 rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                <Dropdown.Group>
                    <Dropdown.Item class="dropdown-item">
                        <Link href="/user/sebacc">
                            <div class="flex items-center">
                                <LuUser /><span>{_`My profile`}</span>
                            </div>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item class="dropdown-item" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                        <div class="flex items-center">
                            <LuLogOut /> <span>{_`Log Out`}</span>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Separator class="dropdown-separator" />
                    {actions.map((action) => (
                        <Dropdown.Item key={action.label} class="dropdown-item" disabled={action.disabled}>
                            <div class="flex items-center">
                                {action.icon} {action.label}
                            </div>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Group>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
});

export const LoggedOutMenu = component$(() => {
    const navItems = [
        { label: _`Login`, href: '/login' },
        { label: _`Sign Up`, href: '/register' },
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
    const showMenu = useSignal(true);

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
                        name={session.value.user.name ?? ''}
                        email={session.value.user.email ?? ''}
                        image={session.value.user.image ?? ''}
                    />
                    : <LoggedOutMenu />
                }
            </div>
        </header>
    );
});