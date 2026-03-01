import { Button } from '@fluentui/react-components'
import {
  AppsRegular,
  ChevronRightRegular,
  EditRegular,
  CheckmarkCircleFilled,
  CircleRegular,
  TagMultipleRegular as PricetagonRegular,
  CalendarRegular,
  PersonRegular,
  BuildingRegular,
  TagMultipleRegular,
  MoneyRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const STAGES = ['Discovery', 'Qualifying', 'Proposal', 'Negotiation', 'Closed']

const TIER_CLS = {
  Platinum: 'bg-purple-100 text-purple-800 border border-purple-300',
  Gold:     'bg-amber-100  text-amber-800  border border-amber-300',
  Silver:   'bg-gray-100   text-gray-600   border border-gray-300',
}

/* ── SF Nav (shared) ─────────────────────────────────────────────────────── */
function SFNav({ onHome, onAccounts }) {
  const navActions = { Home: onHome, Accounts: onAccounts }
  return (
    <nav className="bg-[#0176D3] h-12 flex items-center px-4 gap-3 shadow-md z-50 sticky top-0">
      <button onClick={onHome} className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#014486] rounded">
        <AppsRegular fontSize={20} />
      </button>
      <div className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
          <span className="text-[#0176D3] font-extrabold text-xs">SC</span>
        </div>
        <span className="text-white font-semibold text-sm hidden md:block">SpeChem CRM</span>
      </div>
      <div className="flex items-end gap-0.5 flex-1">
        {['Home', 'Accounts', 'Opportunities', 'Reports', 'Dashboards'].map((item) => (
          <button
            key={item}
            onClick={navActions[item] ?? undefined}
            className={`px-3 py-1.5 text-sm text-white rounded-t font-medium transition-colors
              ${item === 'Opportunities' ? 'bg-[#014486] border-b-2 border-white' : 'hover:bg-[#014486]'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-white ml-auto">
        <span className="text-sm hidden md:block font-medium">Sarah Mitchell</span>
        <div className="w-8 h-8 rounded-full bg-[#014486] border-2 border-white/40 flex items-center justify-center text-xs font-bold">
          SM
        </div>
      </div>
    </nav>
  )
}

/* ── Stage tracker ───────────────────────────────────────────────────────── */
function StageTracker({ currentStage }) {
  const currentIdx = STAGES.indexOf(currentStage)

  return (
    <div className="bg-white border-b border-sf-border px-6 py-4">
      <div className="flex items-start">
        {STAGES.map((stage, idx) => {
          const isPast    = idx < currentIdx
          const isCurrent = idx === currentIdx

          return (
            <div key={stage} className="flex items-start flex-1">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                               text-xs font-bold transition-all
                    ${isPast
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                        ? 'bg-sf-blue border-sf-blue text-white ring-4 ring-sf-blue/20'
                        : 'bg-white border-gray-300 text-sf-text-3'}`}
                >
                  {isPast ? <CheckmarkCircleFilled fontSize={16} /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-1.5 font-semibold text-center whitespace-nowrap
                    ${isCurrent ? 'text-sf-blue' : isPast ? 'text-green-600' : 'text-sf-text-3'}`}
                >
                  {stage}
                </span>
              </div>

              {/* Connector */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-4 mx-1
                    ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Detail field ────────────────────────────────────────────────────────── */
function Field({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-sf-text-3 uppercase tracking-wider flex items-center gap-1">
        {Icon && <Icon fontSize={12} />} {label}
      </span>
      <span className="text-sm font-medium text-sf-text">{value ?? '—'}</span>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function OpportunityView({ opportunity, customer, products, onConfigurePricing, onBack, onHome, onAccounts }) {
  if (!opportunity || !customer) return null

  const oppProducts = opportunity.items
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  /* Fake close date 90 days out */
  const closeDate = new Date()
  closeDate.setDate(closeDate.getDate() + 90)
  const closeDateStr = closeDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-sf-bg font-sans">
      <SFNav onHome={onHome ?? onBack} onAccounts={onAccounts ?? onBack} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-sf-border px-6 py-2.5 flex items-center gap-2 text-sm sticky top-12 z-40 shadow-sm">
        <button onClick={() => onBack()} className="text-sf-blue hover:underline font-medium">Accounts</button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <button onClick={() => onBack()} className="text-sf-blue hover:underline font-medium">{customer.name}</button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <span className="text-sf-text-3">{opportunity.title}</span>
      </div>

      {/* Record header */}
      <div className="bg-white border-b border-sf-border">
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-sf-blue to-sf-blue-light
                              flex items-center justify-center shadow-md flex-shrink-0">
                <PricetagonRegular fontSize={26} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider mb-0.5">Opportunity</p>
                <h1 className="text-2xl font-bold text-sf-text">{opportunity.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-sf-text-2">
                  <span className="flex items-center gap-1">
                    <BuildingRegular fontSize={13} className="text-sf-text-3" /> {customer.name}
                  </span>
                  <span className="text-sf-text-3">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_CLS[customer.tier]}`}>
                    {customer.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                appearance="outline"
                icon={<EditRegular />}
                style={{ color: '#0176D3', borderColor: '#0176D3' }}
              >
                Edit
              </Button>
              <Button
                appearance="primary"
                icon={<ArrowRightRegular />}
                iconPosition="after"
                style={{ backgroundColor: '#0176D3', borderColor: '#0176D3', padding: '0 20px' }}
                onClick={onConfigurePricing}
              >
                Configure Pricing
              </Button>
            </div>
          </div>

          {/* Quick-stats row */}
          <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-sf-border">
            <div className="text-center">
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Deal Value</p>
              <p className="text-2xl font-extrabold text-sf-blue mt-0.5">{fmt(opportunity.value)}</p>
            </div>
            <div className="h-10 w-px bg-sf-border self-center" />
            <div className="text-center">
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Stage</p>
              <p className="text-lg font-bold text-sf-text mt-0.5">{opportunity.stage}</p>
            </div>
            <div className="h-10 w-px bg-sf-border self-center" />
            <div className="text-center">
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Products</p>
              <p className="text-lg font-bold text-sf-text mt-0.5">{oppProducts.length}</p>
            </div>
            <div className="h-10 w-px bg-sf-border self-center" />
            <div className="text-center">
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Close Date</p>
              <p className="text-lg font-bold text-sf-text mt-0.5">{closeDateStr}</p>
            </div>
          </div>
        </div>

        {/* Stage tracker */}
        <StageTracker currentStage={opportunity.stage} />
      </div>

      {/* Body */}
      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: detail fields */}
        <div className="lg:col-span-2 space-y-4">
          {/* Opportunity info */}
          <div className="bg-white rounded-lg border border-sf-border shadow-sf-card p-5">
            <h2 className="text-sm font-bold text-sf-text mb-4 pb-2 border-b border-sf-border flex items-center gap-2">
              <MoneyRegular fontSize={16} className="text-sf-blue" /> Opportunity Information
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Field label="Account Name"   value={customer.name}           icon={BuildingRegular} />
              <Field label="Stage"          value={opportunity.stage}       icon={TagMultipleRegular} />
              <Field label="Amount"         value={fmt(opportunity.value)}  icon={MoneyRegular} />
              <Field label="Close Date"     value={closeDateStr}            icon={CalendarRegular} />
              <Field label="Region"         value={customer.region}         icon={null} />
              <Field label="Segment"        value={customer.segment}        icon={null} />
              <Field label="Account Tier"   value={customer.tier}           icon={null} />
              <Field label="Owner"          value="Sarah Mitchell"          icon={PersonRegular} />
            </div>
          </div>

          {/* Primary CTA card */}
          <div className="bg-gradient-to-r from-[#0176D3] to-[#1589EE] rounded-lg p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="font-bold text-lg">Ready to price this deal?</p>
                <p className="text-white/80 text-sm mt-1">
                  Launch the AI Pricing Engine to generate optimised customer-specific prices
                  and push directly to SAP S/4HANA.
                </p>
              </div>
              <Button
                appearance="primary"
                size="large"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0176D3',
                  fontWeight: 700,
                  padding: '8px 24px',
                  flexShrink: 0,
                  marginLeft: '16px',
                }}
                onClick={onConfigurePricing}
              >
                Configure Pricing →
              </Button>
            </div>
          </div>
        </div>

        {/* Right: product list */}
        <div className="bg-white rounded-lg border border-sf-border shadow-sf-card p-5 self-start">
          <h2 className="text-sm font-bold text-sf-text mb-4 pb-2 border-b border-sf-border flex items-center gap-2">
            <TagMultipleRegular fontSize={16} className="text-sf-blue" /> Products in this Deal
          </h2>
          <div className="space-y-3">
            {oppProducts.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3 bg-sf-bg rounded-lg border border-sf-border/60">
                <div className="w-9 h-9 rounded-lg bg-sf-blue/10 flex items-center justify-center flex-shrink-0">
                  <TagMultipleRegular fontSize={16} className="text-sf-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sf-text truncate">{p.name}</p>
                  <p className="text-xs text-sf-text-3 mt-0.5">{p.category} · {p.uom}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-sf-text-2">List:</span>
                    <span className="text-xs font-bold text-sf-text">
                      {p.uom === 'KG'
                        ? `€${p.list_price.toFixed(2)}/kg`
                        : `€${p.list_price.toLocaleString()}/MT`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
