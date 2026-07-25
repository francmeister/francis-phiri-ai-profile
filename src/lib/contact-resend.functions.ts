import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

const ResendInput = z.object({
  id: z.string().uuid(),
  kind: z.enum(['notification', 'confirmation']),
})

export const resendContactEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((v) => ResendInput.parse(v))
  .handler(async ({ data, context }) => {
    // Verify admin role via authenticated client (RLS-scoped).
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    })
    if (roleErr) throw new Error('Role check failed')
    if (!isAdmin) throw new Error('Forbidden')

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')

    const { data: msg, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .eq('id', data.id)
      .single()
    if (error || !msg) throw new Error('Message not found')

    const suffix = `resend-${(msg.resend_count ?? 0) + 1}`

    let sentAt: string | null = null
    let sendError: string | null = null
    try {
      if (data.kind === 'notification') {
        const result = await sendTemplateEmail('contact-notification', 'francophiri97@gmail.com', {
          templateData: {
            name: msg.name,
            email: msg.email,
            organisation: msg.organisation ?? '',
            reason: msg.reason ?? '',
            message: msg.message,
          },
          idempotencyKey: `contact-notify-${msg.id}-${suffix}`,
          replyTo: msg.email,
        })
        if (result.sent) sentAt = new Date().toISOString()
        else sendError = `not sent: ${result.reason}`
      } else {
        const result = await sendTemplateEmail('contact-confirmation', msg.email, {
          templateData: { name: msg.name, message: msg.message },
          idempotencyKey: `contact-confirm-${msg.id}-${suffix}`,
        })
        if (result.sent) sentAt = new Date().toISOString()
        else sendError = `not sent: ${result.reason}`
      }
    } catch (err: any) {
      sendError = err?.message ?? String(err)
    }

    const patch: Record<string, any> = {
      resend_count: (msg.resend_count ?? 0) + 1,
    }
    if (data.kind === 'notification') {
      patch.notification_sent_at = sentAt
      patch.notification_error = sendError
    } else {
      patch.confirmation_sent_at = sentAt
      patch.confirmation_error = sendError
    }
    await supabaseAdmin.from('contact_messages').update(patch as never).eq('id', msg.id)

    return { sent: !!sentAt, error: sendError }
  })
