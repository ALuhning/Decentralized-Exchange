import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'
import { 
  loadWeb3, 
  loadAccount, 
  loadToken, 
  loadExchange 
} from '../store/interactions'
import Navbar from './Navbar'
import Content from './Content'
import { contractsLoadedSelector } from '../store/selectors'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    const account = accounts[0]
    console.log(account)
    await loadAccount(web3, dispatch)
    const token = await loadToken(web3, networkId, dispatch)
    if(!token) {
      window.alert('Token smart contract not detected on the current network.  Please select another network within Metamask.')
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange) {
      window.alert('Exchange smart contract not detected on the current network.  Please select another network within Metamask.')
    }
  }


  render() {
  return (
    <div>
    <Navbar />
    { this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
    </div>
  )};
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)
