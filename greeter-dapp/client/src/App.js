import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import GreeterContract from "./contracts/Greeter.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    //state = { storageValue: 0, web3: null, accounts: null, contract: null };
    state = { greeting: '', web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
	try {
	    // Get network provider and web3 instance.
	    const web3 = await getWeb3();

	    // Use web3 to get the user's accounts.
	    const accounts = await web3.eth.getAccounts();
	    console.log("accounts: "+accounts);

	    // Get the contract instance.
	    const networkId = await web3.eth.net.getId();
	    console.log("networkId: "+networkId);
	    //const deployedNetwork = SimpleStorageContract.networks[networkId];
	    const deployedNetwork = GreeterContract.networks[networkId];
	    const instance = new web3.eth.Contract(
		//SimpleStorageContract.abi,
		GreeterContract.abi,
		deployedNetwork && deployedNetwork.address,
	    );

	    // Set web3, accounts, and contract to the state, and then proceed with an
	    // example of interacting with the contract's methods.
	    this.setState({ web3, accounts, contract: instance }, this.runExample);
	} catch (error) {
	    // Catch any errors for any of the above operations.
	    alert(
		`Failed to load web3, accounts, or contract. Check console for details.`,
	    );
	    console.error(error);
	}
    };

    runExample = async () => {
	const { accounts, contract } = this.state;

	// Get the value from the contract to prove it worked.
	const response = await contract.methods.greet().call();

	// Update state with the result.
	this.setState({ greeting: response });


	/*
	const { accounts, contract } = this.state;

	// Stores a given value, 5 by default.
	await contract.methods.set(5).send({ from: accounts[0] });

	// Get the value from the contract to prove it worked.
	const response = await contract.methods.get().call();

	// Update state with the result.
	this.setState({ storageValue: response });
	*/
    };

    render() {
	if (!this.state.web3) {
	    return <div>Loading Web3, accounts, and contract...</div>;
	}
	return (
	    <div className="App">
	    <h1>Greeter</h1>
	    {this.state.greeting}
	    <form><label>New Greeting:
	    <input type="text" value={this.state.greeting} onChange={e => this.handleGreetingChange(e)} />
	    </label></form>
	    <button onClick={this.formSubmitHandler}>Submit</button>
	    </div>
	    /*
	    <div className="App">
	    <h1>Good to Go!</h1>
	    <p>Your Truffle Box is installed and ready.</p>
	    <h2>Smart Contract Example</h2>
	    <p>
	    If your contracts compiled and migrated successfully, below will show
	    a stored value of 5 (by default).
	    </p>
	    <p>
	    Try changing the value stored on <strong>line 40</strong> of App.js.
	    </p>
	    <div>The stored value is: {this.state.storageValue}</div>
	    </div>
	    */
	);
    }
    formSubmitHandler = async () => {
	const { accounts, contract, greeting } = this.state;
	console.log("greeting: "+greeting);
	console.log("accounts: "+accounts);
	const updatedGreeting = await contract.methods.setGreeting(greeting);
	console.log(updatedGreeting);
    }
    handleGreetingChange = (e) => {
	const inputVal = e.target.value;
	this.setState({ greeting: inputVal });
    }
}

export default App;
