import React from 'react'
import DashboardPage from './dashboardPage'

function DashboardComponent(props) {
  const { getUser } = props;
  return (
    <>
      <DashboardPage getUser={getUser}/>
    </>
  )
}

export default DashboardComponent
