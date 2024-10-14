import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import type { HelloAnchor } from "../target/types/hello_anchor";

describe("Test", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as anchor.Program<HelloAnchor>;
  
    // Generate keypair for the new account
    const newAccountKp = new web3.Keypair();

  it("initialize", async () => {
    // Send transaction
    const data = new BN(0);
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await program.provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const newAccount = await program.account.newCounter.fetch(
      newAccountKp.publicKey
    );

    console.log("On-chain data is:", newAccount.data.toString());

    // Check whether the data on-chain is equal to local 'data'
    assert(data.eq(newAccount.data));
  });

  it("update Counter", async() => {
    
    const txHash = await program.methods.counter().accounts({counter: newAccountKp.publicKey}).signers([program.provider.wallet.payer]).rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    await program.provider.connection.confirmTransaction(txHash);

    const newAccount = await program.account.newCounter.fetch(newAccountKp.publicKey);
    

    console.log("new account data ",newAccount.data.toString());

    assert.equal(newAccount.data.toString(),"1");

  });

});
