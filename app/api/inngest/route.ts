import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { executeTestSuite } from "@/app/inngest/test-runner";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        executeTestSuite,
    ],
});
