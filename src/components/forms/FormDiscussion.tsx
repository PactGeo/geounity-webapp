import { $, component$, useContext, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import styles from "./form.css?inline";
import { getErrors, setValue, type SubmitHandler, useForm, valiForm$ } from "@modular-forms/qwik";
import { _ } from "compiled-i18n";
import { FileInput } from "~/components/input/FileInput";
import { CommunityType } from '~/constants';
import { TextArea } from "~/components/input/TextArea";
import { DiscussionSchema, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from "~/schemas/discussionSchema";
import type { DiscussionForm } from "~/schemas/discussionSchema";
import type { DebateResponseData } from "~/shared/actions";

import { useFormDiscussionLoader } from "~/shared/loaders";
import { useFormDiscussionAction } from "~/shared/actions";
import { FormFooter } from "./FormFooter";
import { TagInput } from "~/components/input/TagInput";
import { TextInput } from "~/components/input/TextInput";
import { Checkbox, ChipGroup } from "~/components/input";
import { Toggle } from "flowbite-qwik";
import { UserContext } from "~/contexts/UserContext";

export { useFormDiscussionLoader } from '~/shared/loaders';
export { useFormDiscussionAction } from '~/shared/actions';

interface FormDiscussionProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormDiscussionProps>(({ tags }) => {
    useStyles$(styles);
    const user = useContext(UserContext);

    const isAnonymous = useSignal(false);
    const isPublic = useSignal(true)

    const [discussionForm, { Form, Field }] = useForm<DiscussionForm, DebateResponseData>({
        loader: useFormDiscussionLoader(),
        action: useFormDiscussionAction(),
        validate: valiForm$(DiscussionSchema),
    });

    useTask$(({ track }) => {
            track(isAnonymous);
            setValue(discussionForm, 'is_anonymous', isAnonymous.value);
    })

    useTask$(({ track }) => {
        track(isPublic);
        setValue(discussionForm, 'public', isPublic.value);
    })


    const errors = getErrors(discussionForm);
    console.log('errors', errors)
    
    // const file_example = useSignal<string>('https://images.unsplash.com/photo-1724963475892-a3274091955e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

    const handleSubmit = $<SubmitHandler<DiscussionForm>>((values, event) => {
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
            {/* SCOPE */}
            <Field name="scope">
                {(field, props) => (
                    <ChipGroup
                        {...props}
                        name="scope"
                        value={field.value || CommunityType.GLOBAL}
                        options={[
                            { value: CommunityType.GLOBAL, label: 'Global', description: 'A poll visible to the entire global community.' },
                            { value: CommunityType.INTERNATIONAL, label: 'International', description: 'A poll involving multiple countries.' },
                            { value: CommunityType.NATIONAL, label: 'National', description: 'A poll for a single country.' },
                            { value: CommunityType.SUBNATIONAL, label: 'Subnational', description: 'A poll for provinces or subnational regions.' },
                        ]}
                        label="Scope"
                        required
                        error={field.error}
                        class="transition-colors duration-200 rounded-full hover:bg-green-100"
                    />
                )}
            </Field>

            {/* TITLE */}
            <Field name="title">
                {(field, props) => (
                    <TextInput
                        {...props}
                        class="space-y-2"
                        error={field.error}
                        label={_`Title`}
                        placeholder={_`Enter poll title`}
                        maxLength={MAX_TITLE_LENGTH}
                        required
                        value={field.value}
                        autofocus
                    />
                )}
            </Field>

            {/* DESCRIPTION */}
            <Field name="description">
                {(field, props) => (
                    <TextArea
                        {...props}
                        class="space-y-2"
                        error={field.error}
                        label={_`Description`}
                        placeholder={_`Enter a description`}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        required
                        value={field.value}
                    />
                )}
            </Field>

            {/* TAGS */}
            <Field name="tags" type="string[]">
                {(field, props) => (
                    <TagInput
                        {...props}
                        error={field.error}
                        form={discussionForm}
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

            {/* ANONYMOUS */}
            <div>
                <Toggle label={_`Anonymous`} bind:checked={isAnonymous} />
                <p class="mt-2 text-sm text-gray-500">
                    {isAnonymous.value
                        ? _`Your identity will be hidden as the creator of the poll.`
                        : _`Your username "${user.username}" will be displayed as the creator of the poll.`}
                </p>
                <Field name="is_anonymous" type="boolean">
                    {(field, props) => (
                        <div class="hidden">
                            <Checkbox
                                {...props}
                                checked={field.value}
                                error={field.error}
                                label={_`Anonymous`}
                                helperText={_`Hide your identity as the creator of the poll.`}
                            />
                        </div>
                    )}
                </Field>
            </div>

            <div>
                <Toggle label={_`Public`} bind:checked={isPublic} disabled />
                <Field name="public" type="boolean">
                    {(field, props) => (
                        <div class="hidden">
                            <Checkbox
                                {...props}
                                checked={field.value}
                                error={field.error}
                                label={_`Anonymous`}
                                helperText={_`Hide your identity as the creator of the poll.`}
                            />
                        </div>
                    )}
                </Field>
            </div>

            <FormFooter of={discussionForm} />
        </Form>
    );
});
