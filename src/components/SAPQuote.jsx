import { useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  CheckmarkCircleFilled,
  ArrowRightFilled,
  DocumentRegular,
  PrintRegular,
  SendRegular,
  ArrowLeftRegular,
  HomeRegular,
  ChevronRightRegular,
  BuildingRegular,
  CalendarRegular,
  GlobeRegular,
  NumberSymbolRegular,
  TagMultipleRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n)

const fmtQty = (n, uom) =>
  `${n.toLocaleString()} ${uom === 'Metric Ton' ? 'MT' : 'KG'}`

/** Default quantities per product UOM for demo purposes */
const DEFAULT_QTY = { 'Metric Ton': 80, KG: 15000 }

/* ── SAP Shell Bar ───────────────────────────────────────────────────────── */
function SapShellBar({ onHome }) {
  return (
    <header className="bg-[#354A5E] h-[2.75rem] flex items-center px-4 gap-3 shadow-md sticky top-0 z-50">
      {/* Hamburger / nav */}
      <button className="w-7 h-7 flex flex-col items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
        <span className="w-4 h-0.5 bg-white rounded" />
        <span className="w-4 h-0.5 bg-white rounded" />
        <span className="w-4 h-0.5 bg-white rounded" />
      </button>

      {/* SAP wordmark / product name */}
      <div className="flex items-center gap-2">
        <div className="h-6 px-2 bg-[#0854A0] rounded flex items-center">
          <span className="text-white font-extrabold text-xs tracking-tight">SAP</span>
        </div>
        <span className="text-white/90 font-semibold text-sm">S/4HANA Cloud</span>
        <span className="text-white/30 text-sm">|</span>
        <span className="text-white/70 text-sm font-medium">Sales · Quotations</span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-white/60 text-sm hidden md:block">Sarah Mitchell</span>
        <div className="w-7 h-7 rounded-full bg-[#233142] border border-white/20
                        flex items-center justify-center text-white text-xs font-bold">
          SM
        </div>
        <button
          onClick={onHome}
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <HomeRegular fontSize={18} />
        </button>
      </div>
    </header>
  )
}

