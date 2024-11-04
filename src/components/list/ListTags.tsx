import { $, component$, useOnWindow, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";
import { useNavigate, useLocation } from '@builder.io/qwik-city';
import styles from "./list-tags.css?inline";
import { _ } from "compiled-i18n";
import { tagTranslations } from "~/constants";

interface ListTagsProps {
    selectedTag: { id: number, name: string };
    tags: { id: string, name: string }[];
}

export default component$<ListTagsProps>(({ tags, selectedTag }) => {
    console.log('selectedTag2', selectedTag)
    console.log('tags', tags)
    useStyles$(styles);

    // Hooks de navegación y ubicación
    const navigate = useNavigate();
    const location = useLocation();

    // Señales para manejar el estado
    const canScrollLeft = useSignal(false);
    const canScrollRight = useSignal(false);
    const tagsRef = useSignal<HTMLDivElement>();

    // Función para verificar el estado del scroll
    const checkScroll = $(() => {
        if (tagsRef.value) {
            const { scrollLeft, scrollWidth, clientWidth } = tagsRef.value;
            canScrollLeft.value = scrollLeft > 0;
            canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
        }
    });

    // Función para desplazar los tags
    const scrollTags = $((direction: "left" | "right") => {
        if (tagsRef.value) {
            const scrollAmount = tagsRef.value.clientWidth / 2;
            tagsRef.value.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScroll, 300);
        }
    });

    // Función para manejar el clic en un tag
    const handleTagClick = $((tagName: string) => {
        if (tagName === selectedTag.name) {
            // If the clicked tag is already selected, deselect and go back to 'all'
            selectedTag.name = 'all';
            const url = new URL(location.url.href);
            url.searchParams.delete('tags');
            navigate(url.pathname + url.search);
        } else {
            // If the clicked tag is not selected, select it
            selectedTag.name = tagName;
            const url = new URL(location.url.href);
            url.searchParams.set('tags', tagName);
            navigate(url.pathname + url.search);
        }
    });

    // Tarea visible para sincronizar el estado con la URL al montar el componente
    useVisibleTask$(() => {
        checkScroll();

        // Leer los parámetros de la URL al montar el componente
        const currentTags = location.url.searchParams.getAll('tags');
        if (currentTags.length > 0) {
            // Asumimos que solo hay un tag seleccionado; si hay múltiples, se puede ajustar
            selectedTag.name = currentTags[0];
        } else {
            selectedTag.name = 'all';
        }
    });

    // Escuchar el evento de resize para verificar el estado del scroll
    useOnWindow(
        'resize',
        $(() => {
            checkScroll();
        })
    );

    return (
        <div class="p-4 flex-shrink-0">
            <div class="relative">
                {canScrollLeft.value && (
                    <button
                        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md z-10"
                        onClick$={() => scrollTags('left')}
                    >
                        <LuChevronLeft />
                    </button>
                )}
                <div
                    class="flex overflow-x-auto py-2 space-x-2 no-scrollbar hide-scroll-bar"
                    ref={tagsRef}
                >
                    <button
                        class={`button-tag ${selectedTag.name === 'all' ? 'active' : ''}`}
                        onClick$={() => handleTagClick('all')}
                    >
                        {_`All`}
                    </button>
                    {tags.map((tag) => (
                        <button
                            class={`button-tag ${selectedTag.name === tag.name ? 'active' : ''}`}
                            key={tag.id}
                            onClick$={() => handleTagClick(tag.name)}
                        >
                            {tagTranslations[tag.name] || tag.name}
                        </button>
                    ))}
                </div>
                {canScrollRight.value && (
                    <button
                        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md z-10"
                        onClick$={() => scrollTags('right')}
                    >
                        <LuChevronRight />
                    </button>
                )}
            </div>
        </div>
    );
});
