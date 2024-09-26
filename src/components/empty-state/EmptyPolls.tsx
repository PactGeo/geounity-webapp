import { component$ } from "@builder.io/qwik";
import { LuList } from "@qwikest/icons/lucide";
import { Button } from '~/components/ui';

interface EmptyPollsProps {
    onClickAction: () => void;
}

export default component$<EmptyPollsProps>(({ onClickAction }) => {
    return (
        <div class="w-full max-w-md mx-auto border mt-12">
            <div class="flex flex-col items-center justify-center space-y-4 text-center p-6">
                <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <LuList class="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 class="text-lg font-semibold">There are no polls in the list</h3>
                <p class="text-sm text-muted-foreground">
                    No one seems to have created any discussions for this community, why don't you start by adding one?
                </p>
                <Button
                    look="primary"
                    onClick$={onClickAction}
                >
                    Create New Poll
                </Button>
            </div>
        </div>
    )
})