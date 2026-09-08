import React from 'react'
import { Header } from '../components/header'
import { KanbanBoard } from '../components/KanbanBoard'

const Dashboard = () => {
  return (
    <div className="dashboard">
        <Header/>
        <KanbanBoard />
    </div>
  )
}

export default Dashboard