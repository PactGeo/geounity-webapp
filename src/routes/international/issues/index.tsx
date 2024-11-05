import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useGetTags} from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";

export { useGetTags } from '~/shared/loaders';

export default component$(() => {
    const tags = useGetTags();
    const selectedTag = useStore({ id: 0, name: 'all' });
    return (
        <div>
            <NavResources />
            <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Global Issues</h1>
            
            {/* Global Responsibility Note */}
            <div id="global-note" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f8ff", borderLeft: "5px solid #007BFF" }}>
                <strong>Global Responsibility:</strong>
                <p>
                    By addressing a global issue, you are contributing to a cause that requires collective effort and collaboration from everyone. Tackling these challenges demands our shared responsibility to create meaningful and lasting change worldwide.
                </p>
            </div>
            
            {/* Motivational Message */}
            <div id="motivational-message" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderLeft: "5px solid #ffc107" }}>
                <strong>Join the Collective Effort:</strong>
                <p>
                    Global issues such as climate change, pandemics, and human rights violations affect us all. Your participation is crucial in fostering international cooperation and driving initiatives that can make a significant impact on a global scale.
                </p>
            </div>
            
            {/* Call to Action */}
            <div id="call-to-action" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#d4edda", borderLeft: "5px solid #28a745" }}>
                <strong>Take Action:</strong>
                <p>
                    Engage with like-minded individuals and organizations to advocate for solutions that transcend national boundaries. Together, we can address these pressing issues and build a better future for everyone.
                </p>
            </div>
            
            {/* List of Tags or Related Resources */}
            <div id="tags-section" style={{ marginTop: "30px" }}>
                <h2>Related Tags</h2>
                <ListTags tags={tags.value} selectedTag={selectedTag} />
            </div>
        </div>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Issues",
    meta: [
        {
            name: "description",
            content: "Global Issues description",
        },
    ],
};