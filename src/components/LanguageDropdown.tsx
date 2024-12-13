import { component$, useSignal, useContext, $ } from "@builder.io/qwik";
import { Dropdown } from "flowbite-qwik";
import { _ } from "compiled-i18n";
import { UserContext } from "~/contexts/UserContext";
import { LuChevronRight, LuLanguages } from "@qwikest/icons/lucide";

interface Language {
    code: string;
    name: string;
}

const LuChevronRightIcon = component$(() => <LuChevronRight class="w-5 h-5" />);
const LuLanguagesIcon = component$(() => <LuLanguages class="w-5 h-5" />);

const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    // Agrega más idiomas según sea necesario
];

export const LanguageDropdown = component$(() => {
    const user = useContext(UserContext);
    const showLanguageOptions = useSignal(false);

    const handleSelectLanguage = $((lang: string) => {
        user.language = lang;
        showLanguageOptions.value = false;
    });

    return !showLanguageOptions.value ? (
        <Dropdown.Item onClick$={() => (showLanguageOptions.value = true)}>
            <div class="flex items-center gap-1">
                <LuLanguagesIcon /> {_`Language`} <span class="ml-auto"><LuChevronRightIcon /></span>
            </div>
        </Dropdown.Item>
    ) : (
        <>
            <Dropdown.Item onClick$={() => (showLanguageOptions.value = false)}>
                <button class="text-blue-500 underline">
                    {_`< Back`}
                </button>
            </Dropdown.Item>
            {languages.map((lang) => (
                <Dropdown.Item key={lang.code}>
                    <button
                        class={`block w-full text-left p-2 rounded ${user.language === lang.code ? "bg-gray-200" : ""}`}
                        onClick$={() => handleSelectLanguage(lang.code)}
                    >
                        {lang.name} {user.language === lang.code && _`(Selected)`}
                    </button>
                </Dropdown.Item>
            ))}
        </>
    )
});
