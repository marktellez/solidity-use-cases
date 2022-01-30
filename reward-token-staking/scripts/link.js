const { mkdir, rm, link } = require("fs/promises");
const path = require("path");

async function main() {
  await linkToWeb3("RewardToken");
  await linkToWeb3("RewardTokenStaking");

  async function linkToWeb3(filename) {
    const abiFiles = linkAbi(filename);
    const contractFiles = linkContract(filename);

    try {
      await mkdir(path.dirname(abiFiles[0]), { recursive: true });
      await mkdir(path.dirname(contractFiles[0]), { recursive: true });
      console.log(`created folders`);
    } catch {}

    try {
      console.log(`removing abi: ${abiFiles[0]}`);
      await rm(abiFiles[0]);
    } catch {}

    try {
      console.log(`removing contract: ${contractFiles[0]}`);
      await rm(contractFiles[0]);
    } catch {}

    console.log(`linking abi: ${abiFiles}`);
    await link(...abiFiles.reverse());

    console.log(`linking contract: ${contractFiles}`);
    await link(...contractFiles.reverse());
  }

  function linkAbi(filename) {
    return [
      path.resolve(
        `../../web3/reward-token-staking/src/contracts/${filename}.sol/abi.json`
      ),
      path.resolve(`./artifacts/contracts/${filename}.sol/${filename}.json`),
    ];
  }

  function linkContract(filename) {
    return [
      path.resolve(
        `../../web3/reward-token-staking/src/contracts/${filename}.sol/contract.sol`
      ),
      path.resolve(`./contracts/${filename}.sol`),
    ];
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
