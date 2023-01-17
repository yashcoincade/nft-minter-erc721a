import React, { useState } from "react";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  useNetworkMismatch,
  ChainId,
} from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const Mint = () => {
  const addresses = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x8D8F7397258DdbcEf53DbE9b5e5cF73c684187e2",
    "0xE4C0423981B6bFA27fa2874a00084FC94ae0ED80",
    "0xb9297a861040026b7a488238A26ee13e1056b6B1",
  ];

  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { contract } = useContract(
    "0xd8d0A205062f074bE065125353CBaBb38441FEA7"
  );

  const { data: totalSupply } = useContractRead(contract, "totalSupply");
  const { data: maxSupply } = useContractRead(contract, "MAX_SUPPLY");
  const { data: whitelistSaleBool } = useContractRead(
    contract,
    "whiteListSale"
  );
  const { data: publicSalePrice } = useContractRead(
    contract,
    "PUBLIC_SALE_PRICE"
  );
  const { data: whitelistSalePrice } = useContractRead(
    contract,
    "WHITELIST_SALE_PRICE"
  );

  const { mutateAsync: mint } = useContractWrite(contract, "mint");
  const { mutateAsync: whitelistMint } = useContractWrite(
    contract,
    "whitelistMint"
  );

  const [count, setCount] = useState(1);
  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    setCount(count <= 1 ? 1 : count - 1);
  }
  async function publicMintFunction() {
    const notification = toast.loading("Minting Your NFTs...");
    if (address) {
      if (!isMismatched) {
        try {
          const data = await mint([
            count,
            { value: (publicSalePrice * count).toString() },
          ]);
          console.info("contract call successs", data);
          toast.success("Minted your NFTs successfully!", {
            id: notification,
          });
        } catch (err) {
          console.error("contract call failure", err);
          toast.error(err.reason, {
            id: notification,
          });
        }
      } else {
        switchNetwork(ChainId.Mumbai);
      }
    } else {
      toast.error("Connect Your Wallet First", {
        id: notification,
      });
    }
  }

  async function whitelistMintFunction() {
    const leaves = addresses.map((x) => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const buff2hex = (x) => "0x" + x.toString("hex");
    // const merkleRoot = buff2hex(tree.getRoot());
    // console.log("MerkleRoot is: ", merkleRoot)
    const leaf = keccak256(address);
    let merkleProof = tree.getProof(leaf).map((x) => buff2hex(x.data));

    const notification = toast.loading("Minting Your NFTs...");
    if (address) {
      if (!isMismatched) {
        try {
          const data = await whitelistMint([
            merkleProof,
            count,
            { value: (whitelistSalePrice * count).toString() },
          ]);
          console.info("contract call successs", data);
          toast.success("Minted your NFTs successfully!", {
            id: notification,
          });
        } catch (err) {
          console.error("contract call failure", err);
          toast.error(err.reason, {
            id: notification,
          });
        }
      } else {
        try {
          await switchNetwork(ChainId.Mumbai);
          toast.success("Network Switched, Try to mint again", {
            id: notification,
          });
        } catch (err) {
          console.error("contract call failure", err);
          toast.error(err.reason, {
            id: notification,
          });
        }
      }
    } else {
      toast.error("Connect Your Wallet First", {
        id: notification,
      });
    }
  }

  return (
    <div className="h-[670px] w-[800px] flex flex-col items-center justify-center text-white">
      <img
        src="https://gateway.ipfscdn.io/ipfs/QmQ3eJEmjSe4jyu3ghtWyMV3aS92bjXTZqoTgRnoeaki2z/98.png"
        alt="NFT Image"
        className="w-[300px] rounded-xl shadow-xl"
      />

      <div className="flex justify-center m-2">
        {totalSupply && maxSupply ? (
          <p className="text-3xl mt-2">
            {/* Claimed supply so far */}
            <b>{totalSupply?.toNumber()}</b>
            {" / "}
            {
              // Add unclaimed and claimed supply to get the total supply
              maxSupply?.toNumber()
            }
          </p>
        ) : (
          // Show loading state if we're still loading the supply
          <p>Loading...</p>
        )}
      </div>

      <div className="flex p-5 space-x-5 items-center justify-center">
        <svg
          onClick={handleDecrement}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-3xl">{count}</p>
        <svg
          onClick={handleIncrement}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <button
        onClick={whitelistSaleBool ? whitelistMintFunction : publicMintFunction}
        className="bg-[#94CCFF] text-black font-bold text-3xl py-2 px-4 rounded-lg hover:bg-blue-400 hover:text-white"
      >
        Mint Now
      </button>
    </div>
  );
};

export default Mint;
