import { Textarea } from '~/components/ui';
import { useForm, valiForm$, type SubmitHandler } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { $, component$ } from '@builder.io/qwik';
import { useUserFormLoader } from '~/shared/loaders';
import { useUserFormAction } from '~/shared/actions';
import type { UserResponseData } from '~/shared/actions';
import { type UserForm, UserSchema } from '~/schemas';
import { InputLabel } from '~/components/input/InputLabel';

interface FormEditUserProps {
    onSubmitCompleted?: () => void;
}

export default component$<FormEditUserProps>(() => {
    const [userForm, { Form, Field }] = useForm<UserForm, UserResponseData>({
        loader: useUserFormLoader(),
        action: useUserFormAction(),
        validate: valiForm$(UserSchema),
    });

    const handleSubmit = $<SubmitHandler<UserForm>>((values, event) => {
        console.log('UserForm handleSubmit')
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
                <Field name="name">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} required />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a name`}
                                type="text"
                                required
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="bio">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <Textarea
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a bio`}
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="location">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a location`}
                                type="text"
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="website">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a website`}
                                type="text"
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="banner">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a banner`}
                                type="text"
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="image">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter an image`}
                                type="text"
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
                <Field name="username">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} required />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a username`}
                                type="text"
                                required
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
            </div>
            <FormFooter of={userForm} />
        </Form>
    )
});
