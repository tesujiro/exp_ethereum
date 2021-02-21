import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FundraiserContract from "./contracts/Fundraiser.json";
import Web3 from 'web3'
//import getWeb3 from "./getWeb3";

const useStyles = makeStyles({
    card: {
	maxWidth: 450,
	height: 400
    },
    media: {
	height: 140,
    },
});

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
	    //console.log("web3:",web3);
	    const networkId = await web3.eth.net.getId();
	    //console.log("networkId:",networkId);
	    const deployedNetwork = FundraiserContract.networks[networkId];
	    const accounts = await web3.eth.getAccounts();
	    //console.log("accounts:",accounts);
	    const instance = await new web3.eth.Contract(
		FundraiserContract.abi,
		fundraiser
	    );
	    console.log("instance:",instance);
	    console.log("before contract:",contract);
	    //setContract(instance)
	    setContract(instance,() => {console.log("finished contract:")});
	    console.log("after  contract:",contract);
	    setAccounts(accounts)

	    // Placeholder for getting information about each contract
	}
	catch(error) {
	    console.error(error);
	    alert(
		`Failed to load web3, accounts, or contract. Check console for details.`,
	    );
	}
    }

    return (
	<div className="fundraiser-card-content" key={props.fundraiser.name}>
	This is FundraiserCard = {props.fundraiser} <br/>
	    <Card className={classes.card}>
		<CardActionArea>
		    <CardMedia
		    className={classes.media}
		    image={props.fundraiser.imageURL}
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
		    <Button size="small" color="primary">
			View More
		    </Button>
		</CardActions>
	    </Card>
	</div>
    )
}

export default FundraiserCard;
