import { $, component$, useContext, useStyles$, useStylesScoped$ } from "@builder.io/qwik";
import { useSignOut } from '~/routes/plugin@auth';
import { Button } from "~/components/ui";
import { Link } from "@builder.io/qwik-city";
import { LuBell, LuGlobe, LuLogOut, LuMapPin, LuPanelLeftOpen, LuUser } from "@qwikest/icons/lucide";
import Logo from '~/icons/logo.svg?jsx';
import styles from "./header.css?inline";

import { ThemeSwitch } from "~/components/theme-switch/ThemeSwitch";
import { _ } from "compiled-i18n";
import { UserContext } from "~/contexts/UserContext";
import { MenuContext } from "~/contexts/MenuContext";
import { Avatar, Dropdown } from "flowbite-qwik";

interface LoggedInMenuProps {
    name?: string,
    email?: string;
    image?: string;
}

const LuUserIcon = component$(() => <LuUser />);
const LuLogOutIcon = component$(() => <LuLogOut />);
const LuGlobeIcon = component$(() => <LuGlobe />);
const LuMapPinIcon = component$(() => <LuMapPin />);
const ThemeSwitchIcon = component$(() => <ThemeSwitch />);

interface AvatarFallbackProps {
    img?: string;
    alt?: string;
}

const AvatarFallback = component$((props: AvatarFallbackProps) => (
    <div class="mt-1">
        <Avatar
            img={props.img}
            alt={props.alt}
            size="sm"
            rounded
        />
    </div>
));

const LuBellIcon = component$(() => <div class="mt-1 p-3 hover:bg-purple-500 rounded-full"><LuBell class="w-5 h-5" /></div>);

export const LoggedInMenu = component$<LoggedInMenuProps>((props) => {
    useStyles$(styles);
    
    const user = useContext(UserContext);
    const signOut = useSignOut();

    return (
        <div class="flex items-center gap-4">
            <Dropdown as={<LuBellIcon />}>
                <Dropdown.Item>
                    <span>{_`No notificacions here.`}</span>
                </Dropdown.Item>
            </Dropdown>
            <Dropdown as={<AvatarFallback img={props.image} alt={props.name} />}>
                <Dropdown.Item>
                    <Link href={`/user/${user.username}`}>
                        <div class="flex items-center">
                            <LuUserIcon /><span>{_`My profile`}</span>
                        </div>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item>
                    <div class="flex items-center gap-1">
                        <LuGlobeIcon /> <span>{_`Language`}</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item>
                    <div class="flex items-center gap-1">
                        <LuMapPinIcon /> <span>{_`Location`}</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item>
                    <div class="flex items-center gap-1">
                        <ThemeSwitchIcon />
                    </div>
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item onClick$={() => console.log('LOGOUT')}>
                    <div class="flex items-center gap-1" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                        <LuLogOutIcon /> <span>{_`Log Out`}</span>
                    </div>
                </Dropdown.Item>
            </Dropdown>
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