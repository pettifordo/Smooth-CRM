import { useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  AppsRegular,
  ChevronRightRegular,
  ChevronDownRegular,
  CheckmarkCircleFilled,
  DocumentRegular,
  PrintRegular,
  SendRegular,
  ArrowLeftRegular,
  HomeRegular,
  BuildingRegular,
  CalendarRegular,
  GlobeRegular,
  NumberSymbolRegular,
  TagMultipleRegular,
  AlertRegular,
  QuestionCircleRegular,
  SettingsRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n)

const fmtQty = (n, uom) =>
  `${n.toLocaleString()} ${uom === 'Metric Ton' ? 'MT' : 'KG'}`

const DEFAULT_QTY = { 'Metric Ton': 80, KG: 15000 }

/* ── SF Lightning Global Header ──────────────────────────────────────────── */
function SFNav({ onHome }) {
  const navActions = { Home: onHome }
  return (
    <header className="bg-[#0176D3] h-12 flex items-center px-3 gap-1.5 shadow-md z-50 sticky top-0">
      <button
        onClick={onHome}
        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors flex-shrink-0"
      >
        <AppsRegular fontSize={20} />
      </button>
      <div className="flex items-center gap-1.5 flex-shrink-0 mr-1 border-r border-white/20 pr-3">
        <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-[#0176D3] font-extrabold text-[9px] tracking-tight leading-none">SC</span>
        </div>
        <span className="text-white font-semibold text-xs hidden lg:block">SpeChem CRM</span>
      </div>
      <div className="flex items-end gap-0 flex-shrink-0">
        {['Home', 'Accounts', 'Opportunities', 'Reports', 'Dashboards'].map((item) => (
          <button
            key={item}
            onClick={navActions[item] ?? undefined}
            className={`flex items-center gap-0.5 px-2.5 py-1.5 text-xs text-white font-medium rounded-t transition-colors whitespace-nowrap
              ${item === 'Opportunities'
                ? 'bg-white/20 border-b-2 border-white'
                : 'hover:bg-white/15'}`}
          >
            {item}
            <ChevronDownRegular fontSize={10} className="opacity-60 mt-px" />
          </button>
        ))}
      </div>
      <div className="flex-1 mx-3 min-w-0 hidden md:block">
        <div className="flex items-center bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 rounded-full px-3 py-1.5 gap-2 cursor-text transition-all max-w-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-80">
            <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-white/65 text-xs truncate select-none">Search SpeChem…</span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
        <button className="relative w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <AlertRegular fontSize={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full border border-[#0176D3]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <QuestionCircleRegular fontSize={17} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <SettingsRegular fontSize={17} />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#014486] border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white ml-1 flex-shrink-0">
          SM
        </div>
      </div>
    </header>
  )
}

/* ── Vertical process timeline (sidebar-friendly) ────────────────────────── */
function ProcessTimeline({ opportunity, customer, quoteId }) {
  const steps = [
    {
      icon: '⚡',
      system: 'Salesforce CRM',
      label: 'Opportunity created',
      detail: opportunity.title,
      sub: customer.name,
      iconBg: 'bg-[#0176D3]',
      badge: 'SFDC',
      badgeBg: 'bg-[#0176D3]/10',
      badgeText: 'text-[#0176D3]',
      cardBorder: 'border-[#0176D3]/30',
      cardBg: 'bg-[#F0F7FF]',
      done: true,
    },
    {
      icon: '✦',
      system: 'AI Pricing Engine',
      label: 'Prices optimised',
      detail: `${opportunity.items.length} product${opportunity.items.length !== 1 ? 's' : ''} · AI applied`,
      sub: '',
      iconBg: 'bg-violet-600',
      badge: 'AI',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-700',
      cardBorder: 'border-violet-300/50',
      cardBg: 'bg-violet-50/60',
      done: true,
    },
    {
      icon: '◈',
      system: 'SAP S/4HANA',
      label: 'Quotation posted',
      detail: quoteId,
      sub: 'Sales · Quotations',
      iconBg: 'bg-[#0854A0]',
      badge: 'SAP',
      badgeBg: 'bg-[#0854A0]/10',
      badgeText: 'text-[#0854A0]',
      cardBorder: 'border-[#0854A0]/30',
      cardBg: 'bg-[#EBF0FA]',
      done: true,
    },
  ]

  return (
    <div>
      {steps.map((step, idx) => (
        <div key={idx} className="relative flex gap-3">
          {/* Left gutter: icon + connector line */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full ${step.iconBg} flex items-center justify-center
                             text-white text-xs font-bold shadow-sm border-2 border-white z-10`}>
              {step.done
                ? <CheckmarkCircleFilled fontSize={14} />
                : <span>{step.icon}</span>
              }
            </div>
            {idx < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-[#DDDBDA] my-1 min-h-[20px]" />
            )}
          </div>

          {/* Right: card content */}
          <div className={`flex-1 mb-3 rounded-lg border ${step.cardBorder} ${step.cardBg} px-3 py-2.5`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-px rounded ${step.badgeBg} ${step.badgeText}`}>
                {step.badge}
              </span>
              <span className="text-[10px] text-[#A8A8A8] truncate">{step.system}</span>
            </div>
            <p className="text-xs font-semibold text-[#3E3E3C] leading-tight">{step.label}</p>
            <p className="text-xs text-[#706E6B] mt-0.5 truncate">{step.detail}</p>
            {step.sub && (
              <p className="text-[10px] text-[#A8A8A8] mt-0.5">{step.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function SAPQuote({
  opportunity, customer, products, pricingData, quoteId, onBack, onNewDeal,
}) {
  const [printed, setPrinted] = useState(false)

  const oppProducts = opportunity.items
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const lineItems = oppProducts.map((p) => {
    const qty   = DEFAULT_QTY[p.uom] ?? 80
    const price = pricingData[p.id] ?? p.list_price
    return { ...p, quantity: qty, unit_price: price, total: qty * price }
  })

  const grandTotal = lineItems.reduce((s, li) => s + li.total, 0)

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)
  const validStr = validUntil.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const metaFields = [
    { label: 'Sold-To Party', value: customer.name,    icon: BuildingRegular },
    { label: 'Created On',    value: today,             icon: CalendarRegular },
    { label: 'Valid Until',   value: validStr,          icon: CalendarRegular },
    { label: 'Sales Office',  value: customer.region,   icon: GlobeRegular },
    { label: 'Document No.',  value: quoteId,           icon: NumberSymbolRegular },
    { label: 'Segment',       value: customer.segment,  icon: TagMultipleRegular },
    { label: 'Tier',          value: customer.tier,     icon: null },
    { label: 'Currency',      value: 'EUR',             icon: null },
  ]

  return (
    <div className="min-h-screen bg-[#F3F2F2] font-sans">
      <SFNav onHome={onNewDeal} />

      {/* ── SF breadcrumb strip ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#DDDBDA] px-6 flex items-center gap-1.5 text-xs sticky top-12 z-40 shadow-sm h-10">
        <button onClick={onNewDeal} className="text-[#0176D3] hover:underline font-medium">Accounts</button>
        <ChevronRightRegular fontSize={11} className="text-[#A8A8A8]" />
        <button onClick={onNewDeal} className="text-[#0176D3] hover:underline font-medium">{customer.name}</button>
        <ChevronRightRegular fontSize={11} className="text-[#A8A8A8]" />
        <button onClick={onBack} className="text-[#0176D3] hover:underline font-medium">{opportunity.title}</button>
        <ChevronRightRegular fontSize={11} className="text-[#A8A8A8]" />
        <span className="text-[#3E3E3C] font-semibold">Quotation {quoteId}</span>
      </div>

      {/* ── SF-style success toast ─────────────────────────────────────── */}
      <div className="fade-in-up mx-6 mt-4">
        <div className="bg-[#EBF5E9] border border-[#2E844A]/30 rounded-lg px-5 py-3.5 flex items-center gap-4 shadow-sm">
          <CheckmarkCircleFilled fontSize={24} className="text-[#2E844A] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1B4F2A] text-sm">Quote successfully created in SAP S/4HANA</p>
            <p className="text-[#2E844A] text-xs mt-0.5">
              Document <span className="font-bold">{quoteId}</span> has been posted in Sales · Quotations.
              The customer may now be notified.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              appearance="outline"
              size="small"
              icon={<PrintRegular />}
              style={{ color: '#2E844A', borderColor: '#2E844A', fontSize: '12px' }}
              onClick={() => setPrinted(true)}
            >
              {printed ? 'Printed ✓' : 'Print'}
            </Button>
            <Button
              appearance="primary"
              size="small"
              icon={<SendRegular />}
              style={{ backgroundColor: '#2E844A', borderColor: '#2E844A', fontSize: '12px' }}
            >
              Send to Customer
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main content grid ──────────────────────────────────────────── */}
      <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── Left col (2/3): Quote document ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Document header card */}
          <div className="bg-white rounded-lg border border-[#DDDBDA] shadow-sm overflow-hidden">
            <div className="h-1 bg-[#0176D3]" />
            <div className="px-5 pt-4 pb-5">

              {/* Record header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#EBF5FF] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#0176D3]/20">
                    <DocumentRegular fontSize={20} className="text-[#0176D3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[10px] text-[#706E6B] font-semibold uppercase tracking-wider">Quotation</p>
                      <span className="inline-flex items-center px-1.5 py-px rounded text-[10px] font-bold bg-[#0854A0] text-white">
                        SAP S/4HANA
                      </span>
                    </div>
                    <h1 className="text-xl font-bold text-[#3E3E3C] leading-tight">{quoteId}</h1>
                    <p className="text-xs text-[#706E6B] mt-0.5">{opportunity.title}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-[#706E6B] font-semibold uppercase tracking-wider mb-1">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBF5E9] text-[#2E844A]
                                   rounded-full text-xs font-bold border border-[#2E844A]/20">
                    <CheckmarkCircleFilled fontSize={11} /> Created
                  </span>
                </div>
              </div>

              {/* Meta fields grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3.5 mt-4 pt-4 border-t border-[#DDDBDA]">
                {metaFields.map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#A8A8A8] font-semibold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      {Icon && <Icon fontSize={10} />} {label}
                    </p>
                    <p className="text-xs font-semibold text-[#3E3E3C]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="bg-white rounded-lg border border-[#DDDBDA] shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 border-b border-[#DDDBDA] bg-[#F3F2F2] flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#3E3E3C] uppercase tracking-wide">Line Items</h2>
              <span className="text-[10px] text-[#A8A8A8]">{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#DDDBDA]">
                    {['#', 'Material', 'Category', 'Qty', 'Unit Price', 'Net Value'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2 text-[10px] font-semibold text-[#706E6B] uppercase tracking-wider bg-[#F3F2F2]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-[#DDDBDA]/60 hover:bg-[#F3F2F2]/60 transition-colors
                        ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'}`}
                    >
                      <td className="px-4 py-2.5 text-[#A8A8A8] font-mono text-[11px] whitespace-nowrap">
                        {String(idx + 1).padStart(3, '0')}0
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-[#3E3E3C]">{item.name}</p>
                        <p className="text-[10px] text-[#A8A8A8] mt-0.5 font-mono">
                          Mat. {item.id.toUpperCase()}-{2400 + idx}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 text-[#706E6B] whitespace-nowrap">{item.category}</td>
                      <td className="px-4 py-2.5 font-semibold text-[#3E3E3C] whitespace-nowrap">
                        {fmtQty(item.quantity, item.uom)}
                      </td>
                      <td className="px-4 py-2.5 text-[#3E3E3C] font-mono whitespace-nowrap">
                        {fmt(item.unit_price)}
                        <span className="text-[#A8A8A8] text-[10px] ml-1">/{item.uom === 'KG' ? 'KG' : 'MT'}</span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-[#3E3E3C] font-mono whitespace-nowrap">
                        {fmt(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#0176D3]/20 bg-[#F3F2F2]">
                    <td colSpan={5} className="px-4 py-3 text-right font-semibold text-[#706E6B] text-xs">
                      Grand Total
                    </td>
                    <td className="px-4 py-3 font-extrabold text-[#3E3E3C] font-mono">
                      {fmt(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>

        {/* ── Right sidebar (1/3) ────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Total value summary */}
          <div className="bg-[#0176D3] rounded-lg p-5 text-white shadow-md">
            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-1">Total Quote Value</p>
            <p className="text-3xl font-extrabold leading-tight">{fmt(grandTotal)}</p>
            <p className="text-white/60 text-xs mt-1">{lineItems.length} line item{lineItems.length !== 1 ? 's' : ''} · EUR</p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wide">Valid Until</p>
                <p className="font-semibold mt-0.5">{validStr}</p>
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wide">Customer</p>
                <p className="font-semibold mt-0.5 truncate">{customer.name}</p>
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wide">Products</p>
                <p className="font-semibold mt-0.5">{lineItems.length}</p>
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wide">AI Priced</p>
                <p className="font-semibold mt-0.5 text-green-300">✓ Yes</p>
              </div>
            </div>
          </div>

          {/* End-to-end process timeline */}
          <div className="bg-white rounded-lg border border-[#DDDBDA] shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#DDDBDA]">
              <CheckmarkCircleFilled fontSize={14} className="text-[#2E844A]" />
              <h3 className="text-xs font-bold text-[#3E3E3C] uppercase tracking-wide">End-to-End Flow</h3>
            </div>
            <ProcessTimeline opportunity={opportunity} customer={customer} quoteId={quoteId} />
          </div>

          {/* Next steps */}
          <div className="bg-white rounded-lg border border-[#DDDBDA] shadow-sm p-4">
            <h3 className="text-xs font-bold text-[#3E3E3C] uppercase tracking-wide mb-3 pb-2.5 border-b border-[#DDDBDA]">
              Next Steps
            </h3>
            <div className="space-y-1">
              {[
                { action: 'Create Sales Order',   btn: 'Create',   primary: true  },
                { action: 'Send PDF to Customer', btn: 'Send',     primary: false },
                { action: 'Schedule Follow-up',   btn: 'Schedule', primary: false },
              ].map((item) => (
                <div key={item.action} className="flex items-center justify-between py-2 border-b border-[#DDDBDA]/40 last:border-0">
                  <span className="text-xs text-[#706E6B]">{item.action}</span>
                  <Button
                    appearance={item.primary ? 'primary' : 'outline'}
                    size="small"
                    style={
                      item.primary
                        ? { backgroundColor: '#0176D3', borderColor: '#0176D3', fontSize: '11px' }
                        : { color: '#0176D3', borderColor: '#0176D3', fontSize: '11px' }
                    }
                  >
                    {item.btn}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              appearance="outline"
              icon={<ArrowLeftRegular />}
              style={{ flex: 1, color: '#0176D3', borderColor: '#0176D3', fontSize: '12px' }}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              appearance="primary"
              icon={<HomeRegular />}
              style={{ flex: 1, backgroundColor: '#3E3E3C', borderColor: '#3E3E3C', fontSize: '12px' }}
              onClick={onNewDeal}
            >
              New Deal
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
