import { useState, useMemo } from 'react'
import type { Province, Event } from './types'
import Header from './components/Header'
import ProvinceFilter from './components/ProvinceFilter'
import EventSection from './components/EventSection'
import eventsData from './data/events.json'
import './App.scss'

function App() {
  const [selectedProvince, setSelectedProvince] = useState<Province | 'ALL'>('ALL')

  const filteredEvents = useMemo(() => {
    const events = eventsData.events as Event[]
    if (selectedProvince === 'ALL') {
      return events
    }
    return events.filter(event => event.province === selectedProvince)
  }, [selectedProvince])

  return (
    <div className="app">
      <Header />
      <ProvinceFilter 
        selectedProvince={selectedProvince}
        onProvinceChange={setSelectedProvince}
      />
      <EventSection events={filteredEvents} />
    </div>
  )
}

export default App
