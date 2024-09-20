import { $, component$, useSignal, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import { useSession, useSignOut } from '~/routes/plugin@auth';
import { Avatar } from "~/components/ui";
import { Button } from "~/components/ui";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuChevronDown, LuGlobe, LuLogOut, LuMapPin, LuMenu, LuSun, LuUser } from "@qwikest/icons/lucide";
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
            <Dropdown.Trigger class="dropdown-trigger">
                {props.image ? (
                    <div class="flex items-center group">
                        <Avatar.Root class="transition-transform duration-300 ease-in-out">
                            <Avatar.Image
                                src={props.image}
                                alt={props.name}
                                class="transition-all duration-300 ease-in-out group-hover:brightness-125 group-hover:scale-105"
                            />
                            <Avatar.Fallback>{props.name}</Avatar.Fallback>
                        </Avatar.Root>
                        <LuChevronDown class="ml-1 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                    </div>
                ) : null}
            </Dropdown.Trigger>
            <Dropdown.Popover class="dropdown-popover dropdown-animation" gutter={8}>
                <Dropdown.Group class="dropdown-group">
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
    const slug = useLocation().params.slug
    const session = useSession();
    const showMenu = useSignal(true);

    // console.log('====================================');
    // console.log('session', session.value);

    const onCloseMenu = $(() => showMenu.value = false)

    return (
        <div class="w-full h-full container-header">
            <header class="flex justify-center w-full text-white border-0 bg-primary-700 h-14 md:h-20 border-neutral-200">
                <div class="flex items-center flex-row flex-nowrap justify-start h-full w-full px-4 md:px-10">
                    {slug && <span class="text-2xl p-4 mr-2 cursor-pointer" onClick$={() => showMenu.value = !showMenu.value}><LuMenu /></span>}
                    <Link href="/" aria-label="SF Homepage" class="inline-block text-white mr-auto">
                        <Logo
                            style={{ width: '48px', height: '48px' }}
                            class="animate-spin-fast"
                        />
                    </Link>

                    {/* <ThemeSwitch /> */}

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
        </div>
    );
});