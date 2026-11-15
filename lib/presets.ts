export interface SchemaPreset {
  id: string;
  name: string;
  description: string;
  schema: Record<string, any>;
  sampleDocument: string;
}

export const SCHEMA_PRESETS: SchemaPreset[] = [
  {
    id: 'commercial_invoice',
    name: 'Commercial Invoice',
    description: 'Extracts billing details, line items, amounts, and tax information.',
    schema: {
      type: 'object',
      properties: {
        invoice_number: { type: 'string', description: 'Unique invoice identifier' },
        invoice_date: { type: 'string', description: 'Date of issuance (YYYY-MM-DD)' },
        vendor_name: { type: 'string', description: 'Name of the selling company' },
        customer_name: { type: 'string', description: 'Name of the purchasing customer or entity' },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              quantity: { type: 'number' },
              unit_price: { type: 'number' },
              total: { type: 'number' }
            },
            required: ['description', 'quantity', 'total']
          }
        },
        subtotal: { type: 'number' },
        tax_amount: { type: 'number' },
        total_amount: { type: 'number' },
        currency: { type: 'string', enum: ['USD', 'EUR', 'GBP', 'CAD'] }
      },
      required: ['invoice_number', 'vendor_name', 'total_amount', 'currency']
    },
    sampleDocument: `INVOICE #INV-2024-8841
ISSUED BY: Apex Cloud Services Inc., 500 Market St, Suite 400, San Francisco, CA 94105
BILL TO: Northwind Health Partners, 1200 Beacon Ave, Boston, MA 02116
ISSUE DATE: 2024-03-15
DUE DATE: 2024-04-14

ITEMS:
1. Enterprise GPU Cluster Hosting (4x Nvidia H100) - Qty: 1 - Unit Price: $3,200.00 - Total: $3,200.00
2. Dedicated 10Gbps Private Interconnect - Qty: 2 - Unit Price: $450.00 - Total: $900.00
3. 24/7 Mission-Critical SLA Tier 1 Support - Qty: 1 - Unit Price: $750.00 - Total: $750.00

Subtotal: $4,850.00
State Sales Tax (8.5%): $412.25
Total Amount Due: $5,262.25 USD

Payment Method: ACH Transfer (Wire Routing #021000021)`
  },
  {
    id: 'clinical_note',
    name: 'Clinical Note',
    description: 'Extracts patient demographic, diagnosis, vitals, allergies, and prescribed medications.',
    schema: {
      type: 'object',
      properties: {
        patient_name: { type: 'string' },
        dob: { type: 'string', description: 'Date of birth' },
        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
        primary_diagnosis: { type: 'string' },
        secondary_diagnoses: {
          type: 'array',
          items: { type: 'string' }
        },
        medications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              dosage: { type: 'string' },
              frequency: { type: 'string' }
            },
            required: ['name', 'dosage']
          }
        },
        allergies: {
          type: 'array',
          items: { type: 'string' }
        },
        follow_up_weeks: { type: 'integer' }
      },
      required: ['patient_name', 'primary_diagnosis', 'medications']
    },
    sampleDocument: `OUTPATIENT CLINIC ENCOUNTER NOTE
Patient: Robert M. Chen | DOB: 1968-07-22 | Gender: Male
Visit Date: 2024-05-11 | Provider: Dr. Sarah Vance, MD (Cardiology)

Chief Complaint: 3-week history of exertional dyspnea and bilateral ankle swelling.
Assessment & Diagnosis:
Primary Diagnosis: Congestive Heart Failure, NYHA Class II (Exacerbation).
Secondary Diagnoses: Essential Hypertension, Type 2 Diabetes Mellitus without complications.

Current Prescriptions & Changes:
1. Furosemide (Lasix) 40mg oral once daily in the morning (increased from 20mg).
2. Lisinopril 20mg oral once daily at bedtime.
3. Metformin 500mg oral twice daily with meals.

Allergies: Penicillin (severe urticaria/anaphylactoid reaction noted in 2012). No known food allergies.
Plan: Patient counselled on 2g/day low-sodium diet and daily morning weight logs. Follow-up clinic appointment scheduled in 4 weeks.`
  },
  {
    id: 'support_ticket',
    name: 'Support Ticket',
    description: 'Extracts ticket metadata, customer issue category, sentiment, and action items.',
    schema: {
      type: 'object',
      properties: {
        ticket_id: { type: 'string' },
        customer_email: { type: 'string' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        category: { type: 'string', enum: ['billing', 'technical_outage', 'feature_request', 'security', 'account_access'] },
        summary: { type: 'string' },
        affected_services: {
          type: 'array',
          items: { type: 'string' }
        },
        customer_sentiment: { type: 'string', enum: ['positive', 'neutral', 'frustrated', 'angry'] },
        escalate_to_tier3: { type: 'boolean' }
      },
      required: ['ticket_id', 'customer_email', 'priority', 'category', 'summary', 'escalate_to_tier3']
    },
    sampleDocument: `SUPPORT ESCALATION LOG - TICKET #TCK-99201
From: devops-lead@fintechpay.io
Timestamp: 2024-06-02 14:22 UTC
Subject: Production Webhook Deliveries Failing with HTTP 504 Since 13:45 UTC

Details:
We are seeing critical drops across all webhook delivery endpoints for our EU region payments. Over 4,200 merchant notifications have failed or timed out with 504 Gateway Timeout in the last 35 minutes. Our merchants are unable to confirm settled transactions, causing severe customer escalations. We have already verified our internal origin servers are responsive.

Affected Services:
- Webhook Dispatcher EU-West-1
- Payment Event Stream Processor

This is an urgent Sev-1 outage affecting live revenue processing. Please escalate immediately to Tier 3 engineering for direct database and worker pool inspection.`
  },
  {
    id: 'legal_contract',
    name: 'Legal Contract',
    description: 'Extracts contract terms, parties, jurisdiction, effective dates, and indemnification caps.',
    schema: {
      type: 'object',
      properties: {
        agreement_title: { type: 'string' },
        effective_date: { type: 'string' },
        party_a: { type: 'string' },
        party_b: { type: 'string' },
        governing_law: { type: 'string' },
        jurisdiction_city: { type: 'string' },
        liability_cap_usd: { type: 'number' },
        termination_notice_days: { type: 'integer' },
        auto_renew: { type: 'boolean' }
      },
      required: ['agreement_title', 'party_a', 'party_b', 'governing_law', 'liability_cap_usd']
    },
    sampleDocument: `MASTER SOFTWARE LICENSE AND PROFESSIONAL SERVICES AGREEMENT

This Master Agreement ("Agreement") is made and entered into as of October 1, 2024 ("Effective Date"), by and between:
Aether Intelligence Inc., a Delaware corporation with principal offices in Wilmington, DE ("Vendor"), and
Helios Financial Technologies LLC, a New York limited liability company ("Customer").

SECTION 8: TERM AND TERMINATION
This Agreement shall commence on the Effective Date and continue for an initial term of twenty-four (24) months. Either party may terminate this Agreement without cause by providing at least sixty (60) days prior written notice. This Agreement shall automatically renew for successive twelve (12) month periods unless notice is provided.

SECTION 11: LIMITATION OF LIABILITY
IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED ONE MILLION UNITED STATES DOLLARS ($1,000,000.00 USD).

SECTION 14: GOVERNING LAW AND VENUE
This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflicts of law principles. Any dispute arising hereunder shall be resolved exclusively in the state or federal courts located in New York City, New York.`
  }
];
