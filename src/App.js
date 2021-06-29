
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { initweb3, sendDAI, sendEth } from './store/adoptSlice';

function App() {
  const dispatch = useDispatch()



  const address = useSelector((state) => {
    return state.adoptReducer.address
  })


  const txCount = useSelector((state) => {
    return state.adoptReducer.txCount
  })
  const DIA_balance = useSelector((state) => {
    console.log(state.adoptReducer.DIAbalance)
    return state.adoptReducer.DIAbalance
  })
  const [amount, setAmount] = useState(0)
  const [recipient, setRecipient] = useState(null)
  useEffect(
    () => {

      dispatch(initweb3())
      console.log(DIA_balance)
    }, []
  )
  return (
    <div className="App">
      <header className="App-header">
        Your Address<br />
        {address}<br />
        Your DIA Balance<br />
        {DIA_balance}<br />
        Your Total Transactions<br />
        {txCount}<br />

        SEND DAI<br />
        Enter amount
        <input type='text' onChange={(e) => setAmount(e.target.value)}></input>
        Enter Recipient Address
        <input type='text' onChange={(e) => setRecipient(e.target.value)}></input>
        <button onClick={() => {
          dispatch(sendDAI({ recipient: recipient, amount: Number(amount) }))
        }} > send </button>
      </header>
    </div>
  );
}

export default App;
