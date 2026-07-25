import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  organisation: z.string().trim().max(200).optional().default(''),
  reason: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().min(1).max(5000),
})

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown
        try {
          payload = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const parsed = ContactSchema.safeParse(payload)
        if (!parsed.success) {
          return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
        }
        const data = parsed.data

        // Insert into DB via service role (public form, no user session).
        let submissionId: string | undefined
        try {
          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { data: inserted, error } = await supabaseAdmin
            .from('contact_messages')
            .insert({
              name: data.name,
              email: data.email,
              organisation: data.organisation || null,
              reason: data.reason || null,
              message: data.message,
            })
            .select('id')
            .single()
          if (error) throw error
          submissionId = inserted?.id
        } catch (err) {
          console.error('contact insert failed', err)
          return Response.json({ error: 'Could not save your message' }, { status: 500 })
        }

        const idBase = submissionId ?? crypto.randomUUID()

        // Notification to Francis
        try {
          await sendTemplateEmail('contact-notification', 'francophiri97@gmail.com', {
            templateData: data,
            idempotencyKey: `contact-notify-${idBase}`,
            replyTo: data.email,
          })
        } catch (err) {
          console.error('contact-notification send failed', err)
        }

        // Confirmation to sender
        try {
          await sendTemplateEmail('contact-confirmation', data.email, {
            templateData: { name: data.name, message: data.message },
            idempotencyKey: `contact-confirm-${idBase}`,
          })
        } catch (err) {
          console.error('contact-confirmation send failed', err)
        }

        return Response.json({ ok: true })
      },
    },
  },
})
