import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import getWeb3 from "./getWeb3";
import FactoryContract from "./contracts/FundraiserFactory.json";

const useStyles = makeStyles(theme => ({
    container: {
	display: 'flex',
	flexWrap: 'wrap',
    },
    textField: {
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
    },
    dense: {
	marginTop: theme.spacing(2),
    },
    menu: {
	width: 200,
    },
    button: {
	margin: theme.spacing(1),
    },
    input: {
	display: 'none',
    },
}));

const NewFundraiser = () => {
    const [ name, setFundraiserName ] = useState(null)
    const [ website, setFundraiserWebsite ] = useState(null)
    const [ description, setFundraiserDescription ] = useState(null)
    const [ imageURL, setImageURL ] = useState(null)
    const [ beneficiary, setBeneficiary ] = useState(null)
    //const [ custodian, setCustodian ] = useState(null)
    const [ contract, setContract] = useState(null)
    const [ accounts, setAccounts ] = useState(null)

    useEffect(() => {
	const init = async() => {
	    try {
		const web3 = await getWeb3();
		const networkId = await web3.eth.net.getId();
		console.log("networkId: "+networkId);
		const deployedNetwork = FactoryContract.networks[networkId];
		const accounts = await web3.eth.getAccounts();
		console.log("accounts: "+accounts);
		console.log("FactoryContract: "+FactoryContract);
		console.log("FactoryContract.abi: "+(FactoryContract.abi));
		console.log("deployNetwork && address: "+(deployedNetwork && deployedNetwork.address));
		const instance = new web3.eth.Contract(
		    FactoryContract.abi,
		    deployedNetwork && deployedNetwork.address,
		);

		//setWeb3(web3)
		console.log("instance.methods: "+instance.methods);
		//instance.methods.map(method => console.log(method));
		//console.log("typeof instance: "+(typeof instance));
		setContract(instance)
		console.log("contract: "+contract);
		setAccounts(accounts)

	    } catch(error) {
		alert(
		    `Failed to load web3, accounts, or contract. Check console for details.`,
		);
		console.error(error);
	    }
	}
	init();
    }, []);

    const classes = useStyles();

    const handleSubmit = async () => {
	console.log("name: "+name);
	console.log("contact: "+contract);
	await contract.methods.createFundraiser(
	    name,
	    website,
	    imageURL,
	    description,
	    beneficiary,
	    //custodian
	).send({ from: accounts[0] })

	alert('Successfully created fundraiser')
    }

    return (
	<div>
	<h2>Create a New Fundraiser</h2>
	
	<label>Name</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Name"
	  margin="normal"
	  onChange={(e) => setFundraiserName(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>

	<label>Website</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Website"
	  margin="normal"
	  onChange={(e) => setFundraiserWebsite(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>

	<label>Description</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Description"
	  margin="normal"
	  onChange={(e) => setFundraiserDescription(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>

	<label>Image</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Image"
	  margin="normal"
	  onChange={(e) => setImageURL(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>

	<label>Address</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Ethereum Address"
	  margin="normal"
	  onChange={(e) => setBeneficiary(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>

	{/*
	<label>Custodian</label>
	<TextField
	  id="outlined-bare"
	  className={classes.textField}
	  placeholder="Fundraiser Custodian"
	  margin="normal"
	  onChange={(e) => setCustodian(e.target.value)}
	  variant="outlined"
	  inputProps={{ 'aria-label': 'bare' }}
	/>
	*/}

	<Button
	  onClick={handleSubmit}
	  variant="contained"
	  className={classes.button}>
	  Submit
	</Button>

	</div>
    )
}

export default NewFundraiser;
