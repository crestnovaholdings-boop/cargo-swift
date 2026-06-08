import React from 'react'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr, Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  recipientName?: string
  trackingNumber?: string
  origin?: string
  destination?: string
  eta?: string
  serviceType?: string
  statusLabel?: string
  message?: string
  trackingUrl?: string
}

const Email = ({
  recipientName,
  trackingNumber = '',
  origin = '',
  destination = '',
  eta = '',
  serviceType = '',
  statusLabel = '',
  message = '',
  trackingUrl = '',
}: Props) => {
  const paragraphs = (message || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your shipment {trackingNumber} from Worldwide Cargo Transit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>Worldwide Cargo Transit</Heading>
            <Text style={tagline}>Global Logistics. Delivered with Precision.</Text>
          </Section>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              {recipientName ? `Hello ${recipientName},` : 'Hello,'}
            </Heading>

            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <Text key={i} style={paragraph}>{p}</Text>
              ))
            ) : (
              <Text style={paragraph}>
                A shipment has been registered for you with Worldwide Cargo Transit. Details are below.
              </Text>
            )}

            <Section style={detailsBox}>
              <Row label="Tracking #" value={trackingNumber} bold />
              {statusLabel && <Row label="Status" value={statusLabel} />}
              {serviceType && <Row label="Service" value={serviceType} />}
              {origin && <Row label="Origin" value={origin} />}
              {destination && <Row label="Destination" value={destination} />}
              {eta && <Row label="ETA" value={eta} />}
            </Section>

            {trackingUrl && (
              <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
                <Button href={trackingUrl} style={button}>Track your shipment</Button>
              </Section>
            )}

            <Hr style={hr} />
            <Text style={small}>
              Questions? Reply to this email or call <Link href="tel:+12029689946" style={link}>+202-968-9946</Link>.
            </Text>
          </Section>

          <Text style={footer}>
            © {new Date().getFullYear()} Worldwide Cargo Transit · worldwidecargotransit.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <Text style={{ ...rowStyle, fontWeight: bold ? 700 : 400 }}>
    <span style={rowLabel}>{label}</span>
    <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    d?.subject || `Shipment ${d?.trackingNumber ?? ''} — Worldwide Cargo Transit`,
  displayName: 'Shipment notification',
  previewData: {
    recipientName: 'Jane Doe',
    trackingNumber: 'WWCT12345',
    origin: 'New York, USA',
    destination: 'London, UK',
    eta: 'Jun 15, 2026',
    serviceType: 'Air Freight',
    statusLabel: 'Picked Up',
    message:
      "Your package has been picked up and is on its way.\n\nYou can follow live updates using the tracking link below.",
    trackingUrl: 'https://worldwidecargotransit.com/tracking/WWCT12345',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }
const header = { textAlign: 'center' as const, padding: '16px 0 24px' }
const brand = { fontSize: '22px', fontWeight: 800 as const, color: '#0c2340', margin: '0 0 4px', letterSpacing: '-0.01em' }
const tagline = { fontSize: '12px', color: '#6b7280', margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
const card = { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '28px 24px', border: '1px solid #e5e7eb' }
const h2 = { fontSize: '18px', fontWeight: 700 as const, color: '#0c2340', margin: '0 0 12px' }
const paragraph = { fontSize: '15px', lineHeight: '24px', color: '#334155', margin: '0 0 14px' }
const detailsBox = { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '12px 16px', margin: '20px 0' }
const rowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0f172a', margin: '6px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }
const rowLabel = { color: '#64748b', fontWeight: 500 as const, marginRight: '12px' }
const rowValue = { color: '#0f172a', textAlign: 'right' as const }
const button = { backgroundColor: '#0c2340', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 as const, fontSize: '14px', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 16px' }
const small = { fontSize: '13px', color: '#64748b', margin: 0 }
const link = { color: '#0c2340', fontWeight: 600 as const }
const footer = { textAlign: 'center' as const, fontSize: '12px', color: '#94a3b8', marginTop: '20px' }