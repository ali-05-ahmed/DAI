import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Web3 from 'web3'
import Adoption from '../contracts/Adoption.json'
import DAI from '../contracts/DAI.json'





export const initweb3 = createAsyncThunk(
    'initweb3',
    async (data, thunkAPI) => {
        try {
            if (Web3.givenProvider) {
                const web3 = new Web3(Web3.givenProvider)
                await Web3.givenProvider.enable()
                // const networkId = web3.eth.net.getId()
                // const network = Adoption.networks[(await networkId).toString()]
                // const contractAddress = network.address
                // const contract = new web3.eth.Contract(Adoption.abi, contractAddress)
                const DIAaddress = "0xad6d458402f60fd3bd25163575031acdce07538d"
                const DAIconstract = new web3.eth.Contract(DAI.abi, DIAaddress)
                console.log('DIA', DAIconstract)
                const address = await web3.eth.getAccounts()
                //  const balance = await web3.eth.getBalance(address[0])
                const DIAbalance = await DAIconstract.methods.balanceOf(address[0]).call()
                thunkAPI.dispatch(getTxCount({
                    web3: web3,
                    address: address[0]
                }))
                //  thunkAPI.dispatch(getDAIbalance({ contract: DAIconstract, address: address[0] }))



                return {
                    web3: web3, address: address[0], DIAbalance, contract: DAIconstract
                    //  balance: web3.utils.fromWei(balance, 'ether')
                }
            }
        } catch (error) {
            console.log(error)
        }

    }
)

const getDAIbalance = createAsyncThunk(
    'getAddress',
    async (data, thunkAPI) => {
        try {
            const balance = await data.contract.methods.balanceOf(data.address).call()
            console.log('DIA bal : ', balance)
            return { DIAbalance: balance }
        } catch (error) {
            console.log(error)
        }
    }

)

const getTxCount = createAsyncThunk(
    'getTxCount',
    async (data, thunkAPI) => {
        try {
            console.log('txxxxxxxxxxxxxxx')

            console.log("tx", data.address)
            const txCount = await data.web3.eth.getTransactionCount(data.address)
            return txCount
        } catch (error) {
            console.log('getTxCount func', error)
        }
    }
)

export const sendEth = createAsyncThunk(
    'sendEth',
    async (data, thunkAPI) => {
        try {
            const { web3, address } = thunkAPI.getState().adoptReducer
            console.log(address)
            console.log(data.amount)
            const amountToSend = web3.utils.toWei(data.amount.toString(), "ether");
            await web3.eth.sendTransaction({
                from: address,
                to: data.recipient,
                value: amountToSend
            })
        } catch (error) {
            console.log('sendeth error :', error)
        }

    }
)

export const sendDAI = createAsyncThunk(
    'sendDAI',
    async (data, thunkAPI) => {
        try {
            const { web3, address, contract } = thunkAPI.getState().adoptReducer
            const send = await contract.methods.transfer(data.recipient, data.amount).send({ from: address })
            //      const amountToSend = web3.utils.toWei(data.amount.toString(), "ether");
            // await web3.eth.sendTransaction({
            //     from: address,
            //     to: data.recipient,
            //     value: amountToSend
            // })
        } catch (error) {
            console.log('sendDAI error :', error)
        }

    }
)

const AdoptSlice = createSlice({
    name: 'AdoptSlice',
    initialState: {
        web3: null,
        contract: null,
        address: null,
        balance: null,
        txCount: null,
        DIAbalance: null
    },
    reducers: {
        adopt: () => {

        }
    },
    extraReducers: {
        [initweb3.fulfilled]: (state, action) => {
            state.web3 = action.payload.web3
            state.contract = action.payload.contract
            state.address = action.payload.address
            state.balance = action.payload.balance
            state.DIAbalance = action.payload.DIAbalance
        },
        [sendEth.pending]: (state, action) => {

        },
        [getTxCount.fulfilled]: (state, action) => {
            state.txCount = action.payload
        },
        [getDAIbalance.fulfilled]: (state, action) => {
            console.log('full', action.payload)
            //   state.DIAbalance = action.payload
        }
    }
})

export const adoptReducer = AdoptSlice.reducer
export const { adopt } = AdoptSlice.actions