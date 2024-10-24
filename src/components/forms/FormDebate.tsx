import { $, component$, NoSerialize, useSignal, useStyles$ } from "@builder.io/qwik";
import { Button, Input, Label, Select, Textarea } from '~/components/ui';
import { LuCheck, LuLoader2 } from "@qwikest/icons/lucide";
import { usePostDebate } from "~/shared/loaders";
import styles from "./form.css?inline";
import { formAction$, InitialValues, SubmitHandler, useForm, valiForm$ } from "@modular-forms/qwik";
import * as v from 'valibot'
import { routeLoader$ } from "@builder.io/qwik-city";
import { FormHeader } from "./FormHeader";
import { FormFooter } from "./FormFooter";
import { TextInput } from "~/components/input/TextInput";
import InputFile from "~/components/input/InputFile";
import { _ } from "compiled-i18n";
import { FileInput } from "~/components/input/FileInput";

const isBlob = (input: unknown) => input instanceof Blob;

interface FormDebateProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

const DebateSchema = v.object({
    type: v.string(),
    status: v.string(),
    title: v.pipe(
        v.string(),
        v.nonEmpty(_`Please enter a title.`),
        v.minLength(5, _`Your password must have 5 characters or more.`),
        v.maxLength(100, _`Your password must have 100 characters or less.`),
    ),
    description: v.pipe(
        v.string(),
        v.maxLength(5000, _`Your password must have 5000 characters or less.`),
    ),
    tags: v.array(v.string()),
    file: v.object({
        list: v.optional(v.array(v.custom<NoSerialize<Blob>>(isBlob))),
        item: v.optional(v.custom<NoSerialize<Blob>>(isBlob)),
    }),
    community: v.string(),
});

type DebateForm = v.InferInput<typeof DebateSchema>;

type ResponseData = {
    type: string;
    status: string;
    title: string;
    description: string;
    tags: string[];
    creator_id: number;
    community: string;
}

export const useFormLoader = routeLoader$<InitialValues<DebateForm>>(({ pathname }) => {
    return {
        type: 'GLOBAL',
        status: 'OPEN',
        title: '',
        description: '',
        tags: [],
        file: {
            list: [],
            item: null,
        },
        community: pathname.includes('/global/') ? 'Global' : 'private',
    }
});

export const useFormAction = formAction$<DebateForm, ResponseData>(
    async (values, event) => {
        console.log('=== useFormAction ===')
        console.log('values', values)
        const session = event.sharedMap.get('session');
        const token = session?.accessToken;
        const payload = {
            type: values.type,
            status: values.status,
            title: values.title,
            description: values.description,
            tags: values.tags,
            community_id: values.community === 'Global' ? 1 : 2,
        }
        console.log('payload: ', payload)
        const response = await fetch('http://localhost:8000/debates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return {
            success: true,
            message: _`Debate created successfully`,
            data,
        }
    },
    valiForm$(DebateSchema)
);

export default component$<FormDebateProps>(({ onSubmitCompleted, tags }) => {
    useStyles$(styles);

    const [debateForm, { Form, Field }] = useForm<DebateForm, ResponseData>({
        loader: useFormLoader(),
        action: useFormAction(),
        validate: valiForm$(DebateSchema),
    });
    
    const isLoading = useSignal(false);
    const isPreview = useSignal(false);
    const title = useSignal('');
    const description = useSignal('');
    const file_example = useSignal<string>('https://images.unsplash.com/photo-1724963475892-a3274091955e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    const display = useSignal<string[]>([]);
    const creatorId = useSignal(1);  // Ejemplo de ID de creador
    const communityId = useSignal(1); // Ejemplo de ID de comunidad
    
    const action = usePostDebate();

    const handleSubmit = $<SubmitHandler<DebateForm>>((values, event) => {
        console.log('== handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-4 md:space-y-6 lg:space-y-8"
        >
            <FormHeader of={debateForm} />
            <div class="space-y-4 md:space-y-6 lg:space-y-8">
                <Field name="title">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            type="text"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                            placeholder={_`Enter a title`}
                            required
                        />
                    )}
                </Field>

                <Field name="description">
                    {(field, props) => (
                        <Textarea
                            {...props}
                            value={field.value}
                            error={field.error}
                            placeholder={_`Enter a description`}
                        />
                    )}
                </Field>

                {/* <Field name="file.list" type="File[]">
                    {(field, props) => (
                        <FileInput
                            {...props}
                            hidden={true}
                            value={field.value}
                            error={field.error}
                            label="File list"
                            multiple
                        />
                    )}
                </Field> */}

                <Field name="file.item" type="File">
                    {(field, props) => (
                        <FileInput
                            {...props}
                            value={field.value}
                            error={field.error}
                            label={_`File item`}
                        />
                    )}
                </Field>

                <Field name="community">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            type="text"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
            </div>

            {/* <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <InputFile action={action} />
            </div> */}


            {/* <div class="grid w-full max-w-sm items-center gap-1.5 mb-4">
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
            )} */}
            <FormFooter of={debateForm} />
        </Form>
    );
});
