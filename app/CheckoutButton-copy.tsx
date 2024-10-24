"use client";

import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import { supabaseAdmin } from "@/utils/superbaseServer";

export default function CheckoutButton() {
    const handleCheckout = async () => {
        const { data } = await supabase.auth.getUser();

        if (!data?.user) {
            toast.error(
                "Please log in to create a new Stripe Checkout session"
            );
            return;
        }

        const stripePromise = loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        const stripe = await stripePromise;
        const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                priceId: "price_1QCcvvIkICHjH1ItBqypVQnI",
                userId: data.user?.id,
                email: data.user?.email,
            }),
        });
        const session = await response.json();

        await stripe?.redirectToCheckout({ sessionId: session.id });
    };

    const handleSupabase = async () => {
        try {
            const response = await fetch("/api/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "16b3201f-2231-4133-a41c-4842c8879718",
                    stripe_customer_id: "sdfsf334",
                    subscription_id: "ggg34534",
                }),
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error upserting customer:", error);
        }
    };

    return (
        <div>
            <button onClick={handleSupabase}>Test Supabase</button>
        </div>
    );

    return (
        <div>
            <h1>Signup for a Plan</h1>
            <p>Clicking this button creates a new Stripe Checkout session</p>
            <button className="btn btn-accent" onClick={handleCheckout}>
                Buy Now
            </button>
            <button className="btn btn-accent" onClick={handleSupabase}>
                test
            </button>
        </div>
    );
}
