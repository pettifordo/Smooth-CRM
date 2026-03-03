import { useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  AppsRegular,
  ChevronRightRegular,
  ChevronDownRegular,
  SearchRegular,
  ArrowTrendingRegular,
  PeopleRegular,
  MoneyRegular,
  TargetArrowRegular,
  ArrowRightRegular,
  MoreHorizontalRegular,
  AlertRegular,
  QuestionCircleRegular,
  SettingsRegular,
} from '@fluentui/react-icons'

/* ── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

const TIER_CLS = {
  Platinum: 'text-purple-700 bg-purple-50  border border-purple-200',
  Gold:     'text-amber-700  bg-amber-50   border border-amber-200',
  Silver:   'text-gray-600   bg-gray-50    border border-gray-200',
}

const STAGE_DOT = {
  Discovery:   '#FB8C00',
  Qualifying:  '#FDD835',
  Proposal:    '#42A5F5',
  Negotiation: '#AB47BC',
  Closed:      '#66BB6A',
}

/* ── SF Lightning Global Header ──────────────────────────────────────────── */
function SFGlobalNav() {
  return (
    <header className="bg-[#0176D3] h-12 flex items-center px-3 gap-1.5 shadow-md z-50 sticky top-0">

      {/* Apps / waffle launcher */}
      <button className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-colors flex-shrink-0">
        <AppsRegular fontSize={20} />
      </button>

      {/* Org logo */}
      <div className="flex items-center gap-1.5 flex-shrink-0 mr-1 border-r border-white/20 pr-3">
        <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-[#0176D3] font-extrabold text-[9px] tracking-tight leading-none">SC</span>
        </div>
        <span className="text-white font-semibold text-xs hidden lg:block">SpeChem CRM</span>
      </div>

      {/* Object nav tabs — each with dropdown chevron like real SF */}
      <div className="flex items-end gap-0 flex-shrink-0">
        {['Home', 'Accounts', 'Opportunities', 'Reports', 'Dashboards'].map((item) => (
          <button
            key={item}
            className={`flex items-center gap-0.5 px-2.5 py-1.5 text-xs text-white font-medium rounded-t transition-colors whitespace-nowrap
              ${item === 'Accounts'
                ? 'bg-white/20 border-b-2 border-white'
                : 'hover:bg-white/15'}`}
          >
            {item}
            <ChevronDownRegular fontSize={10} className="opacity-60 mt-px" />
          </button>
        ))}
      </div>

      {/* Global search — the most iconic SF Lightning element */}
      <div className="flex-1 mx-3 min-w-0 hidden md:block">
        <div className="flex items-center bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 rounded-full px-3 py-1.5 gap-2 cursor-text transition-all max-w-sm">
          <SearchRegular fontSize={13} className="text-white/80 flex-shrink-0" />
          <span className="text-white/65 text-xs truncate select-none">Search SpeChem…</span>
        </div>
      </div>

      {/* Utility icons — bell, help, gear, avatar */}
      <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
        <button className="relative w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <AlertRegular fontSize={17} />
          {/* notification dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full border border-[#0176D3]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <QuestionCircleRegular fontSize={17} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white rounded transition-colors">
          <SettingsRegular fontSize={17} />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#014486] border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white ml-1 cursor-pointer hover:border-white/60 transition-colors flex-shrink-0">
          SM
        </div>
      </div>
    </header>
  )
}

/* ── Metric card (SF Lightning–style) ───────────────────────────────────── */
function MetricCard({ label, value, sub, Icon, iconCls }) {
  return (
    <div className="bg-white rounded-lg border border-[#DDDBDA] shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconCls}`}>
        <Icon fontSize={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-[#706E6B] uppercase tracking-widest truncate">{label}</p>
        <p className="text-[1.35rem] font-bold text-[#3E3E3C] leading-tight">{value}</p>
        <p className="text-[11px] text-[#A8A8A8] mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function SalesDashboard({ customers, onSelectCustomer }) {
  const [search,    setSearch]    = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [sortCol,   setSortCol]   = useState('pipeline')
  const [sortAsc,   setSortAsc]   = useState(false)

  /* KPI computations */
  const allOpps       = customers.flatMap((c) => c.opportunities)
  const totalPipeline = allOpps.reduce((s, o) => s + o.value, 0)
  const activeDeals   = allOpps.filter((o) => o.stage !== 'Closed').length
  const closedDeals   = allOpps.filter((o) => o.stage === 'Closed').length
  const platCount     = customers.filter((c) => c.tier === 'Platinum').length
  const avgDeal       = allOpps.length ? Math.round(totalPipeline / allOpps.length) : 0

  /* Row helpers */
  const custPipeline  = (c) => c.opportunities.reduce((s, o) => s + o.value, 0)
  const openOppsCount = (c) => c.opportunities.filter((o) => o.stage !== 'Closed').length
  const lastStage     = (c) => {
    const opps = c.opportunities.filter((o) => o.stage !== 'Closed')
    return opps.length ? opps[opps.length - 1].stage : null
  }

  /* Filter + sort */
  const filtered = customers
    .filter((c) => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q)
      const matchTier = tierFilter === 'All' || c.tier === tierFilter
      return matchSearch && matchTier
    })
    .sort((a, b) => {
      if (sortCol === 'pipeline') {
        const diff = custPipeline(a) - custPipeline(b)
        return sortAsc ? diff : -diff
      }
      /* name sort */
      const diff = a.name.localeCompare(b.name)
      return sortAsc ? diff : -diff
    })

  const toggleSort = (col) => {
    if (sortCol === col) setSortAsc((p) => !p)
    else { setSortCol(col); setSortAsc(false) }
  }

  /* Sortable column header */
  const SortTh = ({ col, label, className = '' }) => (
    <th
      className={`px-3 py-2.5 text-xs font-semibold text-[#706E6B] uppercase tracking-wider cursor-pointer
                  select-none whitespace-nowrap hover:text-[#3E3E3C] transition-colors ${className}`}
      onClick={() => toggleSort(col)}
    >
      {label}
      <span className={`ml-1 text-[10px] ${sortCol === col ? 'text-[#0176D3]' : 'text-[#DDDBDA]'}`}>
        {sortCol === col ? (sortAsc ? '▲' : '▼') : '▲▼'}
      </span>
    </th>
  )

  const sortLabel = sortCol === 'pipeline' ? 'Pipeline Value' : 'Account Name'

  return (
    <div className="min-h-screen bg-[#F3F2F2] font-sans">
      <SFGlobalNav />

      {/* ── SF object sub-nav / breadcrumb ───────────────────────────────── */}
      <div className="bg-white border-b border-[#DDDBDA] px-6 flex items-center gap-2 text-sm sticky top-12 z-40 shadow-sm h-10">
        <button className="text-[#0176D3] hover:underline font-medium text-xs">Accounts</button>
        <ChevronRightRegular fontSize={12} className="text-[#A8A8A8]" />
        <span className="text-[#3E3E3C] font-medium text-xs">All Accounts</span>
        <div className="ml-auto text-[11px] text-[#A8A8A8]">
          {filtered.length} of {customers.length} records
        </div>
      </div>

      <div className="px-6 py-5">

        {/* ── List view header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#3E3E3C]">Accounts</h1>
            <button className="flex items-center gap-1 text-[#0176D3] text-xs font-medium hover:underline mt-0.5">
              All Accounts <ChevronDownRegular fontSize={11} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#3E3E3C] bg-white border border-[#DDDBDA] rounded hover:bg-[#F3F2F2] transition-colors">
              <MoreHorizontalRegular fontSize={14} /> Actions
            </button>
            <Button
              appearance="primary"
              size="small"
              style={{ backgroundColor: '#0176D3', borderColor: '#0176D3', fontSize: '12px', fontWeight: 600 }}
            >
              New
            </Button>
          </div>
        </div>

        {/* ── KPI metric cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <MetricCard label="Total Pipeline"  value={fmt(totalPipeline)} sub={`${allOpps.length} opportunities`} Icon={MoneyRegular}        iconCls="bg-[#EBF5FF] text-[#0176D3]" />
          <MetricCard label="Active Deals"    value={String(activeDeals)}  sub={`${closedDeals} closed`}          Icon={TargetArrowRegular}  iconCls="bg-green-50  text-green-600" />
          <MetricCard label="Accounts"        value={String(customers.length)} sub={`${platCount} Platinum`}    Icon={PeopleRegular}        iconCls="bg-purple-50 text-purple-600" />
          <MetricCard label="Avg. Deal Value" value={fmt(avgDeal)}          sub="Per opportunity"                Icon={ArrowTrendingRegular} iconCls="bg-amber-50  text-amber-600" />
        </div>

        {/* ── Filter + search bar (joined to table top) ─────────────────────── */}
        <div className="bg-white border border-[#DDDBDA] border-b-0 rounded-t-lg px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Tier pills */}
          <div className="flex items-center gap-1">
            {['All', 'Platinum', 'Gold', 'Silver'].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all
                  ${tierFilter === t
                    ? 'bg-[#0176D3] text-white border-[#0176D3] shadow-sm'
                    : 'text-[#706E6B] border-[#DDDBDA] bg-white hover:border-[#0176D3] hover:text-[#0176D3]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <SearchRegular
              fontSize={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A8A8A8] pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this list…"
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-[#DDDBDA] rounded bg-[#FAFAF9]
                         focus:outline-none focus:ring-2 focus:ring-[#0176D3]/30 focus:border-[#0176D3]
                         placeholder:text-[#A8A8A8]"
            />
          </div>
        </div>

        {/* ── Data table ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-b-lg border border-[#DDDBDA] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F3F2F2] border-b border-[#DDDBDA]">
                {/* Checkbox col */}
                <th className="w-10 px-3 py-2.5 text-left">
                  <div className="w-4 h-4 rounded border-2 border-[#DDDBDA] bg-white flex-shrink-0" />
                </th>
                <SortTh col="name"     label="Account Name" className="text-left" />
                <th className="px-3 py-2.5 text-left   text-xs font-semibold text-[#706E6B] uppercase tracking-wider">Region</th>
                <th className="px-3 py-2.5 text-left   text-xs font-semibold text-[#706E6B] uppercase tracking-wider">Segment</th>
                <th className="px-3 py-2.5 text-left   text-xs font-semibold text-[#706E6B] uppercase tracking-wider">Tier</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-[#706E6B] uppercase tracking-wider">Opps</th>
                <SortTh col="pipeline" label="Pipeline"    className="text-right" />
                <th className="px-3 py-2.5 text-left   text-xs font-semibold text-[#706E6B] uppercase tracking-wider">Stage</th>
                <th className="w-16 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, idx) => {
                const pipeline = custPipeline(customer)
                const open     = openOppsCount(customer)
                const stage    = lastStage(customer)
                const dot      = STAGE_DOT[stage] ?? '#DDDBDA'

                return (
                  <tr
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer)}
                    className={`border-b border-[#DDDBDA]/60 hover:bg-[#EBF5FF] cursor-pointer
                                transition-colors group
                                ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'}`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="w-4 h-4 rounded border-2 border-[#DDDBDA] bg-white
                                      group-hover:border-[#0176D3] transition-colors flex-shrink-0" />
                    </td>

                    {/* Account name — SF blue link */}
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-[#0176D3] group-hover:underline whitespace-nowrap">
                        {customer.name}
                      </span>
                    </td>

                    {/* Region */}
                    <td className="px-3 py-2.5 text-[#3E3E3C] text-xs">{customer.region}</td>

                    {/* Segment */}
                    <td className="px-3 py-2.5 text-[#706E6B] text-xs">{customer.segment}</td>

                    {/* Tier */}
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TIER_CLS[customer.tier] ?? 'text-gray-600 bg-gray-50 border border-gray-200'}`}>
                        {customer.tier}
                      </span>
                    </td>

                    {/* Open opps — blue badge */}
                    <td className="px-3 py-2.5 text-center">
                      {open > 0
                        ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0176D3]/10 text-[#0176D3] text-[11px] font-bold">{open}</span>
                        : <span className="text-[#A8A8A8] text-xs">—</span>
                      }
                    </td>

                    {/* Pipeline */}
                    <td className="px-3 py-2.5 text-right font-semibold text-[#3E3E3C] whitespace-nowrap text-xs">
                      {pipeline > 0
                        ? fmt(pipeline)
                        : <span className="text-[#A8A8A8] font-normal">—</span>
                      }
                    </td>

                    {/* Stage — colored dot + text */}
                    <td className="px-3 py-2.5">
                      {stage
                        ? (
                          <span className="flex items-center gap-1.5 text-[11px] text-[#3E3E3C]">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                            {stage}
                          </span>
                        )
                        : <span className="text-[#A8A8A8] text-xs">—</span>
                      }
                    </td>

                    {/* Row action — only visible on hover */}
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectCustomer(customer)}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5
                                   text-[#0176D3] text-[11px] font-medium hover:underline
                                   transition-opacity whitespace-nowrap"
                      >
                        View <ArrowRightRegular fontSize={11} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <SearchRegular fontSize={32} className="mx-auto mb-3 text-[#DDDBDA]" />
              <p className="text-sm font-medium text-[#706E6B]">No records found</p>
              <p className="text-xs mt-1 text-[#A8A8A8]">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Table footer — record count + sort info */}
          <div className="px-4 py-2.5 bg-[#F3F2F2] border-t border-[#DDDBDA] flex items-center justify-between">
            <span className="text-[11px] text-[#706E6B]">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[11px] text-[#A8A8A8]">
              Sorted by: <span className="text-[#706E6B] font-medium">{sortLabel}</span> ({sortAsc ? 'A–Z' : 'Z–A'})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
