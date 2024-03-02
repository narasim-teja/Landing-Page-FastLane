const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  console.log(`Preparing Deployment...\n`)
  //Fetch contracts to deploy
  const Fastlane = await ethers.getContractFactory('Fastlane')
  const Obstacles = await ethers.getContractFactory('Obstacles')
  //Fetch Accounts
  const accounts = await ethers.getSigners()
  //Delploy Contracts
  const fastlane = await Fastlane.deploy("Fastlane", ethers.utils.parseEther('.001'))
  await fastlane.deployed()
  console.log(`Fastlane Contract Deployed to: ${fastlane.address}`)

  const obstacles = await Obstacles.deploy("Obstacles", "12")
  await obstacles.deployed()
  console.log(`Obstacles Contract Deployed to: ${obstacles.address}`)

  //owner will mint the first segment to provide a road at the start

  let transaction
  const owner = accounts[0]
  transaction = await fastlane.connect(owner).mintSegment(owner.address)
  await transaction.wait()
  console.log(`First Segment owner added`)

  transaction = await obstacles.connect(owner).mintAllTokens(owner.address)
  await transaction.wait()
  console.log(`First Track Minted to Deployer ${owner.address}\n`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  //Code to run script to localhost [npx hardhat run --network localhost scripts/deploy.js]
  //Code to run script to mumbai [npx hardhat run --network mumbai scripts/deploy.js]
  //Code to run script to mumbai [npx hardhat run --network arbitrium scripts/deploy.js]
  //Code to run script to mumbai [npx hardhat run --network linea scripts/deploy.js]
  //
  