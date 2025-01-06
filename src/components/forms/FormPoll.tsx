import { $, component$, useContext, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { Button } from '~/components/ui';
import { LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { insert, remove, setValue, useForm, valiForm$ } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { ChipGroup, Select } from "~/components/input";
import { CommunityType, PollType } from "~/constants";
import type { PollForm } from "~/schemas";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, PollSchema } from "~/schemas";
import type { PollResponseData } from "~/shared/actions";
import { useFormPollAction } from "~/shared/actions";
import { useFormPollLoader } from "~/shared/loaders";
import { dataArray as countries } from "~/data/countries";
import styles from "./form.css?inline";
import { TagInput } from "~/components/input/TagInput";
import { CountrySelectInput } from "~/components/input/CountrySelectInput";
import { TextInput } from "~/components/input/TextInput";
import { TextArea } from "~/components/input/TextArea";
import { Toggle } from "flowbite-qwik";
import { Checkbox } from "~/components/input";
import { UserContext } from "~/contexts/UserContext";

export { useFormPollLoader } from '~/shared/loaders';
export { useFormPollAction } from '~/shared/actions';

interface FormPollProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormPollProps>(({ tags }) => {
    useStyles$(styles);
    const user = useContext(UserContext);

    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, PollResponseData>({
        loader: useFormPollLoader(),
        action: useFormPollAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema),
    });

    console.log('==================================================')

    console.log('Form submitting:', pollForm.submitting);
    console.log('Form values:', pollForm.internal.fields);
    console.log('Is form valid?', !pollForm.invalid);
    console.log('pollForm', pollForm)
    console.log('pollForm.internal', pollForm.internal)

    const hasEndDate = useSignal(false);
    const isAnonymous = useSignal(false);

    useTask$(({ track }) => {
        track(isAnonymous);
        setValue(pollForm, 'is_anonymous', isAnonymous.value);
    })

    const handleSubmit = $<SubmitHandler<PollForm>>((values) => {
        console.log('== PollForm handleSubmit ==');
        console.log('values', values);
    });

    const countriesOptions = countries.map(c => ({ value: c.name, name: `${c.flag} ${c.name}` }))
    const provincesOptions: { value: string, name: string }[] = []

    {console.log('###pollForm.internal.fields.scope?.value', pollForm.internal.fields.scope?.value)}

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-6"
        >
            <div class="space-y-6">
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

                {/* COMMUNITY_IDS */}
                <Field name="community_ids" type="string[]">
                    {(field, props) => {
                        const scope = pollForm.internal.fields.scope?.value;

                        switch (scope) {
                            case CommunityType.GLOBAL:
                                return <input type="hidden" {...props} value="1" />;

                            case CommunityType.INTERNATIONAL:
                                return (
                                    <CountrySelectInput
                                        {...props}
                                        form={pollForm}
                                        label={_`Countries involved`}
                                        predefinedCountries={countriesOptions}
                                        error={field.error}
                                    />
                                );

                            case CommunityType.NATIONAL:
                                return (
                                    <Select
                                        {...props}
                                        options={countriesOptions}
                                        label={_`Select a country`}
                                        value={field.value}
                                        error={field.error}
                                    />
                                );

                            case CommunityType.SUBNATIONAL:
                                return (
                                    <Select
                                        {...props}
                                        options={provincesOptions}
                                        label={_`Select a province`}
                                        value={field.value}
                                        error={field.error}
                                    />
                                );

                            default:
                                return null;
                        }
                    }}
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
                            placeholder={_`Provide more details about the poll`}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            required
                            value={field.value}
                        />
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
                            class="transition-colors duration-200 rounded-full hover:bg-blue-100"
                        />
                    )}
                </Field>

                {/* OPTIONS */}
                <FieldArray name="options">
                    {(fieldArray) => (
                        <div class="space-y-4">
                            {fieldArray.items.map((option, index) => (
                                <div key={option} class="flex items-center space-x-2">
                                    <Field name={`options.${index}`}>
                                        {(field, props) => (
                                            <TextInput
                                                {...props}
                                                class="space-y-2"
                                                error={field.error}
                                                label={`${_`Option`} ${index + 1}`}
                                                placeholder={_`Enter option ${index + 1}`}
                                                maxLength={MAX_TITLE_LENGTH}
                                                required
                                                value={field.value}
                                            />
                                        )}
                                    </Field>
                                    {fieldArray.items.length > 2 && (
                                        <Button
                                            type="button"
                                            onClick$={() => remove(pollForm, 'options', { at: index })}
                                            aria-label={`${_`Remove Option`} ${index + 1}`}
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

                {/* END DATE */}
                <div>
                    <Toggle label={_`Set an end date`} bind:checked={hasEndDate} />
                    <Field name="endDate">
                        {(field, props) => hasEndDate.value && (
                            <TextInput
                                {...props}
                                type="date"
                                label={_`End Date`}
                                value={field.value}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <p class="mt-2 text-sm text-gray-500">
                        {_`Specify when the poll will end. Participants will not be able to vote after this date.`}
                    </p>
                </div>

                {/* ANONYMOUS */}
                <div>
                    <Toggle label={_`Anonymous`} bind:checked={isAnonymous} />
                    <p class="mt-2 text-sm text-gray-500">
                        {isAnonymous.value
                            ? _`Your identity will be hidden as the creator of the poll.`
                            : _`Your username ${user.username} will be displayed as the creator of the poll.`}
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

            </div>

            <FormFooter of={pollForm} />
        </Form>
    );
});
