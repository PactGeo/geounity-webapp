import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Form } from '@builder.io/qwik-city';
import { Button, Input, Label, Select, Textarea } from '~/components/ui';
import { LuCheck, LuLoader2 } from "@qwikest/icons/lucide";
import { usePostDebate } from "~/shared/loaders";
import styles from "./form.css?inline";
import InputFile from "~/components/input/InputFile";

interface FormDebateGlobalProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormDebateGlobalProps>(({ onSubmitCompleted, tags }) => {
    useStyles$(styles);
    
    const isLoading = useSignal(false);
    const isPreview = useSignal(false);
    const title = useSignal('');
    const description = useSignal('');
    const file_example = useSignal<string>('https://images.unsplash.com/photo-1724963475892-a3274091955e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    const display = useSignal<string[]>([]);
    const creatorId = useSignal(1);  // Ejemplo de ID de creador
    const communityId = useSignal(1); // Ejemplo de ID de comunidad
    
    const action = usePostDebate();

    return (
        <Form
            action={action}
            onSubmitCompleted$={() => {
                isLoading.value = false;
                !action.value?.failed && onSubmitCompleted && onSubmitCompleted();
            }}
        >
            <input type="hidden" name="type" value="GLOBAL" />
            <input type="hidden" name="status" value="OPEN" />

            <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <InputFile action={action} />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label for="title">Title</Label>
                <Input
                    autofocus
                    bind:value={title}
                    error={action.value?.fieldErrors?.title}
                    id="title"
                    maxLength={100}
                    name="title"
                    placeholder="Describe a key challenge for the community"
                    type="text"
                />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label for="description">Description</Label>
                <Textarea
                    class="overflow-hidden h-auto"
                    name="description"
                    placeholder="Provide details about the problem or proposal"
                    maxLength={5000}
                    bind:value={description}
                    error={action.value?.fieldErrors?.description}
                />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label for="tags">Tags</Label>
                <Select.Root bind:displayValue={display} multiple class="select" name="tags">
                    <Select.Trigger class="select-trigger">
                        <Select.DisplayValue>{display.value.join(', ')}</Select.DisplayValue>
                    </Select.Trigger>
                    <Select.Popover class="select-popover select-max-height">
                        {tags.map((tag) => (
                            <Select.Item value={tag.id} class="select-item" key={tag.id}>
                                <Select.ItemLabel>{tag.name}</Select.ItemLabel>
                                <Select.ItemIndicator><LuCheck /></Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Popover>
                </Select.Root>
            </div>

            {display.value.map((item, index) => (
                <input type="hidden" name={`tags.${index}`} value={item}></input>
            ))}

            <input type="hidden" name="creator_id" value={creatorId.value} />
            <input type="hidden" name="community_id" value={communityId.value} />

            <Button
                class="modal-save w-full"
                onClick$={() => isLoading.value = true}
                disabled={isLoading.value}
                type="submit"
            >
                {isLoading.value && <LuLoader2 class="mr-2 h-5 w-5 animate-spin" />}
                {isLoading.value ? <span>Creating Debate</span> : <span>Create Debate</span>}
            </Button>

            {isPreview.value && (
                <div class="mt-4 p-4 bg-gray-100 rounded-md">
                    <h3 class="text-lg font-bold">{title.value || "Preview Title"}</h3>
                    <p>{description.value || "Preview Description"}</p>
                    <img src={file_example.value} alt="Preview" class="mt-2 max-w-full h-auto" />
                    <p class="mt-2 text-sm text-gray-500">Tags: {display.value.join(', ') || "No tags selected"}</p>
                </div>
            )}
        </Form>
    );
});
