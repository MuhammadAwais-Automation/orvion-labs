import { Inngest, EventSchemas } from "inngest";

// Define the event types and their payloads
type Events = {
    "app/test.run.requested": {
        data: {
            projectId: string;
            testCaseIds: string[];
            runId: string;
        };
    };
};

// Create the Inngest client
export const inngest = new Inngest({
    id: "orvion-labs",
    schemas: new EventSchemas().fromRecord<Events>()
});
