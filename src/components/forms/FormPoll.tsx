import { $, component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { Form } from '@builder.io/qwik-city';
import { Button, Input, Label, Select, Textarea } from '~/components/ui';
import { LuCheck, LuLoader2, LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { usePostPoll } from "~/shared/loaders";
import styles from "./form.css?inline";
import InputFile from "~/components/input/InputFile";

interface FormPollProps {
    onSubmitCompleted?: () => void;
    tags: { id: string, name: string }[];
}

export default component$<FormPollProps>(({ onSubmitCompleted, tags }) => {
    useStyles$(styles);

    const isLoading = useSignal(false);
    const isPreview = useSignal(false);
    const title = useSignal('');
    const description = useSignal('');
    const file_example = useSignal<string>('https://images.unsplash.com/photo-1724963475892-a3274091955e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    const display = useSignal<string[]>([]);
    const creatorId = useSignal(1);  // Ejemplo de ID de creador
    const communityId = useSignal(1); // Ejemplo de ID de comunidad
    const showPreview = useSignal(false);
    const newPoll = useStore({
        type: 'single_choice',
        title: '',
        description: '',
        options: ['', ''],
        community: '',
        endDate: '',
    });

    const action = usePostPoll();

    const removeOption = $((index: number) => {
        if (newPoll.type !== 'binary') {
            const newOptions = newPoll.options.filter((_, i) => i !== index)
            newPoll.options = newOptions
        }
    })
    const addOption = $(() => {
        if (newPoll.type !== 'binary') {
            newPoll.options = [...newPoll.options, '']
        }
    })

    console.log('=============')
    console.log(action.value?.fieldErrors)

    return (
        <Form
            action={action}
        // onSubmitCompleted$={() => {
        //     isLoading.value = false;
        //     !action.value?.failed && onSubmitCompleted && onSubmitCompleted();
        // }}
        >
            <input type="hidden" name="status" value="OPEN" />
            <input type="hidden" name="community_id" value={communityId.value} />
            <input type="hidden" name="is_anonymous" value="false" />
            <input type="hidden" name="allow_multiple_votes" value="false" />
            <div class="mb-4">
                <label for="poll_type" class="block text-sm font-medium text-gray-700">Tipo de encuesta</label>
                <select
                    id="poll_type"
                    name="poll_type"
                    value={newPoll.type}
                    onInput$={e => newPoll.type = (e.target as HTMLSelectElement).value}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                    <option value="single_choice">Selección Única - Los participantes eligen una opción</option>
                    <option value="multiple">Selección Múltiple - Los participantes pueden elegir varias opciones</option>
                    <option value="binary">Selección Binaria - Los participantes eligen entre dos opciones</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPoll.title}
                    onInput$={(e) => newPoll.title = (e.target as HTMLSelectElement).value}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    value={newPoll.description}
                    onInput$={(e) => newPoll.description = (e.target as HTMLSelectElement).value}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    rows={3}
                ></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Opciones</label>
                {newPoll.options.map((option, index) => (
                    <div key={index} class="flex items-center mt-2">
                        <input
                            type="text"
                            name="options[]"
                            value={option}
                            onInput$={(e) => {
                                const newOptions = [...newPoll.options]
                                newOptions[index] = (e.target as HTMLSelectElement).value
                                newPoll.options = newOptions
                            }}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder={`Opción ${index + 1}`}
                            required
                        />
                        {newPoll.type !== 'binary' && (
                            <button
                                type="button"
                                onClick$={() => removeOption(index)}
                                class="ml-2 text-red-500 hover:text-red-700"
                            >
                                <LuMinus />
                            </button>
                        )}
                    </div>
                ))}
                {newPoll.type !== 'binary' && (
                    <button
                        type="button"
                        onClick$={addOption}
                        class="mt-2 text-blue-500 hover:text-blue-700"
                    >
                        <LuPlus />
                    </button>
                )}
            </div>
            <div class="mb-4">
                <label for="community" class="block text-sm font-medium text-gray-700">Comunidad</label>
                <input
                    type="text"
                    id="community"
                    value={newPoll.community}
                    onInput$={(e) => newPoll.community = (e.target as HTMLSelectElement).value}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div class="mb-4">
                <label for="endDate" class="block text-sm font-medium text-gray-700">Fecha de finalización (opcional)</label>
                <input
                    type="date"
                    id="endDate"
                    name="ends_at"
                    value={newPoll.endDate}
                    onInput$={(e) => newPoll.endDate = (e.target as HTMLSelectElement).value}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>
            <div class="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick$={() => showPreview.value = true}
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Vista Previa
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Crear Encuesta
                </button>
                <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
            </div>
            {showPreview.value && (
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                        <h3 class="text-xl font-bold mb-4">Vista Previa de la Encuesta</h3>
                        <div class="mb-4">
                            <h4 class="font-bold">{newPoll.title}</h4>
                            <p>{newPoll.description}</p>
                        </div>
                        <div class="mb-4">
                            <h5 class="font-semibold">Opciones:</h5>
                            <ul class="list-disc list-inside">
                                {newPoll.options.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        </div>
                        <p>Comunidad: {newPoll.community}</p>
                        <p>Tipo: {newPoll.type === 'single_choice' ? 'Selección Única' : newPoll.type === 'multiple' ? 'Selección Múltiple' : 'Selección Binaria'}</p>
                        <p>Fecha de finalización: {newPoll.endDate || 'Sin fecha de finalización'}</p>
                        <button
                            onClick$={() => showPreview.value = false}
                            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Cerrar Vista Previa
                        </button>
                    </div>
                </div>
            )}
        </Form>
    );
});
