import { useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  AppsRegular,
  ChevronRightRegular,
  SearchRegular,
  ArrowTrendingRegular,
  PeopleRegular,
  MoneyRegular,
  TargetArrowRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const TIER_CLS = {
  Platinum: 'bg-purple-100 text-purple-800 border border-purple-300',
  Gold:     'bg-amber-100  text-amber-800  border border-amber-300',
  Silver:   'bg-gray-100   text-gray-600   border border-gray-300',
}

const STAGE_CLS = {
  Discovery:   'bg-orange-100 text-orange-800',
  Qualifying:  'bg-yellow-100 text-yellow-800',
  Proposal:    'bg-sky-100    text-sky-800',
  Negotiation: 'bg-violet-100 text-violet-800',
  Closed:      'bg-green-100  text-green-800',
}

/* ── SF Top-Nav ──────────────────────────────────────────────────────────── */
function SFNav({ userName = 'Sarah Mitchell', initials = 'SM' }) {
  const navItems = ['Home', 'Accounts', 'Opportunities', 'Reports', 'Dashboards']
  return (
    <nav className="bg-[#0176D3] h-12 flex items-center px-4 gap-3 shadow-md z-50 sticky top-0">
      {/* Grid / waffle */}
      <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#014486] rounded transition-colors">
        <AppsRegular fontSize={20} />
      </button>

      {/* Logo mark */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
          <span className="text-[#0176D3] font-extrabold text-xs tracking-tight">SC</span>
        </div>
        <span className="text-white font-semibold text-sm hidden md:block">SpeChem CRM</span>
      </div>

      {/* Nav items */}
      <div className="flex items-end gap-0.5 flex-1">
        {navItems.map((item) => (
          <button
            key={item}
            className={`px-3 py-1.5 text-sm text-white rounded-t font-medium transition-colors
              ${item === 'Accounts'
                ? 'bg-[#014486] border-b-2 border-white'
                : 'hover:bg-[#014486]'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* User */}
      <div className="flex items-center gap-2 text-white ml-auto">
        <span className="text-sm hidden md:block font-medium">{userName}</span>
        <div className="w-8 h-8 rounded-full bg-[#014486] border-2 border-white/40 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </nav>
  )
}

/* ── KPI card ────────────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, iconColor, accentColor }) {
  return (
    <div className="bg-white rounded-lg border border-sf-border shadow-sf-card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-sf-text-3 uppercase tracking-widest">{label}</p>
          <p className={`text-[1.75rem] font-bold mt-1 leading-none ${accentColor}`}>{value}</p>
          <p className="text-xs text-sf-text-3 mt-1.5">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
          <Icon fontSize={20} />
        </div>
      </div>
    </div>
  )
}

/* ── Tier badge ──────────────────────────────────────────────────────────── */
function TierBadge({ tier }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_CLS[tier] ?? 'bg-gray-100 text-gray-600'}`}>
      {tier}
    </span>
  )
}

/* ── Stage badge ─────────────────────────────────────────────────────────── */
function StageBadge({ stage }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STAGE_CLS[stage] ?? 'bg-gray-100 text-gray-600'}`}>
      {stage}
    </span>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function SalesDashboard({ customers, onSelectCustomer }) {
  const [search,    setSearch]    = useState('')
  const [tierFilter, setTierFilter] = useState('All')

  /* KPI computations */
  const allOpps       = customers.flatMap((c) => c.opportunities)
  const totalPipeline = allOpps.reduce((s, o) => s + o.value, 0)
  const activeDeals   = allOpps.filter((o) => o.stage !== 'Closed').length
  const closedDeals   = allOpps.filter((o) => o.stage === 'Closed').length
  const platCount     = customers.filter((c) => c.tier === 'Platinum').length
  const avgDeal       = allOpps.length ? Math.round(totalPipeline / allOpps.length) : 0

  /* Filtered rows */
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.segment.toLowerCase().includes(q)
    const matchTier = tierFilter === 'All' || c.tier === tierFilter
    return matchSearch && matchTier
  })

  const custPipeline = (c) => c.opportunities.reduce((s, o) => s + o.value, 0)
  const openOppsCount = (c) => c.opportunities.filter((o) => o.stage !== 'Closed').length
  const lastStage = (c) => {
    const opps = c.opportunities.filter((o) => o.stage !== 'Closed')
    return opps.length ? opps[opps.length - 1].stage : null
  }

  return (
    <div className="min-h-screen bg-sf-bg font-sans">
      <SFNav />

      {/* Sub-header / breadcrumb */}
      <div className="bg-white border-b border-sf-border px-6 py-2.5 flex items-center gap-2 text-sm sticky top-12 z-40 shadow-sm">
        <span className="text-sf-blue font-medium cursor-pointer hover:underline">Accounts</span>
        <ChevronRightRegular fontSize={14} className="text-sf-text-3" />
        <span className="text-sf-text-3">All Accounts</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sf-text-3 text-xs">{filtered.length} of {customers.length} records</span>
        </div>
      </div>

      <div className="px-6 py-5">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Total Pipeline"
            value={fmt(totalPipeline)}
            sub={`${allOpps.length} opportunities`}
            icon={MoneyRegular}
            iconColor="bg-blue-50 text-sf-blue"
            accentColor="text-sf-blue"
          />
          <KpiCard
            label="Active Deals"
            value={String(activeDeals)}
            sub={`${closedDeals} closed`}
            icon={TargetArrowRegular}
            iconColor="bg-green-50 text-green-600"
            accentColor="text-green-600"
          />
          <KpiCard
            label="Accounts"
            value={String(customers.length)}
            sub={`${platCount} Platinum`}
            icon={PeopleRegular}
            iconColor="bg-purple-50 text-purple-600"
            accentColor="text-purple-700"
          />
          <KpiCard
            label="Avg. Deal Value"
            value={fmt(avgDeal)}
            sub="Per opportunity"
            icon={ArrowTrendingRegular}
            iconColor="bg-amber-50 text-amber-600"
            accentColor="text-amber-700"
          />
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Tier pills */}
          <div className="flex bg-white rounded-full border border-sf-border p-0.5 shadow-sm">
            {['All', 'Platinum', 'Gold', 'Silver'].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all
                  ${tierFilter === t
                    ? 'bg-sf-blue text-white shadow-sm'
                    : 'text-sf-text-2 hover:text-sf-text'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <SearchRegular
              fontSize={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-text-3 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts, regions, segments…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-sf-border rounded-full bg-white
                         focus:outline-none focus:ring-2 focus:ring-sf-blue/40 focus:border-sf-blue
                         placeholder:text-sf-text-3 shadow-sm"
            />
          </div>

          <div className="ml-auto">
            <Button
              appearance="primary"
              style={{ backgroundColor: '#0176D3', borderColor: '#0176D3' }}
            >
              + New Account
            </Button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-lg border border-sf-border shadow-sf-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sf-bg border-b border-sf-border">
                {['Account Name', 'Region', 'Segment', 'Tier', 'Active Opps', 'Pipeline Value', 'Last Stage', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-sf-text-3 uppercase tracking-wider select-none"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, idx) => {
                const pipeline = custPipeline(customer)
                const open     = openOppsCount(customer)
                const stage    = lastStage(customer)

                return (
                  <tr
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer)}
                    className={`border-b border-sf-border/60 hover:bg-[#EBF5FF] cursor-pointer
                                transition-colors group ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3 font-semibold text-sf-blue group-hover:underline whitespace-nowrap">
                      {customer.name}
                    </td>
                    {/* Region */}
                    <td className="px-4 py-3 text-sf-text-2">{customer.region}</td>
                    {/* Segment */}
                    <td className="px-4 py-3 text-sf-text-2">{customer.segment}</td>
                    {/* Tier */}
                    <td className="px-4 py-3">
                      <TierBadge tier={customer.tier} />
                    </td>
                    {/* Open opps */}
                    <td className="px-4 py-3">
                      {open > 0 ? (
                        <span className="font-semibold text-sf-text">{open}</span>
                      ) : (
                        <span className="text-sf-text-3">—</span>
                      )}
                    </td>
                    {/* Pipeline */}
                    <td className="px-4 py-3 font-semibold text-sf-text whitespace-nowrap">
                      {pipeline > 0 ? fmt(pipeline) : <span className="text-sf-text-3 font-normal">—</span>}
                    </td>
                    {/* Stage */}
                    <td className="px-4 py-3">
                      {stage ? <StageBadge stage={stage} /> : <span className="text-sf-text-3">—</span>}
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectCustomer(customer) }}
                        className="flex items-center gap-1 text-sf-blue text-xs font-medium
                                   hover:gap-2 transition-all"
                      >
                        View <ArrowRightRegular fontSize={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-sf-text-3">
              <SearchRegular fontSize={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No accounts found matching your criteria.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-sf-text-3 mt-2 px-1">
          {filtered.length} account{filtered.length !== 1 ? 's' : ''} • Pipeline totals reflect all open opportunities
        </p>
      </div>
    </div>
  )
}
