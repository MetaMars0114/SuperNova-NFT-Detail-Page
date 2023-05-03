import { Contract } from "@ethersproject/contracts";
import { CONTRACT_ADDRESS, ChainId } from "../constants";
import ENS_ABI from "../constants/abis/ens-registrar.json";
import RECYCLE_ABI from "../constants/abis/Recycle.json";
import { useActiveWeb3React } from "hooks";
import { useMemo } from "react";
import { getContract } from "utils";

function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.NEBULA:
      case ChainId.NOVA:
        // address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useRecycleContract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(CONTRACT_ADDRESS, RECYCLE_ABI, withSignerIfPossible);
}
