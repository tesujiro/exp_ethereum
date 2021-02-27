import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
//import InputLabel from '@material-ui/core/InputLabel';
//import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Link } from 'react-router-dom';

import FundraiserContract from "./contracts/Fundraiser.json";
import Web3 from 'web3'
//import getWeb3 from "./getWeb3";

const cc = require('cryptocompare');
const apiKey = process.env.REACT_APP_CRYPTOCOMPARE_API_KEY;
console.log("API-KEY=",apiKey);
cc.setApiKey(apiKey);

const useStyles = makeStyles(theme => ({
    container: {
	display: 'flex',
	flexWrap: 'wrap',
    },
    formControl: {
	margin: theme.spacing(1),
	display: 'table-cell'
    },
    card: {
	maxWidth: 450,
	height: 400
    },
    media: {
	height: 140,
    },
    button: {
	margin: theme.spacing(1),
    },
    input: {
	display: 'none',
    },
    paper: {
	position: 'absolute',
	width: 400,
	backgroundColor: theme.palette.background.paper,
	border: 'none',
	boxShadow: 'none',
	padding: 4,
    },
}));

const FundraiserCard = (props) => {
    const classes = useStyles();
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    //const web3 = await getWeb3();

    const [ contract, setContract] = useState(null)
    const [ accounts, setAccounts ] = useState(null)
    const [ fundName, setFundname ] = useState(null)
    const [ description, setDescription ] = useState(null)
    const [ totalDonations, setTotalDonations ] = useState(null)
    //const [ donationCount, setDonationCount ] = useState(null)
    const [ imageURL, setImageURL ] = useState(null)
    const [ url, setURL ] = useState(null)
    const [ open, setOpen ] = React.useState(false);
    const [ donationAmount, setDonationAmount ] = useState(null);
    const [ exchangeRate, setExchangeRate ] = useState(null);
    const ethAmount = donationAmount / exchangeRate || 0;
    const [ userDonations, setUserDonations ] = useState(null);

    const handleOpen = () => {
	setDonationAmount(0);
	setOpen(true);
	// this will set our state to true and open the modal
    };

    const handleClose = () => {
	setOpen(false);
	// this will close the modal on click away and on button close
    };

    const submitFunds = async () => {
	try{
	    console.log("submitFunds() : donationAmount $",donationAmount);
	    const ethRate = exchangeRate
	    const ethTotal = donationAmount / ethRate
	    console.log("ethTotal:",ethTotal);
	    const donation = web3.utils.toWei(ethTotal.toString(),'ether')  // donation in Wei

	    await contract.methods.donate().send({
		from: accounts[0],
		value: donation,
		gas: 650000
	    })
	    setOpen(false);

	    const totalDonations = await contract.methods.totalDonations().call()
	    const eth = web3.utils.fromWei(totalDonations, 'ether')
	    const dollarDonationAmount = exchangeRate * eth
	    setTotalDonations(dollarDonationAmount)
	}
	catch(error) {
	    console.error(error);
	    alert(
		error
	    );
	}
    }

    useEffect(() => {
	// we'll add in the Web3 call here
	console.log("FundraiserCard.useEffect()");
	if (props.fundraiser) {
	    init(props.fundraiser);
	}
    }, [props.fundraiser]);

    const init = async (fundraiser) => {
	console.log("FundraiserCard.init()");
	//const web3 = await getWeb3();
	try {
	    //cc.setApiKey(apiKey);
	    console.log("fundraiser:",fundraiser);
	    const networkId = await web3.eth.net.getId();
	    const deployedNetwork = FundraiserContract.networks[networkId];
	    const accounts = await web3.eth.getAccounts();
	    const instance = await new web3.eth.Contract(
		FundraiserContract.abi,
		fundraiser
	    );

	    setContract(instance)
	    setAccounts(accounts)

	    const name = await instance.methods.name().call()
	    const description = await instance.methods.description().call()
	    const totalDonations = await instance.methods.totalDonations().call()
	    const imageURL = await instance.methods.imageURL().call()
	    const url = await instance.methods.url().call()

	    setFundname(name)
	    setDescription(description)
	    setImageURL(imageURL)
	    console.log("imageURL:",imageURL);
	    setURL(url)

	    // calculate the exchange rate here
	    const exchangeRate = await cc.price('ETH', ['USD']);
	    setExchangeRate(exchangeRate.USD);
	    // pass in the coin you want to check and the currency
	    const eth = web3.utils.fromWei(totalDonations, 'ether')
	    const dollarDonationAmount = exchangeRate.USD * eth
	    console.log("dollarDonationAmount:",dollarDonationAmount);
	    setTotalDonations(dollarDonationAmount)

	    const userDonations = await instance.methods.myDonations().call({ from: accounts[0]})
	    console.log(userDonations)
	    setUserDonations(userDonations)

	}
	catch(error) {
	    console.error(error);
	    alert(
		`Failed to load web3, accounts, or contract. Check console for details.`,
	    );
	}
    }

    const renderDonationsList = () => {
	var donations = userDonations
	if (donations === null) {return null}
	// we'll return null so we don't get an error when the
	// donations aren't in the state yet

	const totalDonations = donations.values.length
	console.log("totalDonations=",totalDonations);
	let donationList = []
	var i
	for (i = 0; i < totalDonations; i++) {
	    if (donations.values[i]===0) break;
	    const ethAmount = web3.utils.fromWei(donations.values[i])
	    const userDonation = exchangeRate * ethAmount
	    const donationDate = donations.dates[i]
	    donationList.push({ donationAmount: userDonation.toFixed(2),
		date: donationDate})
	}
	return donationList.map((donation) => {
	    return (
		<div className="donation-list" >
		<p>${donation.donationAmount}</p>
		<Button variant="contained" color="primary">
		    <Link
		    className="donation-receipt-link"
		    to={{ pathname: '/receipts',
			    state: { donation: donation.donationAmount, date: donation.date, fund: fundName}
		    }}>
		    Request Receipt
		    </Link>
		</Button>
		</div>
	    )
	})
    }

	//This is FundraiserCard = {props.fundraiser} <br/>

    return (
	<div className="fundraiser-card-content" >
	    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<DialogTitle id="form-dialog-title">Donate to {fundName}</DialogTitle>
		<DialogContent>
		    <img src={imageURL} alt={fundName} width='200px' height='200px' />
		    <DialogContentText>
			{description}
		    </DialogContentText>
		</DialogContent>
		<div className="donation-input-container">
		<FormControl className={classes.formControl}>
		    $
		    <Input
			id="component-simple"
			value={donationAmount}
			onChange={(e) => setDonationAmount(e.target.value)}
			placeholder="0.00"
		    />
		</FormControl>
		<p>Eth: {ethAmount}</p>
		</div>
		<div>
		    <h3>My donations</h3>
		    {renderDonationsList()}
		</div>
		<DialogActions>
		    <Button onClick={submitFunds} variant="contained" color="primary">
			Donate
		    </Button>
		    <Button onClick={handleClose} color="primary">
			Cancel
		    </Button>
		</DialogActions>
	    </Dialog>

	    <Card className={classes.card} onClick={handleOpen}>
		<CardActionArea>
		    <CardMedia
			title="Fundraiser Image"
		    >
		    <img src={imageURL} alt={fundName} className={classes.media}/>
		    </CardMedia>
		    <CardContent>
			<Typography gutterBottom variant="h5" component="h2">
			    {fundName}
			</Typography>
			<Typography variant="body2" color="textSecondary" component="p">
			    {description} <br/>
			    Total Donations: ${totalDonations}
			</Typography>
		    </CardContent>
		</CardActionArea>
		<CardActions>
		    <Button onClick={handleOpen} variant="contained" className={classes.button}>
			View More
		    </Button>
		</CardActions>
	    </Card>
	</div>
    )
}

export default FundraiserCard;
