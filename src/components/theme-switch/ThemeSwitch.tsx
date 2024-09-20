import { component$, createContextId, type Signal, useContextProvider, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { LuMoon, LuSun } from "@qwikest/icons/lucide";
import styles from './ThemeSwitch.css?inline';

export const ThemeContext = createContextId<Signal<string>>(
    'docs.theme-context'
);

export const ThemeSwitch = component$(() => {
    useStylesScoped$(styles);  // Aplica los estilos
    const theme = useSignal('light');
    useContextProvider(ThemeContext, theme);

    return (
        <div class="flex items-center gap-3 switch">
            <label>
                <input
                    type="checkbox"
                    onClick$={() => {
                        if (theme.value === "light") {
                            document.documentElement.className = "dark";
                            localStorage.setItem("theme", "dark");
                            theme.value = "dark";
                        } else {
                            document.documentElement.className = "light";
                            localStorage.setItem("theme", "light");
                            theme.value = "light";
                        }
                    }}
                />
                <span>{theme.value === "light"?<LuSun />:<LuMoon />}</span>
            </label>
        </div>
    );
});
