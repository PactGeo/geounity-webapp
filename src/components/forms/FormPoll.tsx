import { $, component$, useStyles$ } from "@builder.io/qwik";
import { Button, Textarea } from '~/components/ui';
import { LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { getValue, insert, remove, SubmitHandler, useForm, valiForm$, type InitialValues } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { Checkbox, Select, TextInput, ChipGroup } from "~/components/input";
import { PollType } from "~/constants";
import { PollForm, PollSchema } from "~/schemas";
import { PollResponseData, useFormAction } from "~/shared/actions";
import { useFormLoader } from "~/shared/loaders";
import styles from "./form.css?inline";

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
    const value = getValue(pollForm, 'title')
    console.log('value', value)

    const handleSubmit = $<SubmitHandler<PollForm>>((values, event) => {
        console.log('== handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });

    const hasEndDate = getValue(pollForm, 'endDate.active');

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
            {/* Campo de Opciones con FieldArray */}
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
            <Field name="community">
                {(field, props) => false && (
                    <TextInput
                        {...props}
                        type="text"
                        label={field.name}
                        value={field.value}
                        error={field.error}
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
            {hasEndDate && (
                <Field name="endDate.value">
                    {(field, props) => (
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
            <FormFooter of={pollForm} />
        </Form>
    )
});
