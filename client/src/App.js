import React, { Component } from "react";
import ZTToken from "./contracts/ZTToken.json";
import ZTTokenSale from "./contracts/ZTTokenSale.json";
import KYC from "./contracts/KYC.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.token = new this.web3.eth.Contract(
        ZTToken.abi,
        ZTToken.networks[this.networkId] && ZTToken.networks[this.networkId].address
      );

      this.tokenSale = new this.web3.eth.Contract(
        ZTTokenSale.abi,
        ZTTokenSale.networks[this.networkId] && ZTTokenSale.networks[this.networkId].address
      );

      this.kyc = new this.web3.eth.Contract(
        KYC.abi,
        KYC.networks[this.networkId] && KYC.networks[this.networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputKYCAddressChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  handleKYCSubmit = async () => {
    const { kycAddress } = this.state;
    await this.kyc.methods.setKYCCompleted(kycAddress).send({
      from: this.accounts[0],
      gas: '21000'
    });
    alert('Account ' + kycAddress + ' is now whitelisted')
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>ZTToken!</h1>
        <h2>Enable your account</h2>
        Address to allow: <input type="text" name="kycAddress" value={ this.state.kycAddress} onChange={ this.handleInputKYCAddressChange } />
        <button type="button" onClick={ this.handleKYCSubmit }>Add Address to Whitelist</button>
      </div>
    );
  }
}

export default App;
