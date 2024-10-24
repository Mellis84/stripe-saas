import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { supabaseAdmin } from "@/utils/superbaseServer";
import { stripe } from "@/utils/stripe";

// To run webhook locally, run the stripe cli in the background
// stripe listen -e customer.subscription.updated,customer.subscription.deleted,checkout.session.completed --forward-to http://localhost:3000/api/webhook

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature!,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (error: any) {
            console.error(
                `Webhook signature verification failed: ${error.message}`
            );
            return NextResponse.json(
                { message: "Webhook Error" },
                { status: 400 }
            );
        }

        // Handle the checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session: Stripe.Checkout.Session = event.data.object;
            const userId = session.metadata?.user_id;

            console.log("Checkout session completed before CUUUNT:", session);

            // Create or update the stripe_customer_id in the stripe_customers table in supabase
            const { error } = await supabaseAdmin
                .from("stripe_customers")
                .upsert({
                    user_id: userId,
                    stripe_customer_id: session.customer,
                    subscription_id: session.subscription,
                    plan_active: true,
                    plan_expires: null,
                });

            console.log("Checkout session completed AFTER CUUUNT:", session);

            if (error) {
                console.error("Supabase upsert error:", error);
            }
        }

        if (event.type === "customer.subscription.updated") {
        }

        if (event.type === "customer.subscription.deleted") {
        }

        return NextResponse.json({ message: "success" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
