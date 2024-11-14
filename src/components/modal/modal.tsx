import { component$, Slot, useSignal, useStyles$ } from "@builder.io/qwik";
import { LuExpand, LuEye, LuX } from "@qwikest/icons/lucide";
import { Button, Modal, Separator } from '~/components/ui';
import styles from "./modal.css?inline";
// import { Modal } from '@qwik-ui/headless';

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
    const show = useSignal(false)
    const isPreview = useSignal(false);
    return (
        <Modal.Root bind:show={isOpen}>
            {props.trigger && <Modal.Trigger class="modal-trigger">{props.trigger}</Modal.Trigger>}
            <Modal.Panel class="modal-panel pt-2">
                <div class="flex justify-between items-center gap-2 py-2">
                    <div class="flex items-center gap-2">
                        {!!props.onClickPreview && <LuEye 
                            class="text-xl cursor-pointer" 
                            onClick$={() => isPreview.value = !isPreview.value} 
                            />}
                        {props.onClickExpand && <Modal.Close onClick$={props.onClickExpand}><LuExpand class="text-lg" /></Modal.Close>}
                    </div>
                    <div class="flex items-center gap-2">
                        <Modal.Close><LuX class="text-2xl"/></Modal.Close>
                    </div>
                </div>
                <Separator orientation="horizontal" class="mb-2" />
                {props.title && <Modal.Title class="modal-title">{props.title}</Modal.Title>}
                {props.description && (
                    <Modal.Description class="modal-description">
                        {props.description}
                    </Modal.Description>
                )}
                <Slot />
            </Modal.Panel>
        </Modal.Root>
    );
    return (
        <Modal.Root bind:show={show}>
            <Modal.Trigger>Open modal</Modal.Trigger>
            <Modal.Panel>
                <Modal.Title>Title</Modal.Title>
                <Modal.Description>Description</Modal.Description>
                <div>...</div>
                <footer>
                <Button look="primary" onClick$={() => (show.value = false)}>
                    Save
                </Button>
                </footer>
                <Modal.Close>
                <LuX class="h-5 w-5" />
                </Modal.Close>
            </Modal.Panel>
        </Modal.Root>
    
    )
});

