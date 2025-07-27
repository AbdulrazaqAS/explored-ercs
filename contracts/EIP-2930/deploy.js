async function main() {
  const [user] = await ethers.getSigners();
  const data = "0xf4acc7b5"; // function selector for `callCalculator()`

  const Calculator = await ethers.getContractFactory("Calculator");
  const calculator = await Calculator.deploy();
  await calculator.waitForDeployment();

  console.log(`Calc contract deployed to ${calculator.target}`);

  const Caller = await ethers.getContractFactory("Caller");
  const caller = await Caller.deploy(calculator.target);
  await caller.waitForDeployment();

  console.log(`Caller contract deployed to ${caller.target}`);

  const tx1 = {
    from: user.address,
    to: caller.target,
    data: data,
    value: 0,
    type: 1,
    accessList: [
      {
        address: calculator.target,
        storageKeys: [
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
      },
    ],
  };

  const tx2 = {
    from: user.address,
    to: caller.target,
    data: data,
    value: 0,
  };

  console.log("==============  transaction with access list ==============");
  const txCall = await user.sendTransaction(tx1);

  const receipt = await txCall.wait();

  console.log(
    `gas cost for tx with access list: ${receipt.gasUsed.toString()}`
  );

  console.log("==============  transaction without access list ==============");
  const txCallNA = await user.sendTransaction(tx2);

  const receiptNA = await txCallNA.wait();

  console.log(
    `gas cost for tx without access list: ${receiptNA.gasUsed.toString()}`
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});