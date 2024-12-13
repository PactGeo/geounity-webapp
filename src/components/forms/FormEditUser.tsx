import { useForm, valiForm$, type SubmitHandler } from '@modular-forms/qwik';
import { FormFooter } from "./FormFooter";
import { $, component$ } from '@builder.io/qwik';
import { useUserFormLoader } from '~/shared/loaders';
import { useUserFormAction } from '~/shared/actions';
import type { UserResponseData } from '~/shared/actions';
import { MAX_BIO_LENGTH, MAX_LOCATION_LENGTH, MAX_NAME_LENGTH, MAX_USERNAME_LENGTH, MAX_WEBSITE_LENGTH, type UserForm, UserSchema } from '~/schemas';
import { TextInput2 } from '~/components/input/TextInput2';
import { TextArea } from '~/components/input/TextArea';

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
                {/* <Field name="banner">
                    {(field, props) => (
                        <div class="space-y-1">
                            <InputLabel name={field.name} label={field.name} />
                            <input
                                {...props}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-3"
                                placeholder={_`Enter a banner`}
                                type="file"
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
                                type="file"
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field> */}
                <Field name="username">
                    {(field, props) => (
                        <TextInput2
                            {...props}
                            class="space-y-1"
                            error={field.error}
                            label={field.name}
                            maxLength={MAX_USERNAME_LENGTH}
                            name={field.name}
                            required
                            value={field.value}
                        />
                    )}
                </Field>
                <Field name="name">
                    {(field, props) => (
                        <TextInput2
                            {...props}
                            class="space-y-1"
                            error={field.error}
                            label={field.name}
                            maxLength={MAX_NAME_LENGTH}
                            name={field.name}
                            required
                            value={field.value}
                        />
                    )}
                </Field>
                <Field name="bio">
                    {(field, props) => (
                        <TextArea
                            {...props}
                            class="space-y-1"
                            error={field.error}
                            label={field.name}
                            maxLength={MAX_BIO_LENGTH}
                            name={field.name}
                            required
                            value={field.value}
                        />
                    )}
                </Field>
                <Field name="location">
                    {(field, props) => (
                        <TextInput2
                            {...props}
                            class="space-y-1"
                            error={field.error}
                            label={field.name}
                            maxLength={MAX_LOCATION_LENGTH}
                            name={field.name}
                            required
                            value={field.value}
                        />
                    )}
                </Field>
                <Field name="website">
                    {(field, props) => (
                        <TextInput2
                            {...props}
                            class="space-y-1"
                            error={field.error}
                            label={field.name}
                            maxLength={MAX_WEBSITE_LENGTH}
                            name={field.name}
                            required
                            value={field.value}
                        />
                    )}
                </Field>
            </div>
            <FormFooter of={userForm} />
        </Form>
    )
});
