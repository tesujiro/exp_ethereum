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
	console.log("Home#displayFundraisers()");
	if (funds) {  // TODO ???
	    console.log("funds.length: "+funds.length);
	    console.log("funds: "+funds);
	    return funds.map((fundraiser) => {
	    	console.log("fundraiser: "+fundraiser);
	    	//console.log("fundraiser: "+JSON.stringify(fundraiser));
	    	//console.log("fundraiser.name: "+fundraiser.name);
	    	//console.log("fundraiser.imageURL: "+fundraiser.imageURL);
		return (
		    <FundraiserCard fundraiser={fundraiser} key={fundraiser}/>
		)
	    })
	}
    }

    const init = async () => {
	console.log("Home#init()");
	try {
	    console.log("Home#init() path1");
	    const web3 = await getWeb3();
	    console.log("Home#init() path1.1");
	    const networkId = await web3.eth.net.getId();
	    const deployedNetwork = FactoryContract.networks[networkId];
	    const accounts = await web3.eth.getAccounts();
	    const instance = new web3.eth.Contract(
		FactoryContract.abi,
		deployedNetwork && deployedNetwork.address,
	    );
	    console.log("Home#init() path3");
	    setContract(instance)
	    setAccounts(accounts)
	    console.log("Home#init() path4");

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
