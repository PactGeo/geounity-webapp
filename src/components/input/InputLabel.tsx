import { component$ } from "@builder.io/qwik";
import clsx from "clsx";
import { capitalizeFirst } from "~/utils";

type InputLabelProps = {
    name: string;
    label?: string;
    required?: boolean;
    margin?: "none";
};

/**
 * Input label for a form field.
 */
export const InputLabel = component$(
    ({ name, label, required, margin }: InputLabelProps) => (
        <>
            {label && (
                <label
                    class={clsx(
                        "inline-block font-medium md:text-lg lg:text-xl",
                        !margin && "mb-2 lg:mb-3",
                    )}
                    for={name}
                >
                    {capitalizeFirst(label)}{" "}
                    {required && (
                        <span class="ml-1 text-red-600 dark:text-red-400">*</span>
                    )}
                </label>
            )}
        </>
    ),
);
