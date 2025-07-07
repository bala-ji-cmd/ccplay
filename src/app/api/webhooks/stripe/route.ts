import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import logger from '@/lib/server-logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

export async function POST(req: Request) {
  logger.info('[stripe webhook] received request');
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    logger.error(error, '[stripe webhook] signature verification failed');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
  logger.info({ eventType: event.type }, '[stripe webhook] event received');

  const supabase = createRouteHandlerClient({ cookies });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    logger.info({ sessionId: session.id, userId: session.metadata?.userId }, '[stripe webhook] handling checkout session completed');
    
    // Create or update subscription in your database
    const subscriptionData = {
      user_id: session.metadata?.userId,
      plan_type: session.metadata?.planType,
      credits_left: parseInt(session.metadata?.credits || '0'),
      stripe_subscription_id: session.subscription as string,
      plan_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      sub_status: 'active'
    };
    logger.info({ subscriptionData }, '[stripe webhook] upserting subscription');
    const { error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData);

    if (error) {
      logger.error(error, '[stripe webhook] subscription creation error');
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }
    logger.info('[stripe webhook] successfully created subscription');
  }

  return NextResponse.json({ received: true });
} 