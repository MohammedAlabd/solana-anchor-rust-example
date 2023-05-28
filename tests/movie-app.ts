import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js'
import { MovieApp } from "../target/types/movie_app";
import { expect } from "chai";

describe("movie-app", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.MovieApp as Program<MovieApp>;

  const movieTitle = 'My-Life Movie'
  const initUser = anchor.web3.Keypair.generate()

  anchor.Wallet


  it("Is initialized!", async () => {
    // Add your test here.
    const description = 'not so bad';
    const rating = 2
    const [PDA, _] = await PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(movieTitle),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )
    
    const tx = await program.methods.addMovieReview(movieTitle, description, rating).accounts({ movieReview: PDA }).rpc();

    const movie = await program.account.movieAccountState.fetch(PDA)
    console.log('-------------------- ans ----------------')
    console.log(movie)
    console.log("Your transaction signature", tx);

    expect(movie.description === description).to.be.true
    expect(movie.rating === rating).to.be.true
    expect(movie.title === movieTitle).to.be.true
  });

  it("Is update!", async () => {
    // Add your test here.
    const description = 'it is getting better';
    const rating = 5
    const [PDA, _] = await PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(movieTitle),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )
    
    const movieBefore = await program.account.movieAccountState.fetch(PDA)
    console.log('Bloom ~ file: movie-app.ts:54 ~ it ~ movieBefore:', movieBefore)
    expect(movieBefore.description === 'not so bad').to.be.true
    expect(movieBefore.rating === 2).to.be.true

    const tx = await program.methods.updateMovieReview(movieTitle, description, rating).accounts({ movieReview: PDA }).rpc();
    const movie = await program.account.movieAccountState.fetch(PDA)

    console.log('-------------------- ans ----------------')
    console.log(movie)
    console.log("Your transaction signature", tx);

    expect(movie.description === description).to.be.true
    expect(movie.rating === rating).to.be.true
  });
});
