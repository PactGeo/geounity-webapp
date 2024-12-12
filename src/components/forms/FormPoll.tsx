import { $, component$, useStyles$ } from "@builder.io/qwik";
import { Button } from '~/components/ui';
import { LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { getErrors, getValue, insert, remove, useForm, valiForm$ } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { Checkbox, TextInput, ChipGroup } from "~/components/input";
import { CommunityType, PollType } from "~/constants";
import type { PollForm } from "~/schemas";
import { PollSchema } from "~/schemas";
import type { PollResponseData } from "~/shared/actions";
import { useFormPollAction } from "~/shared/actions";
import { useFormPollLoader } from "~/shared/loaders";
import {dataArray as countries} from "~/data/countries";
import styles from "./form.css?inline";
import { InputLabel } from "../input/InputLabel";
import { TagInput } from "../input/TagInput";
import { CountrySelectInput } from "../input/CountrySelectInput";

export { useFormPollLoader } from '~/shared/loaders';
export { useFormPollAction } from '~/shared/actions';

interface FormPollProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormPollProps>(({ tags }) => {
    useStyles$(styles);

    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, PollResponseData>({
        loader: useFormPollLoader(),
        action: useFormPollAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema),
    });
    
    const community_type = getValue(pollForm, 'community_type')

    const errors = getErrors(pollForm);
    console.log('errors', errors)

    const handleSubmit = $<SubmitHandler<PollForm>>((values, event) => {
        console.log('== PollForm handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });

    const hasEndDate = getValue(pollForm, 'endDate.active');

    const countriesOptions = countries.map(c => ({ value: c.name, name: `${c.flag} ${c.name}` }))

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-2 md:space-y-3 lg:space-y-4"
        >
            {/* COMMUNITIES */}
            <Field name="community_ids" type="string[]">
                {(field, props) => community_type != CommunityType.GLOBAL && (
                    <CountrySelectInput
                        {...props}
                        form={pollForm}
                        label={_`Countries involved`}
                        predefinedCountries={countriesOptions}
                        error={field.error}
                    />
                )}
            </Field>

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

            {/* TYPE */}
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

            {/* OPTIONS */}
            <FieldArray name="options">
                {(fieldArray) => (
                    <div class="space-y-2">
                        {fieldArray.items.map((option, index) => (
                            <div key={option} class="flex items-center space-x-2">
                                <Field name={`options.${index}`}>
                                    {(field, props) => (
                                        <div>
                                            <input
                                                {...props}
                                                placeholder={`${_`Opción`} ${index + 1}`}
                                                type="text"
                                                required
                                            />
                                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                                        </div>
                                    )}
                                </Field>
                                {fieldArray.items.length > 2 && (
                                    <Button
                                        type="button"
                                        onClick$={() => remove(pollForm, 'options', { at:index})}
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

            <Field name="community_type" type="string">
                {(field, props) => (
                    <div class="hidden">
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
            
            {/* TAGS */}
            <Field name="tags" type="string[]">
                {(field, props) => (
                    <TagInput
                        {...props}
                        error={field.error}
                        form={pollForm}
                        label={_`Tags`}
                        predefinedTags={tags}
                    />
                )}
            </Field>

            <Field name="endDate.active" type="boolean">
                {(field, props) => (
                    <Checkbox
                        {...props}
                        checked={field.value}
                        error={field.error}
                        label={field.value ? _`Set an end date` : _`Set an end date (Always open)`}
                    />
                )}
            </Field>

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
