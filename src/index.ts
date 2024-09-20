import * as web3 from "@solana/web3.js"
import * as splToken from "@solana/spl-token"
import {getExplorerLink, initializeKeypair} from "@solana-developers/helpers"

const PROGRAM_ID = new web3.PublicKey(
  "HYkps3qJ9Uqq2NNTwU3VhpG2EaJgg1L4qsyXVnAvtYNJ"
)

function initializeProgramTokenMint(
  connection: web3.Connection,
  signer: web3.Keypair,
  programId: web3.PublicKey 
): Promise<string> {
  try {
  const [tokenMint] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token_mint")],
    programId
  )
  const [tokenAuth] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token_auth")],
    programId
  )

  splToken.createInitializeMintInstruction
  const transaction = new web3.Transaction()
  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: tokenMint,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: tokenAuth,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splToken.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([3]),
  })

  transaction.add(instruction)

  return web3.sendAndConfirmTransaction(connection, transaction, [signer])

} catch (error:any) {
    throw new Error(`Failed to initialize program token mint: ${error.message}`);
  }
}


try {
  const connection = new web3.Connection("http://localhost:8899") //web3.clusterApiUrl("devnet"))

  const signer = await initializeKeypair(connection, {
    airdropAmount: web3.LAMPORTS_PER_SOL * 5,
  });

  const transactionId = await initializeProgramTokenMint(connection, signer, PROGRAM_ID)

  const explorerLink = getExplorerLink("transaction",transactionId, "devnet")

  console.log(explorerLink)

} catch (error:any) {
    throw new Error(`Failed to initialize program token mint: ${error.message}`);
}

 console.log("Finished successfully");
 process.exit(0);


