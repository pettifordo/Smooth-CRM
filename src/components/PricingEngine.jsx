import { useState } from 'react'
import { Button, Spinner } from '@fluentui/react-components'
import {
  SparkleRegular,
  AppsRegular,
  ChevronRightRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
  InfoRegular,
  WarningRegular,
  CheckmarkCircleFilled,
  LockClosedRegular,
  BuildingRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const fmtUnit = (n, uom) =>
  uom === 'KG'
    ? `€${Number(n).toFixed(2)}`
    : `€${Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const pct = (price, floor) =>
  floor > 0 ? (((price - floor) / price) * 100).toFixed(1) : '0.0'

function aiPrice(product) {
  switch (product.id) {
    case 'p1': return Math.round(product.list_price * 1.02 * 100) / 100
    case 'p2': return product.floor_price
    case 's1': return Math.round(product.floor_price * 1.15 * 100) / 100
    case 's2': return product.list_price
    default:   return product.list_price
  }
}

const TREND_CONFIG = {
  'Rising':        { cls: 'bg-green-50   text-green-700  border-green-200',  dot: 'bg-green-500'  },
  'Stable':        { cls: 'bg-gray-50    text-gray-600   border-gray-200',   dot: 'bg-gray-400'   },
  'Strong Growth': { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Volatile':      { cls: 'bg-amber-50  text-amber-700  border-amber-200',  dot: 'bg-amber-500'  },
}

/* ── SF Nav (shared look) ────────────────────────────────────────────────── */
function SFNav({ onBack, opportunityTitle }) {
  return (
    <nav className="bg-[#0176D3] h-12 flex items-center px-4 gap-3 shadow-md z-50 sticky top-0">
      <button
        onClick={onBack}
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

/* ── AI Insight expansion row ────────────────────────────────────────────── */
function InsightRow({ product }) {
  const tc = TREND_CONFIG[product.market_trend] ?? TREND_CONFIG.Stable
  return (
    <tr className="slide-down">
      <td colSpan={9} className="px-4 pb-3 pt-0">
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-start gap-3">
          <SparkleRegular fontSize={18} className="text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-violet-800 mb-0.5">AI Recommendation</p>
            <p className="text-sm text-violet-700">{product.ai_recommendation}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${tc.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                {product.market_trend}
              </span>
              <span className="text-xs text-sf-text-3">Market trend</span>
            </div>
          </div>
          <CheckmarkCircleFilled fontSize={16} className="text-violet-500 flex-shrink-0" />
        </div>
      </td>
    </tr>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function PricingEngine({ opportunity, customer, products, onGenerateQuote, onBack }) {
  const oppProducts = opportunity.items
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const [prices,    setPrices]    = useState(() => Object.fromEntries(oppProducts.map((p) => [p.id, p.list_price])))
  const [aiStatus,  setAiStatus]  = useState('idle') // idle | loading | applied
  const [flash,     setFlash]     = useState({})
  const [insights,  setInsights]  = useState({})

  const handlePriceChange = (id, val) => {
    const n = parseFloat(val)
    if (!isNaN(n)) setPrices((prev) => ({ ...prev, [id]: n }))
  }

  const applyAI = () => {
    setAiStatus('loading')
    setTimeout(() => {
      const newPrices = Object.fromEntries(oppProducts.map((p) => [p.id, aiPrice(p)]))
      setPrices(newPrices)
      setInsights(Object.fromEntries(oppProducts.map((p) => [p.id, true])))
      setAiStatus('applied')
      const flashMap = Object.fromEntries(oppProducts.map((p) => [p.id, true]))
      setFlash(flashMap)
      setTimeout(() => setFlash({}), 1400)
    }, 1600)
  }

  const totalEstimate = oppProducts.reduce((s, p) => {
    const qty = p.uom === 'KG' ? 15000 : 80
    return s + prices[p.id] * qty
  }, 0)

  return (
    <div className="min-h-screen bg-sf-bg font-sans">

      {/* ── Salesforce-style nav ─────────────────────────────────────────── */}
      <SFNav onBack={onBack} opportunityTitle={opportunity.title} />

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-sf-border px-6 py-2.5 flex items-center gap-2 text-sm sticky top-12 z-40 shadow-sm">
        <button onClick={onBack} className="text-sf-blue hover:underline font-medium">Accounts</button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <button onClick={onBack} className="text-sf-blue hover:underline font-medium">{customer.name}</button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <button onClick={onBack} className="text-sf-blue hover:underline font-medium">{opportunity.title}</button>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <span className="text-sf-text-3 flex items-center gap-1.5">
          <SparkleRegular fontSize={13} className="text-violet-500" /> AI Pricing Engine
        </span>
      </div>

      {/* ── Record header ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-sf-border">
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* Icon + title */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700
                              flex items-center justify-center shadow-md flex-shrink-0">
                <SparkleRegular fontSize={26} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider mb-0.5">
                  AI Pricing Engine
                </p>
                <h1 className="text-2xl font-bold text-sf-text">{opportunity.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-sf-text-2">
                  <span className="flex items-center gap-1">
                    <BuildingRegular fontSize={13} className="text-sf-text-3" /> {customer.name}
                  </span>
                  <span className="text-sf-text-3">·</span>
                  <span>{customer.segment}</span>
                  <span className="text-sf-text-3">·</span>
                  <span>{customer.region}</span>
                </div>
              </div>
            </div>

            {/* AI action */}
            <div className="flex items-center gap-3 flex-wrap">
              {aiStatus === 'idle' && (
                <Button
                  appearance="primary"
                  icon={<SparkleRegular />}
                  style={{ backgroundColor: '#7C3AED', borderColor: '#6D28D9', fontWeight: 600 }}
                  onClick={applyAI}
                >
                  Apply AI Recommendations
                </Button>
              )}
              {aiStatus === 'loading' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                  <Spinner size="tiny" />
                  <span className="text-violet-700 text-sm font-medium">Analysing market data…</span>
                </div>
              )}
              {aiStatus === 'applied' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckmarkCircleFilled fontSize={16} className="text-green-600" />
                  <span className="text-green-700 text-sm font-medium">AI prices applied</span>
                  <button
                    onClick={() => setAiStatus('idle')}
                    className="text-xs text-green-500 hover:text-green-700 ml-1 underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-sf-border text-sm">
            <div>
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Target Value</p>
              <p className="text-xl font-bold text-sf-blue mt-0.5">{fmt(opportunity.value)}</p>
            </div>
            <div className="h-8 w-px bg-sf-border self-center" />
            <div>
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Products</p>
              <p className="text-xl font-bold text-sf-text mt-0.5">{oppProducts.length}</p>
            </div>
            <div className="h-8 w-px bg-sf-border self-center" />
            <div>
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">Est. Quote Total</p>
              <p className={`text-xl font-bold mt-0.5 ${aiStatus === 'applied' ? 'text-green-600' : 'text-sf-text'}`}>
                {fmt(totalEstimate)}
              </p>
            </div>
            <div className="h-8 w-px bg-sf-border self-center" />
            <div>
              <p className="text-xs text-sf-text-3 font-semibold uppercase tracking-wider">AI Engine</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                               bg-violet-100 text-violet-700 border border-violet-200 mt-1">
                <SparkleRegular fontSize={11} /> v2.4 · Chem-Optimised
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing table card ───────────────────────────────────────────── */}
      <div className="px-6 py-5 space-y-4">
        <div className="bg-white rounded-lg border border-sf-border shadow-sf-card overflow-hidden">

          {/* Table header bar */}
          <div className="px-4 py-3 border-b border-sf-border bg-sf-bg flex items-center justify-between">
            <h2 className="text-sm font-bold text-sf-text flex items-center gap-2">
              <LockClosedRegular fontSize={14} className="text-sf-text-3" />
              Pricing Grid — {oppProducts.length} Product{oppProducts.length !== 1 ? 's' : ''}
            </h2>
            <span className="text-sf-text-3 text-xs flex items-center gap-1">
              <InfoRegular fontSize={12} />
              Customer-specific prices — not shared externally
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sf-bg border-b border-sf-border">
                  {[
                    { label: 'Product',         cls: 'text-left  px-4 py-3' },
                    { label: 'Category',        cls: 'text-left  px-4 py-3' },
                    { label: 'UOM',             cls: 'text-left  px-4 py-3' },
                    { label: 'Floor Price',     cls: 'text-right px-4 py-3' },
                    { label: 'List Price',      cls: 'text-right px-4 py-3' },
                    { label: 'Customer Price',  cls: 'text-right px-4 py-3' },
                    { label: 'Margin %',        cls: 'text-right px-4 py-3' },
                    { label: 'Market Trend',    cls: 'text-center px-4 py-3' },
                    { label: '',                cls: 'px-4 py-3' },
                  ].map(({ label, cls }) => (
                    <th
                      key={label}
                      className={`${cls} text-xs font-semibold text-sf-text-3 uppercase tracking-wider`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {oppProducts.map((product, idx) => {
                  const currentPrice = prices[product.id]
                  const margin       = pct(currentPrice, product.floor_price)
                  const belowFloor   = currentPrice < product.floor_price
                  const aiApplied    = aiStatus === 'applied'
                  const isFlashing   = flash[product.id]
                  const showInsight  = insights[product.id]
                  const tc           = TREND_CONFIG[product.market_trend] ?? TREND_CONFIG.Stable

                  return (
                    <>
                      <tr
                        key={product.id}
                        className={`border-b border-sf-border/60 transition-colors hover:bg-[#EBF5FF]
                          ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'}`}
                      >
                        {/* Product */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200
                                            flex items-center justify-center flex-shrink-0">
                              <SparkleRegular fontSize={14} className="text-violet-600" />
                            </div>
                            <span className="font-semibold text-sf-text">{product.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-sf-bg rounded text-xs text-sf-text-2
                                           border border-sf-border font-medium">
                            {product.category}
                          </span>
                        </td>

                        {/* UOM */}
                        <td className="px-4 py-3.5 text-sf-text-2 text-xs">{product.uom}</td>

                        {/* Floor price */}
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-red-600 font-semibold font-mono text-sm">
                            {fmtUnit(product.floor_price, product.uom)}
                          </span>
                        </td>

                        {/* List price */}
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-sf-text-2 font-mono text-sm">
                            {fmtUnit(product.list_price, product.uom)}
                          </span>
                        </td>

                        {/* Customer price — editable */}
                        <td className="px-4 py-3.5 text-right">
                          <div className={isFlashing ? 'price-flash rounded-lg inline-block' : 'inline-block'}>
                            <div
                              className={`flex items-center rounded-lg border overflow-hidden
                                ${belowFloor
                                  ? 'border-red-400 bg-red-50'
                                  : aiApplied
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-sf-border bg-white focus-within:border-sf-blue focus-within:ring-2 focus-within:ring-sf-blue/20'}`}
                            >
                              <span className={`px-2 py-1.5 text-sm font-mono border-r
                                ${belowFloor ? 'bg-red-100 text-red-500 border-red-300'
                                  : aiApplied ? 'bg-green-100 text-green-600 border-green-300'
                                  : 'bg-sf-bg text-sf-text-3 border-sf-border'}`}>
                                €
                              </span>
                              <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className="w-24 text-right px-2 py-1.5 text-sm font-bold font-mono
                                           bg-transparent focus:outline-none text-sf-text
                                           [appearance:textfield]
                                           [&::-webkit-inner-spin-button]:appearance-none
                                           [&::-webkit-outer-spin-button]:appearance-none"
                                step={product.uom === 'KG' ? '0.01' : '1'}
                                min={product.floor_price}
                              />
                            </div>
                          </div>
                          {belowFloor && (
                            <p className="text-red-500 text-xs mt-0.5 flex items-center justify-end gap-1">
                              <WarningRegular fontSize={11} /> Below floor
                            </p>
                          )}
                        </td>

                        {/* Margin % */}
                        <td className="px-4 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full
                                        text-xs font-bold border
                              ${parseFloat(margin) < 5
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : parseFloat(margin) < 12
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-green-50 text-green-700 border-green-200'}`}
                          >
                            {margin}%
                          </span>
                        </td>

                        {/* Market trend */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border
                                           flex items-center justify-center gap-1.5 ${tc.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                            {product.market_trend}
                          </span>
                        </td>

                        {/* AI insight toggle */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() =>
                              setInsights((prev) => ({ ...prev, [product.id]: !prev[product.id] }))
                            }
                            title="Toggle AI Insight"
                            className={`p-1.5 rounded-lg transition-colors border
                              ${showInsight
                                ? 'bg-violet-100 text-violet-700 border-violet-200'
                                : 'bg-white text-sf-text-3 border-sf-border hover:border-violet-300 hover:text-violet-600'}`}
                          >
                            <SparkleRegular fontSize={15} />
                          </button>
                        </td>
                      </tr>

                      {showInsight && <InsightRow key={`insight-${product.id}`} product={product} />}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 bg-sf-bg border-t border-sf-border flex items-center justify-between">
            <span className="text-sf-text-3 text-xs flex items-center gap-1">
              <LockClosedRegular fontSize={11} />
              Floor price = hard minimum. Customer prices are confidential.
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-sf-text-2">Est. Quote Total:</span>
              <span className={`font-bold ${aiStatus === 'applied' ? 'text-green-600' : 'text-sf-text'}`}>
                {fmt(totalEstimate)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Action bar ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-sf-border shadow-sf-card p-4
                        flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-sf-text-2">
            <span>
              <span className="font-semibold text-sf-text">{oppProducts.length} products</span> configured
            </span>
            {aiStatus === 'applied' && (
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <CheckmarkCircleFilled fontSize={13} />
                AI optimised
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              appearance="outline"
              icon={<ArrowLeftRegular />}
              style={{ color: '#0176D3', borderColor: '#0176D3' }}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              appearance="primary"
              icon={<ArrowRightRegular />}
              iconPosition="after"
              size="large"
              style={{
                backgroundColor: '#0176D3',
                borderColor: '#014486',
                fontWeight: 700,
                padding: '8px 28px',
              }}
              onClick={() => onGenerateQuote(prices)}
            >
              Generate SAP Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
