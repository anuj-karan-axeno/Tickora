import React, { useState } from 'react'
import { Header } from '../components/header'
import { KanbanBoard } from '../components/KanbanBoard'
import { Sidebar } from '../components/Sidebar'
import { UserManagement } from '../components/UserManagement'
import { StoryTypesManagement } from '../components/StoryTypesManagement'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="dashboard-layout__main">
            <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <main className="dashboard-layout__content">
                {activeTab === 'tickets' && <KanbanBoard />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'stories' && <StoryTypesManagement />}
            </main>
        </div>
    </div>
  )
}

export default Dashboard