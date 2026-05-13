'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Ensure root@voxflow.ai has unlimited credits
  if (signInData.user && signInData.user.email === 'root@voxflow.ai') {
    await supabase
      .from('profiles')
      .upsert({ 
        id: signInData.user.id, 
        email: signInData.user.email,
        role: 'Admin',
        credit_balance: 9999 
      })
  }

  // AUDIT & NOTIFICATION: If VIP Creator logs in, fire Discord Webhook
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', signInData.user.id).single();
  if (profile?.role === 'VIP_Creator' && process.env.DISCORD_ADMIN_WEBHOOK) {
    try {
      await fetch(process.env.DISCORD_ADMIN_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `💎 **VIP CREATOR LOGIN** 💎\n\n**Email**: ${signInData.user.email}\n**Time**: ${new Date().toLocaleString()}\n\nMonitor session: https://voxflow.studio/admin_vxf`
        })
      });
    } catch (e) { console.error("Webhook failed", e); }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data)

  if (error) {
    if (error.message.includes('rate limit exceeded')) {
      return { 
        error: "Email rate limit exceeded. Please disable 'Confirm Email' in Supabase Dashboard (Authentication -> Providers -> Email) to bypass this for testing." 
      }
    }
    return { error: error.message }
  }

    // 1. Check for Promo Code
    const referralCode = formData.get('referralCode') as string;
    let bonusCredits = 0;
    
    if (referralCode) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code_name', referralCode.toUpperCase())
        .single();
      
      if (promo) {
        bonusCredits = promo.reward_amount;
        // Increment total uses
        await supabase
          .from('promo_codes')
          .update({ total_uses: (promo.total_uses || 0) + 1 })
          .eq('id', promo.id);
      }
    }

    if (signUpData.user) {
      const isUnlimited = signUpData.user.email === 'root@voxflow.ai';
      const initialCredits = (isUnlimited ? 9999 : 2) + bonusCredits;

      await supabase
        .from('profiles')
        .insert({ 
          id: signUpData.user.id, 
          email: signUpData.user.email,
          credit_balance: initialCredits,
          referred_by_code: referralCode || null
        });

      // 2. Log to Ledger if bonus applied
      if (bonusCredits > 0) {
        await supabase.from('credit_ledger').insert({
          user_id: signUpData.user.id,
          amount: bonusCredits,
          action_type: 'PROMO_REDEEM',
          description: `Promo Code ${referralCode} redeemed during signup.`
        });
      }
    }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
