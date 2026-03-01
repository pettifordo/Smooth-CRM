import { Button } from '@fluentui/react-components'
import {
  AppsRegular,
  ChevronRightRegular,
  ArrowLeftRegular,
  DocumentTextRegular,
  ArrowRightRegular,
  BuildingBankRegular,
  PersonCircleRegular,
  GlobeRegular,
  TagRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const TIER_CLS = {
  Platinum: 'bg-purple-100 text-purple-800 border border-purple-300',
  Gold:     'bg-amber-100  text-amber-800  border border-amber-300',
  Silver:   'bg-gray-100   text-gray-600   border border-gray-300',
}

const STAGE_COLORS = {
  Discovery:   { bg: '#FFF3E0', text: '#E65100', dot: '#FB8C00' },
  Qualifying:  { bg: '#FFFDE7', text: '#F57F17', dot: '#FDD835' },
  Proposal:    { bg: '#E3F2FD', text: '#1565C0', dot: '#42A5F5' },
  Negotiation: { bg: '#F3E5F5', text: '#6A1B9A', dot: '#AB47BC' },
  Closed:      { bg: '#E8F5E9', text: '#1B5E20', dot: '#66BB6A' },
}

/* ── SF Nav (shared look) ────────────────────────────────────────────────── */
function SFNav({ onHome, onAccounts }) {
  const navActions = { Home: onHome, Accounts: onAccounts }
  return (
    <nav className="bg-[#0176D3] h-12 flex items-center px-4 gap-3 shadow-md z-50 sticky top-0">
      <button
        onClick={onHome}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#014486] rounded transition-colors"
      >
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
              ${item === 'Accounts' ? 'bg-[#014486] border-b-2 border-white' : 'hover:bg-[#014486]'}`}
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

/* ── Main component ──────────────────────────────────────────────────────── */
export default function OpportunityList({ customer, products, onSelectOpportunity, onBack, onHome, onAccounts }) {
  if (!customer) return null

  const allOppsValue = customer.opportunities.reduce((s, o) => s + o.value, 0)
  const openOpps     = customer.opportunities.filter((o) => o.stage !== 'Closed')

  const getProductNames = (items) =>
    items
      .map((pid) => products.find((p) => p.id === pid)?.name ?? pid)
      .join(', ')

  return (
    <div className="min-h-screen bg-sf-bg font-sans">
      <SFNav onHome={onHome ?? onBack} onAccounts={onAccounts ?? onBack} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-sf-border px-6 py-2.5 flex items-center gap-2 text-sm sticky top-12 z-40 shadow-sm">
        <button onClick={onBack} className="text-sf-blue hover:underline font-medium">
          Accounts
        </button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <span className="text-sf-text-3">{customer.name}</span>
      </div>

      <div className="px-6 py-5">

        {/* Customer header card */}
        <div className="bg-white rounded-lg border border-sf-border shadow-sf-card mb-6 overflow-hidden">
          {/* Blue accent strip */}
          <div className="h-2 bg-gradient-to-r from-[#0176D3] via-[#1589EE] to-[#0176D3]" />

          <div className="p-5 flex flex-wrap gap-6 items-start">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-sf-blue/10 border-2 border-sf-blue/20
                            flex items-center justify-center text-sf-blue font-bold text-xl flex-shrink-0">
              {customer.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-sf-text">{customer.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TIER_CLS[customer.tier]}`}>
                  {customer.tier}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-2 text-sm text-sf-text-2">
                <span className="flex items-center gap-1.5">
                  <GlobeRegular fontSize={14} className="text-sf-text-3" /> {customer.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <TagRegular fontSize={14} className="text-sf-text-3" /> {customer.segment}
                </span>
                <span className="flex items-center gap-1.5">
                  <DocumentTextRegular fontSize={14} className="text-sf-text-3" />
                  {customer.opportunities.length} opportunit{customer.opportunities.length !== 1 ? 'ies' : 'y'}
                </span>
              </div>
            </div>

            {/* Pipeline summary */}
            <div className="bg-sf-bg rounded-lg px-5 py-3 text-right border border-sf-border">
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Total Pipeline</p>
              <p className="text-2xl font-bold text-sf-blue mt-0.5">{fmt(allOppsValue)}</p>
              <p className="text-xs text-sf-text-3 mt-0.5">{openOpps.length} active deal{openOpps.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Opportunities section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-sf-text flex items-center gap-2">
            <DocumentTextRegular fontSize={18} className="text-sf-blue" />
            Opportunities
            <span className="text-xs font-normal bg-sf-blue text-white px-2 py-0.5 rounded-full">
              {customer.opportunities.length}
            </span>
          </h2>
          <Button
            appearance="outline"
            size="small"
            style={{ color: '#0176D3', borderColor: '#0176D3' }}
          >
            + New Opportunity
          </Button>
        </div>

        {customer.opportunities.length === 0 ? (
          <div className="bg-white rounded-lg border border-sf-border shadow-sf-card p-16 text-center text-sf-text-3">
            <DocumentTextRegular fontSize={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No opportunities yet</p>
            <p className="text-sm mt-1">Create a new opportunity to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customer.opportunities.map((opp) => {
              const sc = STAGE_COLORS[opp.stage] ?? STAGE_COLORS.Discovery
              const oppProducts = opp.items.map((id) => products.find((p) => p.id === id)).filter(Boolean)

              return (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="bg-white rounded-lg border border-sf-border shadow-sf-card hover:shadow-md
                             cursor-pointer transition-all hover:-translate-y-0.5 group overflow-hidden"
                >
                  {/* Stage colour strip */}
                  <div
                    className="h-1.5"
                    style={{ backgroundColor: sc.dot }}
                  />

                  <div className="p-4">
                    {/* Title + stage */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sf-text group-hover:text-sf-blue transition-colors line-clamp-2">
                        {opp.title}
                      </h3>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {opp.stage}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-sf-text">{fmt(opp.value)}</span>
                    </div>

                    {/* Product tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {oppProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 bg-sf-bg rounded text-xs text-sf-text-2
                                     border border-sf-border font-medium"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold
                                 text-sf-blue bg-sf-blue/5 hover:bg-sf-blue/10 rounded-lg py-2 transition-colors"
                    >
                      Open Opportunity <ArrowRightRegular fontSize={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
