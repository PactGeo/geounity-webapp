import { $, component$, type NoSerialize, useStyles$ } from "@builder.io/qwik";
import { Textarea } from '~/components/ui';
import styles from "./form.css?inline";
import { formAction$, type InitialValues, type SubmitHandler, useForm, valiForm$ } from "@modular-forms/qwik";
import * as v from 'valibot'
import { routeLoader$ } from "@builder.io/qwik-city";
import { FormFooter } from "./FormFooter";
import { TextInput } from "~/components/input/TextInput";
import { _ } from "compiled-i18n";
import { FileInput } from "~/components/input/FileInput";
import { Select } from "~/components/input/Select";
import { DebateStatus, CommunityType } from '~/constants';

const isBlob = (input: unknown) => input instanceof Blob;

interface FormDebateProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

const DebateSchema = v.object({
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
        images: v.optional(v.array(v.custom<NoSerialize<Blob>>(isBlob))),
    }),
    type: v.enum(CommunityType),
});

type DebateForm = v.InferInput<typeof DebateSchema>;

export const useFormLoader = routeLoader$<InitialValues<DebateForm>>(({ pathname }) => {
    console.log('pathname', pathname)
    return {
        title: '',
        description: '',
        tags: [],
        file: {
            images: [],
        },
        type: CommunityType.GLOBAL,
        public: true,
        status: DebateStatus.OPEN,
    }
});

type ResponseData = {
    title: string;
    description: string;
    status: string;
    type: string;
    // tags: string[];
    // creator_id: number;
}

export const useFormAction = formAction$<DebateForm, ResponseData>(
    async (values, event) => {
        const session = event.sharedMap.get('session');
        const token = session?.accessToken;
        
        const payload = {
            title: values.title,
            description: values.description,
            status: DebateStatus.OPEN,
            type: values.type,
            tags: values.tags,
        }
        
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates`, {
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

export default component$<FormDebateProps>(({ tags }) => {
    useStyles$(styles);

    const [debateForm, { Form, Field }] = useForm<DebateForm, ResponseData>({
        loader: useFormLoader(),
        action: useFormAction(),
        validate: valiForm$(DebateSchema),
    });
    
    // const file_example = useSignal<string>('https://images.unsplash.com/photo-1724963475892-a3274091955e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

    const handleSubmit = $<SubmitHandler<DebateForm>>((values, event) => {
        console.log('handleSubmit')
        console.log('values', values)
        console.log('event', event)
        // Runs on client
    });

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-4 md:space-y-6 lg:space-y-8"
        >
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

                <Field name="tags" type="string[]">
                    {(field, props) => (
                        <Select
                            {...props}
                            label={_`Tags`}
                            options={tags.map(tag => ({ name: tag.name, value: tag.name }))}
                            value={field.value}
                            error={field.error}
                            multiple
                        />
                    )}
                </Field>

                <Field name="file.images" type="File[]">
                    {(field, props) => (
                        <FileInput
                            {...props}
                            value={field.value}
                            error={field.error}
                            label="File list"
                            multiple
                        />
                    )}
                </Field>

                <Field name="type">
                    {(field, props) => field.value != CommunityType.GLOBAL && (
                        <Select
                            {...props}
                            label={_`Type`}
                            options={[
                                { name: 'Global', value: CommunityType.GLOBAL }
                            ]}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>

            </div>
            <FormFooter of={debateForm} />
        </Form>
    );
});
