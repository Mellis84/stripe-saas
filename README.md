This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Services

Hooked up services / integrations:

-   [Stripe](https://stripe.com/gb) - Payment methods. - Create metered product - Recurring, pricing model (usage-based - per tier, 1 - 5 flat fee, more than 5, £4 per unit) - Create One-time setup fee product too.
-   [Supabase](https://supabase.com/dashboard/projects) - Database storage.

Create the necessary database tables by pasting this code into the Supabase SQL editor:

```
create table
  public.stripe_customers (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null,
    stripe_customer_id text not null,
    total_downloads integer null default 0,
    plan_active boolean not null default false,
    plan_expires bigint null,
    subscription_id text null,
    constraint stripe_customers_pkey primary key (id),
    constraint stripe_customers_stripe_customer_id_key unique (stripe_customer_id),
    constraint stripe_customers_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;

create table
  public.downloads (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null,
    ts timestamp without time zone null default now(),
    image text null,
    constraint downloads_pkey primary key (id),
    constraint downloads_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;
```

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
