const ethers = require('ethers') //for typescript would be using import
const fs = require('fs') // or fs-extra

async function main() {
  //we're creating a provider to interact with the blockchain in the url below
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")

  // in a future project, use a .env file to hold the private key. In this, is blockchain VM so doesn't matter
  // here we get a Wallet so we can sign transactions
  const wallet = new ethers.Wallet("7d81302b86b11770efcd37924e1dcf75ce457563db3227f1085169ab712887b0", provider)

  // we're reading the contract ABI
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")

  // we're reading the contract binary
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

  // here we're creating the object that we will use to deploy our contract 
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")

  //now do the deploying 
  // using the 'await' keyword will make it stop here and WAIT for the contract to be deployed
  const contract = await contractFactory.deploy()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })