import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const Schema = z.object({
  documentId: z.string().uuid(),
  documentTitle: z.string().trim().min(1).max(300),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  organisation: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
})

export const Route = createFileRoute('/api/public/document-request')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown
        try {
          payload = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const parsed = Schema.safeParse(payload)
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid input', details: parsed.error.flatten() },
            { status: 400 },
          )
        }
        const data = parsed.data

        const composedMessage =
          `Document requested: ${data.documentTitle}\n` +
          `Document ID: ${data.documentId}\n\n` +
          (data.message ? `Note from requester:\n${data.message}\n` : 'No additional note provided.\n')

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        let submissionId: string | undefined
        try {
          const { data: inserted, error } = await supabaseAdmin
            .from('contact_messages')
            .insert({
              name: data.name,
              email: data.email,
              organisation: data.organisation || null,
              reason: `Document request: ${data.documentTitle}`,
              message: composedMessage,
            })
            .select('id')
            .single()
          if (error) throw error
          submissionId = inserted?.id
        } catch (err) {
          console.error('document-request insert failed', err)
          return Response.json({ error: 'Could not save your request' }, { status: 500 })
        }

        const idBase = submissionId ?? crypto.randomUUID()

        let notificationError: string | null = null
        let notificationSentAt: string | null = null
        try {
          const result = await sendTemplateEmail('contact-notification', 'francophiri97@gmail.com', {
            templateData: {
              name: data.name,
              email: data.email,
              organisation: data.organisation || '',
              reason: `Document request: ${data.documentTitle}`,
              message: composedMessage,
            },
            idempotencyKey: `doc-req-notify-${idBase}`,
            replyTo: data.email,
          })
          if (result.sent) notificationSentAt = new Date().toISOString()
          else notificationError = `not sent: ${result.reason}`
        } catch (err: any) {
          notificationError = err?.message ?? String(err)
          console.error('doc-request notification failed', err)
        }

        let confirmationError: string | null = null
        let confirmationSentAt: string | null = null
        try {
          const result = await sendTemplateEmail('contact-confirmation', data.email, {
            templateData: {
              name: data.name,
              message:
                `Thank you for requesting "${data.documentTitle}". ` +
                `Francis will review your request and send the document to ${data.email} shortly.` +
                (data.message ? `\n\nYour note:\n${data.message}` : ''),
            },
            idempotencyKey: `doc-req-confirm-${idBase}`,
          })
          if (result.sent) confirmationSentAt = new Date().toISOString()
          else confirmationError = `not sent: ${result.reason}`
        } catch (err: any) {
          confirmationError = err?.message ?? String(err)
          console.error('doc-request confirmation failed', err)
        }

        if (submissionId) {
          await supabaseAdmin
            .from('contact_messages')
            .update({
              notification_sent_at: notificationSentAt,
              notification_error: notificationError,
              confirmation_sent_at: confirmationSentAt,
              confirmation_error: confirmationError,
            } as never)
            .eq('id', submissionId)
        }

        return Response.json({ ok: true })
      },
    },
  },
})
