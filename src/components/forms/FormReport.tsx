import { $, component$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { TextArea } from "~/components/input/TextArea";
import { TextInput } from "~/components/input/TextInput";
import { Select } from "~/components/input/Select";
import type { SubmitHandler } from "@modular-forms/qwik";
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { type ReportForm, ReportSchema } from "~/schemas/reportSchema";
import styles from "./form.css?inline";
import { useFormReportLoader } from "~/shared/loaders";
import { type ReportResponseData, useFormReportAction } from "~/shared/actions";

export { useFormReportLoader } from '~/shared/loaders';
export { useFormReportAction } from '~/shared/actions';

interface FormReportProps {
    content_id: number;
    onSubmitCompleted?: () => void;
}

export default component$<FormReportProps>(({ content_id }) => {
    useStyles$(styles);

    const [reportForm, { Form, Field }] = useForm<ReportForm, ReportResponseData>({
        loader: useFormReportLoader(),
        action: useFormReportAction(),
        validate: valiForm$(ReportSchema),
    });

    const contentId = useSignal(content_id);

    useTask$(({ track }) => {
        track(() => contentId)
        setValue(reportForm, 'content_id', String(contentId.value));
    })

    const handleSubmit = $<SubmitHandler<any>>((values) => {
        console.log("Report submitted:", values);
    });

    return (
        <Form onSubmit$={handleSubmit} class="space-y-6">
            <div class="space-y-6">
                {/* Content ID */}
                <Field name="content_id" type="string">
                    {(field, props) => (
                        <div class="hidden">
                            <TextInput
                                {...props}
                                error={field.error}
                                label={_`Content ID`}
                                maxLength={50}
                                placeholder={_`Enter the ID of the content being reported`}
                                value={String(content_id)}
                                required
                            />
                        </div>
                    )}
                </Field>

                {/* Content Type */}
                <Field name="content_type" type="string">
                    {(field, props) => (
                        <Select
                            {...props}
                            options={[
                                { value: "poll", name: _`Poll` },
                                { value: "debate", name: _`Debate` },
                                { value: "project", name: _`Project` },
                            ]}
                            error={field.error}
                            label={_`Content Type`}
                            value={String(field.value)}
                            required
                        />
                    )}
                </Field>

                {/* Reason */}
                <Field name="reason" type="string">
                    {(field, props) => (
                        <Select
                            {...props}
                            options={[
                                { value: "offensive", name: _`Offensive Content` },
                                { value: "spam", name: _`Spam` },
                                { value: "misinformation", name: _`Misinformation` },
                            ]}
                            error={field.error}
                            label={_`Reason`}
                            value={String(field.value)}
                            required
                        />
                    )}
                </Field>

                {/* Description */}
                <Field name="description" type="string">
                    {(field, props) => (
                        <TextArea
                            {...props}
                            error={field.error}
                            label={_`Description (Optional)`}
                            maxLength={500}
                            placeholder={_`Provide more details about the issue`}
                            value={field.value}
                        />
                    )}
                </Field>
            </div>

            <FormFooter of={reportForm} />
        </Form>
    );
});
