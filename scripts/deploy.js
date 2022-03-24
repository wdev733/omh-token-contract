require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {

  const OMHToken = await ethers.getContractFactory("OMHToken");
  const OMHTokenContract = await OMHToken.deploy();

  console.log("OMHTokenContract address", OMHTokenContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });