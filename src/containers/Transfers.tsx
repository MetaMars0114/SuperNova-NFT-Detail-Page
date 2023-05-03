import { useState } from "react";
import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import BlockList from "../components/BlockList";
import getBlocks from "../helpers";
import { ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";
import { Block as IBlock } from "@etclabscore/ethereum-json-rpc";
import { getRecentTransactions } from "api/recycle";
import TransferList from "components/TransferList";

export default function Transfers() {
  const [transfers, setTransfers] = useState();
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getRecentTransactions()
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response && response.data && response.data.transfers) {
          const { transfers } = response.data;
          setTransfers(transfers);
        }
      });
  }, []);

  if (!transfers) {
    return <CircularProgress />;
  }
  return (
    <div>
      <TransferList transfers={transfers} />
    </div>
  );
}
