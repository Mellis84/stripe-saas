import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { user_id, stripe_customer_id, subscription_id } =
            await req.json();

        const { error } = await supabaseAdmin.from("stripe_customers").upsert({
            user_id,
            stripe_customer_id,
            subscription_id,
            plan_active: true,
            plan_expires: null,
        });

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ message: "Success" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
