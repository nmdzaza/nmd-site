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
  'craigslist-fsbo': [
    { name: 'mode', label: 'What to pull', type: 'select', options: ['fsbo-homes', 'rooms-for-rent', 'housing-wanted'] },
    { name: 'city', label: 'City', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix, scottsdale, tempe' },
    { name: 'state', label: 'State (2-letter)', type: 'text', defaultValue: 'az', placeholder: 'e.g. az, ca, tx' },
  ],
  'rental-listings': [
    { name: 'type', label: 'Listing Type', type: 'select', options: ['all', 'rooms', 'apartments', 'houses'] },
    { name: 'city', label: 'City', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix, scottsdale, tempe' },
    { name: 'state', label: 'State (2-letter)', type: 'text', defaultValue: 'az', placeholder: 'e.g. az, ca, tx' },
    { name: 'max_price', label: 'Max Rent (optional)', type: 'text', placeholder: 'e.g. 1500 — leave blank for no limit' },
  ],
  'rental-matcher': [
    { name: 'action', label: 'Action', type: 'select', options: ['run-matches', 'view-matches', 'generate-outreach'] },
    { name: 'min_score', label: 'Min Match Score (1-6)', type: 'select', options: ['2', '3', '4', '5', '6'] },
    { name: 'city_filter', label: 'City Filter (optional)', type: 'text', placeholder: 'e.g. phoenix — leave blank for all cities' },
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

  // ── Previously missing inputs ────────────────────────────────────────────
  'heir-property-finder': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
    { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['last-30-days', 'last-60-days', 'last-90-days', 'last-6-months'] },
  ],
  'divorce-lead-finder': [
    { name: 'county', label: 'County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. maricopa' },
    { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['last-30-days', 'last-60-days', 'last-90-days'] },
  ],
  'hoa-lien-hunter': [
    { name: 'area', label: 'City or Zip Code', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix or 85032' },
  ],
  'landlord-burnout-finder': [
    { name: 'area', label: 'City or County', type: 'text', defaultValue: 'maricopa', placeholder: 'e.g. phoenix, scottsdale' },
  ],
  'price-drop-alert': [
    { name: 'area', label: 'City or Zip Code', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. phoenix or 85028' },
    { name: 'days', label: 'Price Dropped In Last', type: 'select', options: ['7-days', '14-days', '30-days'] },
  ],
  'listing-spy': [
    { name: 'area', label: 'City or Neighborhood', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. Scottsdale AZ or 85251' },
  ],
  'buyer-matcher': [
    { name: 'bedrooms', label: 'Min Bedrooms', type: 'select', options: ['1', '2', '3', '4', '5+'] },
    { name: 'max_price', label: 'Max Budget ($)', type: 'text', placeholder: 'e.g. 350000' },
    { name: 'area', label: 'Target Area', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. Phoenix AZ or 85028' },
  ],
  'neighborhood-alert': [
    { name: 'neighborhood', label: 'Neighborhood or Zip Code', type: 'text', placeholder: 'e.g. Arcadia Phoenix or 85018' },
  ],
  'sphere-nurture': [
    { name: 'agent_name', label: 'Agent Name', type: 'text', placeholder: 'e.g. John Smith' },
    { name: 'contact_count', label: 'Approx. Contacts in Sphere', type: 'text', placeholder: 'e.g. 150' },
  ],
  'review-harvester': [
    { name: 'agent_name', label: 'Agent Name', type: 'text', placeholder: 'e.g. Sarah Johnson' },
    { name: 'platform', label: 'Primary Review Platform', type: 'select', options: ['google', 'zillow', 'realtor-com', 'yelp', 'all'] },
  ],
  'chatbot-builder': [
    { name: 'business_type', label: 'Business Type', type: 'select', options: ['real-estate-agent', 'wholesaler', 'property-manager', 'mortgage-broker', 'investor'] },
    { name: 'top_questions', label: 'Top 3 Questions Leads Ask', type: 'textarea', placeholder: 'e.g. What areas do you cover? How fast can you close? Do you buy as-is?' },
  ],
  'social-proof-engine': [
    { name: 'agent_name', label: 'Agent / Business Name', type: 'text', placeholder: 'e.g. Cameron Johnson - NMD Solutions' },
    { name: 'stats', label: 'Your Key Stats', type: 'textarea', placeholder: 'e.g. 47 deals closed, avg 12 days to close, 4.9 stars on Google, $8M volume' },
  ],
  'seo-local-dominator': [
    { name: 'city', label: 'Target City', type: 'text', defaultValue: 'phoenix', placeholder: 'e.g. Phoenix AZ' },
    { name: 'niche', label: 'Your Niche', type: 'select', options: ['probate', 'foreclosure', 'wholesaler', 'buyer-agent', 'listing-agent', 'investor'] },
  ],
  'payment-tracker': [
    { name: 'period', label: 'Period to Review', type: 'select', options: ['this-month', 'last-month', 'last-30-days', 'last-90-days', 'year-to-date'] },
  ],
  'realtor-crm': [
    { name: 'action', label: 'What do you want to do?', type: 'select', options: ['view-all-clients', 'check-overdue-followups', 'add-new-client', 'search-client'] },
    { name: 'name', label: 'Client Name (if searching/adding)', type: 'text', placeholder: 'e.g. Sarah Johnson — leave blank to view all' },
  ],
  'territory-lock': [
    { name: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. Sarah Johnson' },
    { name: 'territory', label: 'City or Zip Code(s) to Lock', type: 'text', placeholder: 'e.g. Scottsdale AZ 85251, 85254' },
    { name: 'duration', label: 'Lock Duration', type: 'select', options: ['30-days', '60-days', '90-days', '6-months', '1-year'] },
  ],
  'white-label-portal': [
    { name: 'action', label: 'What do you need?', type: 'select', options: ['show-full-catalog', 'build-client-proposal', 'show-pricing-tiers'] },
    { name: 'client', label: 'Client Name (for proposal)', type: 'text', placeholder: 'e.g. John Smith — leave blank for full catalog' },
    { name: 'budget', label: 'Client Budget (approx)', type: 'text', placeholder: 'e.g. 500 or 1500 — leave blank to show all options' },
  ],
  'realtor-onboarding': [
    { name: 'name', label: 'New Client Full Name', type: 'text', placeholder: 'e.g. Sarah Johnson' },
    { name: 'email', label: 'Client Email', type: 'text', placeholder: 'e.g. sarah@johnsonrealty.com' },
    { name: 'market', label: 'Their Market (City/State)', type: 'text', placeholder: 'e.g. Phoenix AZ or Scottsdale AZ' },
    { name: 'package', label: 'Package They Bought', type: 'select', options: ['starter-150', 'pro-bundle-1500', 'full-suite-3000', 'custom'] },
  ],
  'upsell-engine': [
    { name: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. Sarah Johnson' },
  ],
  'referral-network-builder': [
    { name: 'action', label: 'What do you want to do?', type: 'select', options: ['view-network', 'log-new-referral', 'send-thank-you', 'check-fees-owed'] },
    { name: 'partner', label: 'Partner Name (if logging)', type: 'text', placeholder: 'e.g. Mike Torres — Mortgage Broker' },
  ],
  'fb-lead-scraper': [
    { name: 'target', label: 'Target Market / State', type: 'text', defaultValue: 'arizona', placeholder: 'e.g. arizona or nationwide' },
    { name: 'type', label: 'Agent Type to Find', type: 'select', options: ['active-listers', 'new-agents', 'team-leads', 'brokers', 'all-realtors'] },
  ],
  'transaction-coordinator': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ 85028' },
    { name: 'buyer', label: 'Buyer Name', type: 'text', placeholder: 'e.g. James Martinez' },
    { name: 'seller', label: 'Seller Name', type: 'text', placeholder: 'e.g. Patricia Williams' },
    { name: 'close_date', label: 'Target Close Date', type: 'text', placeholder: 'e.g. April 15 2026' },
  ],
  'listing-generator': [
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g. 123 Main St, Phoenix AZ 85028' },
    { name: 'beds', label: 'Beds / Baths', type: 'text', placeholder: 'e.g. 3 bed 2 bath' },
    { name: 'sqft', label: 'Square Footage', type: 'text', placeholder: 'e.g. 1850 sqft' },
  ],
}

export default skillInputs
