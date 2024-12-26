import { component$, Slot, useSignal, useStyles$ } from "@builder.io/qwik";
import { LuExpand, LuShrink, LuEye, LuX } from "@qwikest/icons/lucide";
import { Modal, Separator } from '~/components/ui';
import styles from "./modal.css?inline";

interface ModalProps {
    trigger?: string;
    title?: string;
    description?: string;
    isOpen?: {
        value: boolean;
    };
    onClickPreview?: () => void;
    showFooter?: boolean;
    onClose?: () => void;
    onClickExpand?: () => void;
}

export default component$<ModalProps>((props) => {
    useStyles$(styles);
    const isOpen = props.isOpen || useSignal(false);
    const isPreview = useSignal(false);
    const isExpanded = useSignal(false);

    return (
        <Modal.Root bind:show={isOpen}>
            {props.trigger && (
                <Modal.Trigger class="modal-trigger">{props.trigger}</Modal.Trigger>
            )}
            <Modal.Panel
                class={`modal-panel ${isExpanded.value ? 'modal-expanded' : ''}`}
            >
                {/* Header */}
                <div class="modal-header flex justify-between items-center gap-4 p-4">
                    <Modal.Title class="modal-title">{props.title}</Modal.Title>
                    <div class="flex items-center gap-3">
                        {!!props.onClickPreview && (
                            <LuEye
                                class="text-xl cursor-pointer hover:text-blue-500"
                                onClick$={() => isPreview.value = !isPreview.value}
                            />
                        )}
                        {props.onClickExpand && (
                            <button
                                class="modal-icon"
                                aria-label={isExpanded.value ? "Shrink Modal" : "Expand Modal"}
                                title={isExpanded.value ? "Shrink Modal" : "Expand Modal"}
                                onClick$={() => isExpanded.value = !isExpanded.value}
                            >
                                {isExpanded.value ? (
                                    <LuShrink class="text-lg hover:text-green-500" />
                                ) : (
                                    <LuExpand class="text-lg hover:text-green-500" />
                                )}
                            </button>
                        )}
                        <Modal.Close>
                            <LuX
                                class="text-2xl rounded-full hover:text-red-500 hover:bg-gray-200 p-1"
                                aria-label="Close Modal"
                            />
                        </Modal.Close>
                    </div>
                </div>

                {/* Separator */}
                <Separator orientation="horizontal" class="mb-4" />

                {/* Description */}
                {props.description && (
                    <Modal.Description class="modal-description">
                        {props.description}
                    </Modal.Description>
                )}

                {/* Slot Content */}
                <div class="modal-content">
                    <Slot />
                </div>
            </Modal.Panel>
        </Modal.Root>
    );
});
