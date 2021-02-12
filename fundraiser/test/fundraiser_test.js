const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
    let fundraiser;
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageURL = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1];
    const owner = accounts[0];

    beforeEach (async() => {
	fundraiser = await FundraiserContract.new(
	    name,
	    url,
	    imageURL,
	    description,
	    beneficiary,
	    owner
	);
    });

    describe("initialization", () => {
	it("gets the beneficiary name", async () => {
	    const actual = await fundraiser.name();
	    assert.equal(actual, name, "name should match");
	});

	it("gets the beneficiary url", async () => {
	    const actual = await fundraiser.url();
	    assert.equal(actual, url, "url should match");
	});

	it("gets the beneficiary image url", async () => {
	    const actual = await fundraiser.imageURL();
	    assert.equal(actual, imageURL, "imageURL should match");
	});

	it("gets the beneficiary description", async () => {
	    const actual = await fundraiser.description();
	    assert.equal(actual, description, "description should match");
	});

	it("gets the beneficiary", async () => {
	    const actual = await fundraiser.beneficiary();
	    assert.equal(actual, beneficiary, "beneficiary address should match");
	});

	it("gets the owner", async () => {
	    const actual = await fundraiser.owner();
	    assert.equal(actual, owner, "bios should match");
	});
    });

    describe("setBeneficiary", () => {
	const newBeneficiary = accounts[2];

	it("updatedated beneficiary when called by owner account", async () => {
	    await fundraiser.setBeneficiary(newBeneficiary, {from: owner});
	    const actualBeneficiary = await fundraiser.beneficiary();
	    assert.equal(actualBeneficiary, newBeneficiary, "beneficiaries should match");
	});

	it("throws an error when called from a non-owner account", async () => {
	    try {
		await fundraiser.setBeneficiary(newBeneficiary, {from: accounts[3]});
		assert.fail("withdraw was not restricted owners");
	    } catch(err) {
		const expectedError = "Ownable: caller is not the owner"
		const actualError = err.reason;
		assert.equal(actualError, expectedError, "should not be permitted");
	    }
	});
    });

    describe("making donations", () => {
	const value = web3.utils.toWei('0.0289');
	const donor = accounts[2];

	it("increases myDonationsCount", async () => {
	    const currentDonationsCount = await fundraiser.myDonationsCount(
		{from: donor}
	    );

	    await fundraiser.donate({from: donor, value});

	    const newDonationsCount = await fundraiser.myDonationsCount(
		{from: donor}
	    );

	    assert.equal(
		1,
		newDonationsCount - currentDonationsCount,
		"myDonationsCount sholud increment by 1"
	    );
	});
	it("includes donation in myDonations");

    });
});
