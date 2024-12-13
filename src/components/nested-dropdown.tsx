import { component$, useSignal, $, useStylesScoped$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuUser, LuChevronRight, LuGlobe, LuMapPin, LuLogOut } from '@qwikest/icons/lucide';
import { _ } from 'compiled-i18n';
import { Avatar } from 'flowbite-qwik';
import { UserContext } from '~/contexts/UserContext';
import styles from './nested-dropdown.css?inline';
import { ThemeSwitch } from './theme-switch/ThemeSwitch';
import { useSignOut } from '~/routes/plugin@auth';

interface NestedDropdownProps {
    name?: string;
    email?: string;
    image?: string;
}

interface Language {
    code: string;
    name: string;
}

const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    // Agrega más idiomas según sea necesario
];

export const NestedDropdown = component$<NestedDropdownProps>((props) => {
    useStylesScoped$(styles);
    const signOut = useSignOut();

    const user = useContext(UserContext);
    const isOpen = useSignal(false);
    const isSubOpen = useSignal(false);

    const toggleDropdown = $(() => {
        isOpen.value = !isOpen.value;
        if (!isOpen.value) {
            isSubOpen.value = false;
        }
    });

    const toggleSubDropdown = $((event: Event) => {
        event.stopPropagation();
        isSubOpen.value = !isSubOpen.value;
    });

    const selectLanguage = $((lang: string) => {
        user.language = lang; // Asegúrate de que el contexto permita la actualización
        isOpen.value = false;
        isSubOpen.value = false;
        // Aquí podrías agregar lógica adicional para cambiar el idioma en la aplicación
    });

    return (
        <div class="dropdown">
            <button onClick$={toggleDropdown}>
                <div class="mt-1">
                    <Avatar
                        img={props.image}
                        alt={props.name}
                        size="sm"
                        rounded
                    />
                </div>
            </button>
            <div class={`dropdown-content ${isOpen.value ? 'show' : ''}`}>
                <div class="dropdown-item">
                    <Link href={`/user/${user.username}`} class="flex items-center">
                        <LuUser class="w-5 h-5" />
                        <span>{_`My Profile`}</span>
                    </Link>
                </div>
                <div class="dropdown-divider"></div>
                <div class="sub-dropdown">
                    <div class="dropdown-item" onClick$={toggleSubDropdown}>
                        <LuGlobe class="w-5 h-5" />
                        <span>{_`Language`}</span>
                        <LuChevronRight class="w-4 h-4 ml-auto" />
                    </div>
                    <div class={`sub-dropdown-content ${isSubOpen.value ? 'show' : ''}`}>
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                class={`dropdown-item ${user.language === lang.code ? 'font-bold' : ''}`}
                                onClick$={() => selectLanguage(lang.code)}
                            >
                                {lang.name} {user.language === lang.code && _`(Selected)`}
                            </div>
                        ))}
                    </div>
                </div>
                <div class="dropdown-item">
                    <LuMapPin class="w-5 h-5" /> <span>{_`Location`}</span>
                </div>
                <div class="dropdown-item">
                    <ThemeSwitch />
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                    <LuLogOut class="w-5 h-5" /> <span>{_`Log Out`}</span>
                </div>
            </div>
        </div>
    );
});
