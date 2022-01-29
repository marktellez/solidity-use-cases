const {writeFile, readFile} = require("fs/promises");

async function main() {
  const web3EnvFile = "../../open-rewards/.env.local"



  console.log("Deploying Token...");
  const Token = await ethers.getContractFactory("RewardToken");
  const token = await (await Token.deploy("1000000000000000000000000")).deployed();

  console.log("Deploying Staking...");
  const Staking = await ethers.getContractFactory("RewardTokenStaking");
  const staking = await (await Staking.deploy(token.address)).deployed();

  const env = (await readFile(web3EnvFile)).toString()

  const withAddresses = env
    .replace(/NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=.*$/gm, `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=${staking.address}`)
    .replace(/NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=.*$/gm, `NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=${token.address}`)


  await writeFile(web3EnvFile, withAddresses)

  console.log(`
------------------------------------------------------------
CONTRACTS DEPLOYED:
  Token: ${token.address}
  Staking: ${staking.address}
------------------------------------------------------------
Web3 @ ${web3EnvFile} .env.local updated
  `)
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
