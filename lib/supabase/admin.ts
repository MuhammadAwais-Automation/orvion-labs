import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Diagnostic Logging
    if (!supabaseUrl) {
        console.error('[ADMIN CLIENT ERROR] NEXT_PUBLIC_SUPABASE_URL is undefined.');
    }
    if (!supabaseServiceKey) {
        console.error('[ADMIN CLIENT ERROR] SUPABASE_SERVICE_ROLE_KEY is undefined.');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
            'CRITICAL: Supabase Admin Environment Variables are missing. ' +
            'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file and restart the server.'
        );
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
