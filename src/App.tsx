import { useState, useMemo } from 'react'
import type { Province, Event } from './types'
import Header from './components/Header'
import ProvinceFilter from './components/ProvinceFilter'
import EventSection from './components/EventSection'
import EventStructuredData from './components/EventStructuredData'
import Contributors from './components/Contributors'
import About from './components/About'
import eventsData from './data/events.json'
import './App.scss'

function App() {
  const [selectedProvince, setSelectedProvince] = useState<Province | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home')

  const filteredEvents = useMemo(() => {
    const events = eventsData.events as Event[]
    if (selectedProvince === 'ALL') {
      return events
    }
    return events.filter(event => event.province === selectedProvince)
  }, [selectedProvince])

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />
      case 'home':
      default:
        return (
          <>
            <ProvinceFilter 
              selectedProvince={selectedProvince}
              onProvinceChange={setSelectedProvince}
            />
            <EventSection events={filteredEvents} />
            <Contributors />
          </>
        )
    }
  }

  const handleNavigation = (page: string) => {
    if (page === 'home' || page === 'about') {
      setCurrentPage(page)
    }
  }

  return (
    <div className="app">
      <EventStructuredData events={eventsData.events as Event[]} />
      <Header 
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      {renderPage()}
    </div>
  )
}

export default App
