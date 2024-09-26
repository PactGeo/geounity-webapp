import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./table-debates.css?inline";

interface Debate {
    id: string;
    title: string;
    creator_name: string;
    created_at: string;
    comments_count: number;
    last_comment_at: string;
    tags: string[];
}

interface TableDebatesProps {
    debates: Debate[];
}

export default component$<TableDebatesProps>(({ debates }) => {
    useStyles$(styles);

    return (
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="text-left p-4 border-b">Title</th>
                        <th class="text-left p-4 border-b">Creator</th>
                        <th class="text-left p-4 border-b">Created At</th>
                        <th class="text-left p-4 border-b">Comments</th>
                        <th class="text-left p-4 border-b">Last Comment At</th>
                        <th class="text-left p-4 border-b">Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {debates.map((debate) => (
                        <tr key={`debate-${debate.id}`} class="hover:bg-gray-50">
                            <td class="p-4 border-b">{debate.title}</td>
                            <td class="p-4 border-b">{debate.creator_name}</td>
                            <td class="p-4 border-b">{new Date(debate.created_at).toLocaleDateString()}</td>
                            <td class="p-4 border-b">{debate.comments_count} comments</td>
                            <td class="p-4 border-b">{new Date(debate.last_comment_at).toLocaleDateString()}</td>
                            <td class="p-4 border-b">
                                {debate.tags.map((tag) => (
                                    <span key={tag} class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded mr-2">
                                        {tag}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