/* ── Process flow visual ─────────────────────────────────────────────────── */
function ProcessFlow({ opportunity, customer, quoteId }) {
  const steps = [
    {
      icon: '⚡',
      system: 'Salesforce CRM',
      label: 'Opportunity',
      detail: opportunity.title,
      sub: customer.name,
      color: 'border-[#0176D3] bg-[#EBF5FF]',
      iconBg: 'bg-[#0176D3]',
      badge: 'SFDC',
      badgeCls: 'bg-[#0176D3]/10 text-[#0176D3]',
    },
    {
      icon: '✦',
      system: 'AI Pricing Engine',
      label: 'Price Optimised',
      detail: `${opportunity.items.length} products`,
      sub: 'AI recommendations applied',
      color: 'border-violet-400 bg-violet-50',
      iconBg: 'bg-violet-600',
      badge: 'AI',
      badgeCls: 'bg-violet-100 text-violet-700',
    },
    {
      icon: '◈',
      system: 'SAP S/4HANA',
      label: 'Quote Created',
      detail: quoteId,
      sub: 'Document confirmed',
      color: 'border-[#0854A0] bg-[#E8F0FB]',
      iconBg: 'bg-[#0854A0]',
      badge: 'SAP',
      badgeCls: 'bg-[#0854A0]/10 text-[#0854A0]',
    },
  ]

  return (
    <div className="flex items-stretch gap-0 flex-wrap">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center flex-1 min-w-[180px]">
          {/* Card */}
          <div className={`flex-1 rounded-xl border-2 ${step.color} p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${step.iconBg} flex items-center justify-center
                               text-white font-bold text-sm`}>
                {step.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${step.badgeCls}`}>
                {step.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">{step.system}</p>
            <p className="font-bold text-gray-800 text-sm">{step.label}</p>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">{step.detail}</p>
            <p className="text-xs text-gray-400 mt-0.5">{step.sub}</p>
          </div>

          {/* Arrow connector */}
          {idx < steps.length - 1 && (
            <div className="flex flex-col items-center mx-2 flex-shrink-0">
              <div className="pulse-arrow">
                <ArrowRightFilled fontSize={24} className="text-gray-400" />
              </div>
            </div>
          )}
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

  const subtotal = lineItems.reduce((s, li) => s + li.total, 0)
  const tax      = subtotal * 0.0  // B2B / zero-rated for demo
  const grandTotal = subtotal + tax

  /* Fake document metadata */
  const today    = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)
  const validStr = validUntil.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-sap-bg font-sans">
      <SapShellBar onHome={onNewDeal} />

      {/* SAP breadcrumb */}
      <div className="bg-white border-b border-sap-border px-6 py-2 flex items-center gap-1.5 text-xs sticky top-[2.75rem] z-40">
        <span className="text-sap-blue hover:underline cursor-pointer font-medium">Sales</span>
        <ChevronRightRegular fontSize={12} className="text-sap-text-2" />
        <span className="text-sap-blue hover:underline cursor-pointer font-medium">Quotations</span>
        <ChevronRightRegular fontSize={12} className="text-sap-text-2" />
        <span className="text-sap-text font-semibold">{quoteId}</span>
      </div>

      {/* ── Success banner ─────────────────────────────────────────────── */}
      <div className="fade-in-up mx-6 mt-5">
        <div className="bg-[#107E3E] rounded-xl p-4 flex items-center gap-4 shadow-md">
          <CheckmarkCircleFilled fontSize={32} className="text-white flex-shrink-0" />
          <div className="flex-1 text-white">
            <p className="font-bold text-base">Quote successfully created in SAP S/4HANA</p>
            <p className="text-green-100 text-sm mt-0.5">
              Document <span className="font-extrabold">{quoteId}</span> has been posted
              in Sales · Quotations. The customer may now be notified.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              appearance="outline"
              icon={<PrintRegular />}
              style={{
                color: 'white', borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
              onClick={() => setPrinted(true)}
            >
              {printed ? 'Printed ✓' : 'Print'}
            </Button>
            <Button
              appearance="primary"
              icon={<SendRegular />}
              style={{ backgroundColor: '#FFFFFF', color: '#107E3E', fontWeight: 700 }}
            >
              Send to Customer
            </Button>
          </div>
        </div>
      </div>

      {/* ── Quote document ─────────────────────────────────────────────── */}
      <div className="px-6 py-5 grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: Quote detail */}
        <div className="xl:col-span-2 space-y-4">

          {/* Document header card */}
          <div className="bg-white rounded-xl border border-sap-border shadow-sap-card overflow-hidden">
            {/* SAP blue accent */}
            <div className="h-1 bg-[#0854A0]" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#E8F0FB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <DocumentRegular fontSize={24} className="text-[#0854A0]" />
                  </div>
                  <div>
                    <p className="text-xs text-sap-text-2 font-medium uppercase tracking-wider">Quotation</p>
                    <h1 className="text-xl font-bold text-sap-text">{quoteId}</h1>
                    <p className="text-sm text-sap-text-2 mt-0.5">{opportunity.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sap-text-2 font-medium uppercase tracking-wider">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#107E3E]/10
                                   text-[#107E3E] rounded-full text-sm font-bold border border-[#107E3E]/20 mt-1">
                    <CheckmarkCircleFilled fontSize={13} /> Created
                  </span>
                </div>
              </div>

              {/* Meta fields grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mt-5 pt-5
                              border-t border-sap-border text-sm">
                {[
                  { label: 'Sold-To Party',  value: customer.name,     icon: BuildingRegular },
                  { label: 'Created On',     value: today,             icon: CalendarRegular },
                  { label: 'Valid Until',    value: validStr,          icon: CalendarRegular },
                  { label: 'Sales Office',   value: customer.region,   icon: GlobeRegular },
                  { label: 'Document No.',   value: quoteId,           icon: NumberSymbolRegular },
                  { label: 'Segment',        value: customer.segment,  icon: TagMultipleRegular },
                  { label: 'Tier',           value: customer.tier,     icon: null },
                  { label: 'Currency',       value: 'EUR',             icon: null },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <p className="text-xs text-sap-text-2 font-semibold uppercase tracking-wider flex items-center gap-1">
                      {Icon && <Icon fontSize={11} />} {label}
                    </p>
                    <p className="font-semibold text-sap-text mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="bg-white rounded-xl border border-sap-border shadow-sap-card overflow-hidden">
            <div className="px-5 py-3 border-b border-sap-border bg-[#F7F7F7]">
              <h2 className="text-sm font-bold text-sap-text">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F0F0F0] border-b border-sap-border">
                    {['Item', 'Material', 'Category', 'Quantity', 'Unit Price', 'Net Value'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs font-bold text-sap-text-2
                                   uppercase tracking-wider"
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
                      className={`border-b border-sap-border/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}
                    >
                      <td className="px-4 py-3 text-sap-text-2 font-mono text-xs">
                        {String(idx + 1).padStart(3, '0')}0
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sap-text">{item.name}</p>
                        <p className="text-xs text-sap-text-2 mt-0.5">
                          Mat. {item.id.toUpperCase()}-{2400 + idx}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sap-text-2">{item.category}</td>
                      <td className="px-4 py-3 text-sap-text font-semibold">
                        {fmtQty(item.quantity, item.uom)}
                      </td>
                      <td className="px-4 py-3 text-sap-text font-mono">
                        {fmt(item.unit_price)}
                        <span className="text-sap-text-2 text-xs ml-1">/{item.uom === 'KG' ? 'KG' : 'MT'}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-sap-text font-mono">
                        {fmt(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F0F0F0] border-t-2 border-[#0854A0]/30">
                    <td colSpan={5} className="px-4 py-3 text-right font-bold text-sap-text">
                      Subtotal
                    </td>
                    <td className="px-4 py-3 font-extrabold text-sap-text font-mono text-base">
                      {fmt(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Process flow */}
          <div className="bg-white rounded-xl border border-sap-border shadow-sap-card p-5">
            <h3 className="text-sm font-bold text-sap-text mb-4 pb-2 border-b border-sap-border flex items-center gap-2">
              <CheckmarkCircleFilled fontSize={16} className="text-[#107E3E]" />
              End-to-End Flow
            </h3>
            <ProcessFlow opportunity={opportunity} customer={customer} quoteId={quoteId} />
          </div>

          {/* Summary card */}
          <div className="bg-[#0854A0] rounded-xl p-5 text-white shadow-md">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Total Quote Value</p>
            <p className="text-3xl font-extrabold">{fmt(grandTotal)}</p>
            <p className="text-white/60 text-sm mt-1">{lineItems.length} line items · EUR</p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/60 text-xs">Products</p>
                <p className="font-bold">{lineItems.length}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Valid Until</p>
                <p className="font-bold">{validStr}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Customer</p>
                <p className="font-bold truncate">{customer.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">AI Priced</p>
                <p className="font-bold text-green-300">✓ Yes</p>
              </div>
            </div>
          </div>

          {/* Next actions */}
          <div className="bg-white rounded-xl border border-sap-border shadow-sap-card p-5">
            <h3 className="text-sm font-bold text-sap-text mb-3">Next Steps</h3>
            <div className="space-y-2">
              {[
                { action: 'Create Sales Order',   btn: 'Create',  primary: true  },
                { action: 'Send PDF to Customer', btn: 'Send',    primary: false },
                { action: 'Schedule Follow-up',   btn: 'Schedule',primary: false },
              ].map((item) => (
                <div key={item.action} className="flex items-center justify-between py-2 border-b border-sap-border/40 last:border-0">
                  <span className="text-sm text-sap-text-2">{item.action}</span>
                  <Button
                    appearance={item.primary ? 'primary' : 'outline'}
                    size="small"
                    style={
                      item.primary
                        ? { backgroundColor: '#0854A0', borderColor: '#0854A0', fontSize: '12px' }
                        : { color: '#0854A0', borderColor: '#0854A0', fontSize: '12px' }
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
              style={{ flex: 1, color: '#0854A0', borderColor: '#0854A0' }}
              onClick={onBack}
            >
              Back to Pricing
            </Button>
            <Button
              appearance="primary"
              icon={<HomeRegular />}
              style={{ flex: 1, backgroundColor: '#354A5E', borderColor: '#354A5E' }}
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
