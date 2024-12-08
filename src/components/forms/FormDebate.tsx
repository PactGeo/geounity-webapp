import { $, component$, useStyles$ } from "@builder.io/qwik";
import styles from "./form.css?inline";
import { getErrors, type SubmitHandler, useForm, valiForm$ } from "@modular-forms/qwik";
import { _ } from "compiled-i18n";
import { FileInput } from "~/components/input/FileInput";
import { Select } from "~/components/input/Select";
import { CommunityType } from '~/constants';
import { DebateSchema } from "~/schemas/debateSchema";
import type { DebateForm } from "~/schemas/debateSchema";
import type { DebateResponseData } from "~/shared/actions";

import { useFormDebateLoader } from "~/shared/loaders";
import { useFormDebateAction } from "~/shared/actions";
import { FormFooter } from "./FormFooter";
import { InputLabel } from "~/components/input/InputLabel";
import { TagInput } from "~/components/input/TagInput";

export { useFormDebateLoader } from '~/shared/loaders';
export { useFormDebateAction } from '~/shared/actions';

interface FormDebateProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormDebateProps>(({ tags }) => {
    useStyles$(styles);

    const [debateForm, { Form, Field }] = useForm<DebateForm, DebateResponseData>({
        loader: useFormDebateLoader(),
        action: useFormDebateAction(),
        validate: valiForm$(DebateSchema),
    });

    const errors = getErrors(debateForm);
    console.log('errors', errors)
    
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
            {/* TITLE */}
            <Field name="title">
                {(field, props) => (
                    <div class="space-y-1">
                        <InputLabel name={field.name} label={field.name} required />
                        <input
                            {...props}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                            placeholder="Enter a title"
                            type="text"
                            required
                        />
                        {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                    </div>
                )}
            </Field>

            {/* DESCRIPTION */}
            <Field name="description">
                {(field, props) => (
                    <div class="space-y-1">
                        <InputLabel name={field.name} label={field.name} />
                        <textarea
                            {...props}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                            placeholder={_`Enter a description`}
                            rows={4}
                        />
                        {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                    </div>
                )}
            </Field>

            {/* TAGS */}
            <Field name="tags" type="string[]">
                {(field, props) => (
                    <TagInput
                        {...props}
                        error={field.error}
                        form={debateForm}
                        label={_`Tags`}
                        predefinedTags={tags}
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

            <FormFooter of={debateForm} />
        </Form>
    );
});
