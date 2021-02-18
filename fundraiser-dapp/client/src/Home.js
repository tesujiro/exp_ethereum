import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import FactoryContract from "./contracts/FundraiserFactory.json";
import FundraiserCard from './FundraiserCard'

const Home = () => {
    const [ contract, setContract] = useState(null)
    const [ accounts, setAccounts ] = useState(null)
    const [ funds, setFunds ] = useState(null)

    useEffect(() => {
	init();
    }, []);

    const displayFundraisers = () => {
	if (funds) {  // TODO ???
	    console.log("funds: "+funds);
	    return funds.map((fundraiser) => {
		return (
		    <FundraiserCard fundraiser={fundraiser} />
		)
	    })
	}
    }

    const init = async () => {
	try {
	    const web3 = await getWeb3();
	    const networkId = await web3.eth.net.getId();
	    const deployedNetwork = FactoryContract.networks[networkId];
	    const accounts = await web3.eth.getAccounts();
	    const instance = new web3.eth.Contract(
		FactoryContract.abi,
		deployedNetwork && deployedNetwork.address,
	    );
	    setContract(instance)
	    setAccounts(accounts)

	    const funds = await instance.methods.fundraisers(10, 0).call()
	    console.log("funds: "+funds)
	    setFunds(funds)
	}
	catch(error) {
	    alert(
		`Failed to load web3, accounts, or contract. Check console for details.`,
	    );
	    console.error(error);
	}
    }

    return (
	<div className="main-container">
	This is Home.js
	{displayFundraisers()}
	</div>
    )
}

export default Home;
