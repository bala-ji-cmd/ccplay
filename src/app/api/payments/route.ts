import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { supabase } from '@/lib/supabase';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
}); 

const PLANS = {
  'jj-fun-pack': {
    name: "CCPlay Fun Pack",
    price: 9.99,
    credits: 50,
    priceId: process.env.STRIPE_JJ_FUN_PACK_PRICE_ID
  },
  'yoyo-adventure-pack': {
    name: "CCPlay Creative Pack",
    price: 24.99,
    credits: 150,
    priceId: process.env.STRIPE_YOYO_ADVENTURE_PACK_PRICE_ID
  },
  'creative-galaxy-pack': {
    name: "CCPlay Creative Galaxy",
    price: 49.99,
    credits: -1, // Unlimited
    priceId: process.env.STRIPE_CREATIVE_GALAXY_PRICE_ID
    },
  'sparkle-unicorn-pack': {
    credits: 100,
    name: 'Sparkle Unicorn Pack',
    priceId: process.env.STRIPE_JJ_FUN_PACK_PRICE_ID
  },
  'dragon-adventure-pack': {
    credits: 250,
    name: 'Dragon Adventure Pack',
    priceId: process.env.STRIPE_YOYO_ADVENTURE_PACK_PRICE_ID
  }
};

export async function POST(req: Request) {
  try {
    const { session, planId, isAnnual } = await req.json();

    if (!session) {
      console.log('No session found')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: 'subscription',
      line_items: [{
        price: plan.priceId,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        planType: planId,
        credits: plan.credits.toString()
      }
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
} 