import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => {
  return (
    <div className="flex justify-between w-full">
      <img
        src="https://gateway.ipfscdn.io/ipfs/QmQ3eJEmjSe4jyu3ghtWyMV3aS92bjXTZqoTgRnoeaki2z/8.png"
        alt="logo"
        className="h-[60px] rounded-full m-2"
      />
      <div className="p-2">
        <ConnectWallet accentColor="#94CCFF" />
      </div>
    </div>
  );
};

export default Navbar;
