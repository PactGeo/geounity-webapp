import { component$ } from '@builder.io/qwik';
import type { JSXOutput } from '@builder.io/qwik';
import { Modal } from '@qwik-ui/headless';
import { _ } from 'compiled-i18n';
import { LuAlertCircle } from '@qwikest/icons/lucide';

interface ConfirmationModalProps {
    title: string;
    description: string;
    isOpen: {
        value: boolean;
    };
    trigger?: JSXOutput | string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal = component$<ConfirmationModalProps>(({
    title,
    description,
    isOpen,
    trigger,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal.Root bind:show={isOpen}>
            {trigger && (
                <Modal.Trigger class="cursor-pointer">
                    {trigger}
                </Modal.Trigger>
            )}

            <Modal.Panel class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div class="flex items-center mb-4">
                    <LuAlertCircle class="text-red-500 w-8 h-8 mr-3" />
                    <Modal.Title class="text-lg font-semibold text-gray-800">{title}</Modal.Title>
                </div>
                <Modal.Description class="text-gray-600 mb-4">
                    {description}
                </Modal.Description>

                {/* Información adicional */}
                <div class="bg-gray-100 p-3 rounded mb-4 text-sm text-gray-700">
                    <p>{_`This action will permanently delete the selected item. Please ensure you want to proceed.`}</p>
                </div>

                <div class="flex justify-end space-x-2">
                    <button
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick$={() => {
                            isOpen.value = false;
                            onCancel();
                        }}
                    >
                        {_`Cancel`}
                    </button>
                    <button
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick$={() => {
                            isOpen.value = false;
                            onConfirm();
                        }}
                    >
                        {_`Confirm`}
                    </button>
                </div>
            </Modal.Panel>
        </Modal.Root>
    );
});
