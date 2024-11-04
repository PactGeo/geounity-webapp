import { $, component$ } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useForm, valiForm$, type SubmitHandler } from "@modular-forms/qwik";
import { Select } from "~/components/input/Select";
import { FormFooter } from "~/components/forms/FormFooter";
import { _ } from "compiled-i18n";
import {dataArray as countries} from "~/data/countries";
import { useFormCountryLoader } from "~/shared/loaders";
import { useFormCountryAction } from "~/shared/actions";
import { type CountryForm, CountrySchema } from "~/schemas";

export { useGetTags } from '~/shared/loaders';


export default component$(() => {
    const nav = useNavigate();
    const [countryForm, { Form, Field }] = useForm<CountryForm>({
        loader: useFormCountryLoader(),
        action: useFormCountryAction(),
        validate: valiForm$(CountrySchema),
    });
    const handleSubmit = $<SubmitHandler<CountryForm>>((values, event) => {
        console.log('handleSubmit')
        console.log('values', values)
        console.log('event', event)
        return nav(`/national/${values.country}`)
        // Runs on client
    });
    const countriesOptions = countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))
    return (
        <div>
            <Form
                onSubmit$={handleSubmit}
                class="space-y-4 md:space-y-6 lg:space-y-8 w-[300px] m-auto mt-20"
            >
                <Field name="country">
                    {(field, props) => (
                        <Select
                            {...props}
                            label={_`Country`}
                            options={countriesOptions}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
                <FormFooter of={countryForm} />
            </Form>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Discussions",
    meta: [
        {
            name: "description",
            content: "Global Discussions description",
        },
    ],
};