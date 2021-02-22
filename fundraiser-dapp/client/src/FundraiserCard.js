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

import FundraiserContract from "./contracts/Fundraiser.json";
import Web3 from 'web3'
//import getWeb3 from "./getWeb3";

const useStyles = makeStyles(theme => ({
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
    const [ donationCount, setDonationCount ] = useState(null)
    const [ imageURL, setImageURL ] = useState(null)
    const [ url, setURL ] = useState(null)
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
	setOpen(true);
	// this will set our state to true and open the modal
    };

    const handleClose = () => {
	setOpen(false);
	// this will close the modal on click away and on button close
    };

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
	    console.log("fundraiser:",fundraiser);
	    //const fund = fundraiser
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
	    setTotalDonations(totalDonations)
	    setURL(url)
	}
	catch(error) {
	    console.error(error);
	    alert(
		`Failed to load web3, accounts, or contract. Check console for details.`,
	    );
	}
    }

    return (
	<div className="fundraiser-card-content" >
	This is FundraiserCard = {props.fundraiser} <br/>
	    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<DialogTitle id="form-dialog-title">Donate to {fundName}</DialogTitle>
		<DialogContent>
		    <DialogContentText>
			<img src={imageURL} width='200px' height='200px' />
			<p>{description}</p>
		    </DialogContentText>
		</DialogContent>
		<DialogActions>
		    <Button onClick={handleClose} color="primary">
			Cancel
		    </Button>
		</DialogActions>
	    </Dialog>

	    <Card className={classes.card} onClick={handleOpen}>
		<CardActionArea>
		    <CardMedia
		    className={classes.media}
		    image={imageURL}
		    title="Fundraiser Image"
		    />
		    <CardContent>
			<Typography gutterBottom variant="h5" component="h2">
			    {fundName}
			</Typography>
			<Typography variant="body2" color="textSecondary" component="p">
			    <p>{description}</p>
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
