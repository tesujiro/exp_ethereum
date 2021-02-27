import React, { useState, useEffect } from "react";

const Receipts = (props) => {

    const [ donation, setDonation ] = useState(null)
    const [ fundName, setFundName ] = useState(null)
    const [ date, setDate ] = useState(null)

    useEffect(() => {
	const { donation, date, fund } = props.location.state
	console.log("fundName:",fund);

	const formattedDate = new Date(parseInt(date))

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
	</div>
    )
}

export default Receipts;
