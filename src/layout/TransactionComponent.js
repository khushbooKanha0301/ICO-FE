import React from 'react'
import TransactionPage from './transactionPage'

function TransactionComponent(props) {
  const {totalTransactionsCount , transactionLoading , transactions , gettransaction, setTypeFilter, setStatusFilter, PageSize , currentPage , setCurrentPage , typeFilter, statusFilter} = props
  return (
    <>
      <TransactionPage gettransaction={gettransaction} transactionLoading={transactionLoading} transactions={transactions} totalTransactionsCount={totalTransactionsCount} 
      setStatusFilter={setStatusFilter} setTypeFilter={setTypeFilter} typeFilter={typeFilter} statusFilter={statusFilter}
      setCurrentPage={setCurrentPage} currentPage={currentPage} PageSize={PageSize}/>
    </>
  )
}

export default TransactionComponent
