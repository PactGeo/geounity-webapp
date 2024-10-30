import { $, component$, useOnWindow, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";
import styles from "./list-tags.css?inline";

interface ListTagsProps {
    selectedTag?: { value: string };
    tags: { id: string, name: string }[];
}

export default component$<ListTagsProps>(({ tags, selectedTag }) => {
    console.log('tags', tags)
    useStyles$(styles);

    const selectedTagSignal = useSignal(selectedTag?.value || 'all');
    const canScrollLeft = useSignal(false);
    const canScrollRight = useSignal(false);
    const tagsRef = useSignal<HTMLDivElement>();

    const checkScroll = $(() => {
        if (tagsRef.value) {
            const { scrollLeft, scrollWidth, clientWidth } = tagsRef.value
            canScrollLeft.value = (scrollLeft > 0)
            canScrollRight.value = (scrollLeft < scrollWidth - clientWidth - 1)
        }
    })

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

    useVisibleTask$(() => {
        checkScroll()
    });

    useOnWindow(
        'resize',
        $(() => {
            checkScroll()
        })
    )

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
                        class={`button-tag ${selectedTagSignal.value === 'all' ? 'active' : ''}`}
                        onClick$={() => selectedTagSignal.value = 'all'}
                    >
                        All
                    </button>
                    {tags.map((tag) => (
                        <button
                            class={`button-tag ${selectedTagSignal.value === tag.name ? 'active' : ''}`}
                            key={tag.id}
                            onClick$={() => selectedTagSignal.value = tag.name}
                        >
                            {tag.name}
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
