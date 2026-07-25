import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  message?: string
}

const ContactConfirmationEmail = ({ name = 'there', message = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out — Francis Phiri</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks for reaching out, {name}</Heading>
        <Text style={text}>
          I've received your message and will get back to you personally as soon
          as I can — usually within a couple of days.
        </Text>
        {message && (
          <>
            <Text style={label}>Your message</Text>
            <Text style={quote}>{message}</Text>
          </>
        )}
        <Hr style={hr} />
        <Text style={text}>
          In the meantime, feel free to explore my work at{' '}
          <a href="https://francis-phiri.co.za" style={link}>francis-phiri.co.za</a>.
        </Text>
        <Text style={signature}>
          — Francis Phiri<br />
          Data Engineer · Software Developer · ML Researcher
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: "Thanks for reaching out — Francis Phiri",
  displayName: 'Contact form confirmation (to sender)',
  previewData: {
    name: 'Jane',
    message: 'Hi Francis, I would like to discuss a PhD opportunity.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0b1220', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const label = { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '16px 0 6px' }
const quote = { fontSize: '14px', color: '#0b1220', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, borderLeft: '3px solid #14b8a6', padding: '8px 12px', margin: '0 0 16px', backgroundColor: '#f8fafc' }
const link = { color: '#0d9488', textDecoration: 'underline' }
const signature = { fontSize: '13px', color: '#0b1220', margin: '20px 0 0', lineHeight: '1.5' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
