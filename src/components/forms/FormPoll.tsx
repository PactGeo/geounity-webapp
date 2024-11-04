import { $, component$, useStyles$ } from "@builder.io/qwik";
import { Button, Textarea } from '~/components/ui';
import { LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { getErrors, getValue, insert, remove, useForm, valiForm$ } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { Checkbox, Select, TextInput, ChipGroup } from "~/components/input";
import { PollType } from "~/constants";
import type { PollForm } from "~/schemas";
import { PollSchema } from "~/schemas";
import type { PollResponseData } from "~/shared/actions";
import { useFormAction } from "~/shared/actions";
import { useFormLoader } from "~/shared/loaders";
import {dataArray as countries} from "~/data/countries";
import styles from "./form.css?inline";

export { useFormLoader } from '~/shared/loaders';
export { useFormAction } from '~/shared/actions';

interface FormPollProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormPollProps>(({ tags }) => {
    useStyles$(styles);

    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, PollResponseData>({
        loader: useFormLoader(),
        action: useFormAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema),
    });

    const community_type = getValue(pollForm, 'community_type')
    console.log('community_type', community_type)

    const errors = getErrors(pollForm);
    console.log('errors', errors)

    const handleSubmit = $<SubmitHandler<PollForm>>((values, event) => {
        console.log('== handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });

    const hasEndDate = getValue(pollForm, 'endDate.active');

    const countriesOptions = countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-4 md:space-y-6 lg:space-y-8"
        >
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

            <Field name="type">
                {(field, props) => (
                    <ChipGroup
                        {...props}
                        name="type"
                        value={field.value || PollType.SingleChoice}
                        options={[
                            { value: PollType.Binary, label: 'Binary', description: 'A binary poll has only two options, such as Yes or No.' },
                            { value: PollType.SingleChoice, label: 'Single Choice', description: 'A single choice poll allows participants to select only one option.' },
                            { value: PollType.MultipleChoice, label: 'Multiple Choice', description: 'A multiple choice poll allows participants to select multiple options.' },
                        ]}
                        label="Type"
                        required
                        error={field.error}
                        class="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5 transition-colors duration-200 rounded-full hover:bg-blue-100"
                    />
                )}
            </Field>

            <FieldArray name="options">
                {(fieldArray) => (
                    <div class="space-y-2">
                        {fieldArray.items.map((option, index) => (
                            <div key={option} class="flex items-center space-x-2">
                                <Field name={`options.${index}`}>
                                    {(field, props) => (
                                        <TextInput
                                            {...props}
                                            type="text"
                                            value={field.value}
                                            error={field.error}
                                            placeholder={`${_`Opción`} ${index + 1}`}
                                            required
                                        />
                                    )}
                                </Field>
                                {fieldArray.items.length > 2 && (
                                    <Button
                                        type="button"
                                        onClick$={() => remove(pollForm, 'options', { at:index})}
                                        // look="danger"
                                        aria-label={`${_`Eliminar Opción`} ${index + 1}`}
                                    >
                                        <LuMinus />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {fieldArray.items.length < 10 && pollForm.internal.fields.type?.value !== PollType.Binary && (
                            <Button
                                type="button"
                                onClick$={() => insert(pollForm, 'options', { value: '' })}
                                look="ghost"
                                size="sm"
                            >
                                <LuPlus class="mr-2" />
                                
                                {_`Add option`}
                            </Button>
                        )}
                        {fieldArray.error && <div class="text-red-500">{fieldArray.error}</div>}
                    </div>
                )}
            </FieldArray>

            {/* <FieldArray name="community_ids">
                {(fieldArray) => (
                    <div class="space-y-2">
                        {fieldArray.items.map((communityId, index) => (
                            <div key={communityId}>
                                <Field name={`community_ids.${index}`}>
                                    {(field, props) => false && (
                                        <TextInput
                                            {...props}
                                            type="text"
                                            value={field.value}
                                            error={field.error}
                                            placeholder="Community ID"
                                        />
                                    )}
                                </Field>
                            </div>
                        ))}
                    </div>
                )}
            </FieldArray> */}

            <Field name="community_ids" type="string[]">
                {(field, props) => (
                    <Select
                        {...props}
                        label={_`Countries`}
                        options={countriesOptions}
                        value={field.value}
                        error={field.error}
                        multiple
                    />
                )}
            </Field>

            <Field name="community_type" type="string">
                {(field, props) => (
                    <div>
                        <TextInput
                            {...props}
                            type="text"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                        />
                    </div>
                )}
            </Field>

            <Field name="tags" type="string[]">
                {(field, props) => (
                    <Select
                        {...props}
                        label={_`Tags`}
                        options={tags.map(tag => ({ label: tag.name, value: tag.name }))}
                        value={field.value}
                        error={field.error}
                        multiple
                    />
                )}
            </Field>

            <Field name="endDate.active" type="boolean">
                {(field, props) => (
                    <Checkbox
                        {...props}
                        checked={field.value}
                        error={field.error}
                        label={_`Set an end date`}
                    />
                )}
            </Field>

            {(
                <Field name="endDate.value">
                    {(field, props) => hasEndDate && (
                        <TextInput
                            {...props}
                            type="date"
                            label={_`End Date`}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
            )}

            <Field name="is_anonymous" type="boolean">
                {(field, props) => (
                    <Checkbox
                        {...props}
                        checked={field.value}
                        error={field.error}
                        label={_`Anonymous`}
                        helperText={_`Hide your identity as the creator of the poll.`}
                    />
                )}
            </Field>
            
            <FormFooter of={pollForm} />
        </Form>
    )
});
