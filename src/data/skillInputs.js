// Input field definitions for skills that need structured inputs.
// Skills not listed here get a single free-form text field as fallback.

const skillInputs = {
  'probate-hunter': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
    { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['last-30-days', 'last-60-days', 'last-90-days', 'last-6-months'] },
  ],
  'foreclosure-tracker': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
    { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['last-30-days', 'last-60-days', 'last-90-days'] },
  ],
  'skip-tracer': [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. James Mitchell' },
    { name: 'address', label: 'Last Known Address', type: 'text', placeholder: 'e.g. 4521 Oak Valley Dr, Phoenix AZ' },
  ],
  'deal-analyzer': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ' },
    { name: 'arv', label: 'ARV ($)', type: 'text', placeholder: 'e.g. 350000' },
    { name: 'repairs', label: 'Repair Estimate ($)', type: 'text', placeholder: 'e.g. 45000' },
  ],
  'listing-generator': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ 85028' },
  ],
  'email-campaign-engine': [
    { name: 'type', label: 'Campaign Type', type: 'select', options: ['welcome-sequence', 'nurture-drip', 're-engagement', 'new-listing', 'market-update'] },
    { name: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g. probate leads, expired listings' },
  ],
  'market-report': [
    { name: 'area', label: 'Zip Code or City', type: 'text', placeholder: 'e.g. 85028 or Phoenix' },
  ],
  'seller-pitch': [
    { name: 'channel', label: 'Channel', type: 'select', options: ['cold-call', 'sms', 'email', 'voicemail', 'door-knock'] },
    { name: 'seller_type', label: 'Seller Type', type: 'select', options: ['probate', 'foreclosure', 'expired', 'fsbo', 'absentee', 'divorce', 'tax-delinquent'] },
  ],
  'expired-hunter': [
    { name: 'city', label: 'City', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix' },
    { name: 'zip', label: 'Zip Code', type: 'text', placeholder: 'e.g. 85028' },
  ],
  'fsbo-finder': [
    { name: 'area', label: 'Area', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix, scottsdale' },
  ],
  'comps-finder': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ 85028' },
  ],
  'flip-profit-analyzer': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ' },
    { name: 'purchase', label: 'Purchase Price ($)', type: 'text', placeholder: 'e.g. 200000' },
    { name: 'repairs', label: 'Repair Budget ($)', type: 'text', placeholder: 'e.g. 50000' },
    { name: 'arv', label: 'ARV ($)', type: 'text', placeholder: 'e.g. 350000' },
  ],
  'roi-calculator': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ' },
    { name: 'price', label: 'Purchase Price ($)', type: 'text', placeholder: 'e.g. 250000' },
    { name: 'rent', label: 'Monthly Rent ($)', type: 'text', placeholder: 'e.g. 1800' },
  ],
  'absentee-owner-finder': [
    { name: 'area', label: 'Area', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa, phoenix 85028' },
  ],
  'tax-delinquent-finder': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
  ],
  'vacant-property-scout': [
    { name: 'area', label: 'Area', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix, scottsdale' },
  ],
  'invoice-generator': [
    { name: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. John Smith Realty' },
    { name: 'amount', label: 'Amount ($)', type: 'text', placeholder: 'e.g. 500' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g. Probate leads package - March 2026' },
  ],
  'fair-housing-checker': [
    { name: 'content', label: 'Marketing Copy to Check', type: 'textarea', placeholder: 'Paste listing description, ad copy, or email text here...' },
  ],
  'contract-reviewer': [
    { name: 'notes', label: 'Contract Details', type: 'textarea', placeholder: 'Paste contract text or describe the agreement...' },
  ],
  'auto-responder': [
    { name: 'channel', label: 'Channel', type: 'select', options: ['email', 'text', 'dm', 'voicemail'] },
    { name: 'lead_type', label: 'Lead Type', type: 'select', options: ['probate', 'foreclosure', 'expired', 'fsbo', 'buyer', 'seller'] },
  ],
  'content-repurposer': [
    { name: 'content', label: 'Original Content', type: 'textarea', placeholder: 'Paste the content you want repurposed...' },
  ],
  'mailer-campaign': [
    { name: 'list', label: 'Lead List', type: 'select', options: ['probate', 'foreclosure', 'tax-delinquent', 'absentee', 'custom'] },
    { name: 'area', label: 'Target Area', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
  ],
  'cash-buyer-builder': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
    { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['last-30-days', 'last-60-days', 'last-90-days'] },
  ],
}

export default skillInputs
