import React from 'react'
import DashboardPage from './dashboardPage'

function DashboardComponent(props) {
  const { getUser , transactionLoading, transactions, setTransactionLoading, setTransactions } = props;
  return (
    <>
      <DashboardPage setTransactions={setTransactions} getUser={getUser} transactionLoading={transactionLoading} transactions={transactions} setTransactionLoading={setTransactionLoading}/>
    </>
  )
}

export default DashboardComponent
