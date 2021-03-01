import React, { useState, useEffect } from "react";

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const Receipts = (props) => {

    const [ donation, setDonation ] = useState(null)
    const [ fundName, setFundName ] = useState(null)
    const [ date, setDate ] = useState(null)
    const [ open, setOpen ] = React.useState(false);

    const handleClose = () => {
	console.log("handleClose()");
	//window.history.back(); //TODO: NG implementaion , how to close dialog??
    };

    useEffect(() => {
	const { donation, date, fund } = props.location.state

	const formattedDate = new Date(date * 1000)

	setDonation(donation)
	setDate(formattedDate.toString())
	setFundName(fund)
    }, [props]);

    return (
	<div className="receipt-container">
	    <div className="receipt-header">
		<h3>Thank you for your donation to {fundName}</h3>
	    </div>

	    <div className="receipt-info">
		<div>Date of Donation: {date}</div>
		<div>Donation Value: ${donation}</div>
	    </div>
		<DialogActions>
		    <Button onClick={handleClose} color="primary">
			Cancel
		    </Button>
		</DialogActions>
	</div>
    )
}

export default Receipts;
