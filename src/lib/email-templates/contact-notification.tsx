import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  organisation?: string
  reason?: string
  message?: string
}

const ContactNotificationEmail = ({
  name = 'Anonymous',
  email = 'unknown',
  organisation = '',
  reason = '',
  message = '',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact form submission</Heading>
        <Text style={text}>You received a new message from your website.</Text>
        <Hr style={hr} />
        <Text style={row}><strong>Name:</strong> {name}</Text>
        <Text style={row}><strong>Email:</strong> {email}</Text>
        {organisation && <Text style={row}><strong>Organisation:</strong> {organisation}</Text>}
        {reason && <Text style={row}><strong>Reason:</strong> {reason}</Text>}
        <Hr style={hr} />
        <Text style={row}><strong>Message</strong></Text>
        <Text style={messageStyle}>{message}</Text>
        <Hr style={hr} />
        <Text style={footer}>Reply directly to this email to respond to {name}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (d: Record<string, any>) => `New contact: ${d.name || 'Anonymous'}${d.reason ? ` — ${d.reason}` : ''}`,
  displayName: 'Contact form notification (to you)',
  to: 'francophiri97@gmail.com',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    organisation: 'Acme University',
    reason: 'phd',
    message: 'Hi Francis, I would like to discuss a PhD opportunity.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0b1220', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 16px' }
const row = { fontSize: '14px', color: '#0b1220', margin: '6px 0' }
const messageStyle = { fontSize: '14px', color: '#0b1220', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, margin: '0 0 16px' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '20px 0 0' }
