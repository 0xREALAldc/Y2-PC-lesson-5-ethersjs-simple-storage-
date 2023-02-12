import { ethers } from 'ethers'
import * as fs from 'fs-extra'
import 'dotenv/config'

async function main() {
  //we're creating a provider to interact with the blockchain in the url below
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)

  // in a future project, use a .env file to hold the private key. In this, is blockchain VM so doesn't matter
  // here we get a Wallet so we can sign transactions
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

  // we're reading the contract ABI
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")

  // we're reading the contract binary
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

  // here we're creating the object that we will use to deploy our contract 
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")

  //now do the deploying using the EthersJS methods
  // using the 'await' keyword will make it stop here and WAIT for the contract to be deployed
  const contract = await contractFactory.deploy()
  // const transactionReceipt = await contract.deployTransaction.wait(1)
  await contract.deployTransaction.wait(1)
  console.log(`Contract address: ${contract.address}`)

  // calling the methods in our contract 
  // The variable 'contract' will come with all the methods that we had implemented in our SmartContract
  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number is ${currentFavoriteNumber.toString()}`)
  
  // we call the method that updates the favoriteNumber
  const transactionResponse = await contract.store("7")
  // wait for 1 block confirmation
  const transactionReceipt = await transactionResponse.wait(1)

  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number is ${updatedFavoriteNumber}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })