import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api';
import { useContext } from 'react';

interface Transaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}
interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
  
const TransactionContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
); 
 
export function TransactionProvider({children}: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('/transactions')
      .then(response => setTransactions(response.data.transactions))
  },[])

   async function createTransaction(transactionInput: TransactionInput){
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
    })
    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction,
    ])
   }

  return (
    <TransactionContext.Provider value={{ transactions, createTransaction}}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions(){
  const context = useContext(TransactionContext)

  return context 
}

