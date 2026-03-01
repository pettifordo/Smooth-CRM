import { useState } from 'react'
import SalesDashboard  from './components/SalesDashboard'
import OpportunityList from './components/OpportunityList'
import OpportunityView from './components/OpportunityView'
import PricingEngine   from './components/PricingEngine'
import SAPQuote        from './components/SAPQuote'
import data from './data.json'

export default function App() {
  const [view,                setView]                = useState('dashboard')
  const [selectedCustomer,    setSelectedCustomer]    = useState(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [pricingData,         setPricingData]         = useState({})
  const [quoteId]                                     = useState('#80004521')

  /** Central navigation helper */
  const navigate = (nextView, customer = null, opportunity = null) => {
    if (customer)    setSelectedCustomer(customer)
    if (opportunity) setSelectedOpportunity(opportunity)
    setView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome     = () => navigate('dashboard')
  const goAccounts = () => navigate('dashboard')

  switch (view) {
    case 'dashboard':
      return (
        <SalesDashboard
          customers={data.customers}
          products={data.products}
          onSelectCustomer={(c) => navigate('opportunity-list', c)}
        />
      )

    case 'opportunity-list':
      return (
        <OpportunityList
          customer={selectedCustomer}
          products={data.products}
          onSelectOpportunity={(opp) => navigate('opportunity-view', null, opp)}
          onBack={goAccounts}
          onHome={goHome}
          onAccounts={goAccounts}
        />
      )

    case 'opportunity-view':
      return (
        <OpportunityView
          opportunity={selectedOpportunity}
          customer={selectedCustomer}
          products={data.products}
          onConfigurePricing={() => navigate('pricing-engine')}
          onBack={() => navigate('opportunity-list')}
          onHome={goHome}
          onAccounts={goAccounts}
        />
      )

    case 'pricing-engine':
      return (
        <PricingEngine
          opportunity={selectedOpportunity}
          customer={selectedCustomer}
          products={data.products}
          onGenerateQuote={(pricing) => {
            setPricingData(pricing)
            navigate('sap-quote')
          }}
          onBack={() => navigate('opportunity-view')}
          onHome={goHome}
          onAccounts={goAccounts}
        />
      )

    case 'sap-quote':
      return (
        <SAPQuote
          opportunity={selectedOpportunity}
          customer={selectedCustomer}
          products={data.products}
          pricingData={pricingData}
          quoteId={quoteId}
          onBack={() => navigate('pricing-engine')}
          onNewDeal={goHome}
          onHome={goHome}
        />
      )

    default:
      return null
  }
}
