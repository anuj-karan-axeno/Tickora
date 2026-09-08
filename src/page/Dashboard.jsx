import React, { useState } from 'react'
import { Header } from '../components/header'
import { KanbanBoard } from '../components/KanbanBoard'
import { Sidebar } from '../components/Sidebar'
import { AddUser } from '../components/AddUser'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="dashboard-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="dashboard-layout__main">
            <Header/>
            <main className="dashboard-layout__content">
                {activeTab === 'tickets' ? <KanbanBoard /> : <AddUser />}
            </main>
        </div>
    </div>
  )
}

export default Dashboard