import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React, { Dispatch, useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import useDarkMode from "use-dark-mode";
import "./App.css";
import Address from "./containers/Address";
import Block from "./containers/Block";
import Dashboard from "./containers/Dashboard";
import NodeView from "./containers/NodeView";
import Transaction from "./containers/Transaction";
import { darkTheme, lightTheme } from "./themes/jadeTheme";
import useInterval from "use-interval";
import { createBrowserHistory } from "history";
import {
  StringParam,
  QueryParamProvider,
  useQueryParams,
} from "use-query-params";
import { createPreserveQueryHistory } from "./helpers/createPreserveHistory";
import BlockRawContainer from "./containers/BlockRawContainer";
import TransactionRawContainer from "./containers/TransactionRawContainer";
import MinerStatsPage from "./containers/MinerStatsPage";
import { IChain as Chain } from "./models/chain";
import useChainListStore from "./stores/useChainListStore";
import useEthRPCStore from "./stores/useEthRPCStore";
import Web3ReactManager from "components/Web3ReactManager";
import Header from "components/Header";
import { ModalContextProvider } from "contexts/ModalContext";
import PageUploadItem from "containers/PageUploadItem";
import TransferDetail from "containers/TransferDetail";

const history = createPreserveQueryHistory(createBrowserHistory, [
  "network",
  "rpcUrl",
])();

declare const window: any;

function App(props: any) {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;

  const [selectedChain, setSelectedChain] = useState<Chain>();
  const [chains] = useChainListStore<[Chain[], Dispatch<Chain[]>]>();
  const [ethRPC, setEthRPCChain] = useEthRPCStore();

  //  const [addChainDialogIsOpen, setAddChainDialogIsOpen] =
  //    useState<boolean>(false);

  // default the selectedChain once chain list loads
  useEffect(() => {
    if (selectedChain !== undefined) {
      return;
    }
    if (chains === undefined) {
      return;
    }
    if (chains.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }

    setSelectedChain(chains[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chains, selectedChain]);

  const [query, setQuery] = useQueryParams({
    network: StringParam,
    rpcUrl: StringParam,
  });

  // when url param is used to pick network,
  // keep things updated once chains list is loaded
  useEffect(() => {
    if (!chains || chains.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }

    if (query.network && selectedChain !== undefined) {
      if (query.network === selectedChain.name) {
        return;
      }
    }

    if (chains && query.network) {
      const foundChain = chains.find(
        (chain: Chain) => chain.name === query.network
      );
      setSelectedChain(foundChain);
    } else {
      setSelectedChain(chains[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chains, query.network]);

  // keeps the window.location in sync with selected network
  // useEffect(() => {
  //   if (selectedChain === undefined) {
  //     return;
  //   }
  //   const { name } = selectedChain as Chain;

  //   if (name !== query.network) {
  //     setQuery({ network: name });
  //     history.push({
  //       pathname: history.location.pathname,
  //       search: `?network=${name}`,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedChain, setQuery]);

  // keep selected chain in sync with the current ethrpc instance
  useEffect(() => {
    if (selectedChain !== undefined) {
      setEthRPCChain(selectedChain);
    }
  }, [selectedChain, setEthRPCChain]);

  React.useEffect(() => {
    if (ethRPC) {
      ethRPC.startBatch();
    }
  }, [ethRPC]);

  useInterval(
    () => {
      if (ethRPC) {
        ethRPC.stopBatch();
        ethRPC.startBatch();
      }
    },
    100,
    true
  );

  //  const openAddChainModal = () => {
  //    setAddChainDialogIsOpen(true);
  //  };

  //  const cancelAddChainDialog = () => {
  //    setAddChainDialogIsOpen(false);
  //  };

  //  const submitAddChainDialog = (c: Chain) => {
  //    setAddChainDialogIsOpen(false);
  //    setChains(chains.concat(c));
  //    setSelectedChain(c);
  //  };

  return (
    <Router history={history}>
      <ModalContextProvider>
        <Web3ReactManager>
          <ThemeProvider theme={theme}>
            <Header />

            <div>
              <QueryParamProvider ReactRouterRoute={Route}>
                <CssBaseline />
                <Switch>
                  <Route path={"/"} component={Dashboard} exact={true} />
                  <Route
                    path={"/create"}
                    component={PageUploadItem}
                    exact={true}
                  />
                  <Route path={"/detail/:tokenId"} component={TransferDetail} exact={true} />
                  {/* <Route
                    path={"/stats/validators"}
                    component={MinerStatsPage}
                    exact={true}
                  />
                  <Route
                    path={"/stats/validators/:block"}
                    component={MinerStatsPage}
                  />
                  <Route
                    path={"/block/:hash/raw"}
                    component={BlockRawContainer}
                  />
                  <Route path={"/block/:hash"} component={Block} />
                  <Route path={"/blocks/:number"} component={NodeView} />
                  <Route
                    path={"/tx/:hash/raw"}
                    component={TransactionRawContainer}
                  />
                  <Route path={"/tx/:hash"} component={Transaction} />
                  <Route
                    path={"/address/:address/:block"}
                    component={Address}
                  />
                  <Route path={"/address/:address"} component={Address} />
                  <Route path={"/contract/:address"} component={Address} />
                  <Route path={"/token/:address"} component={Address} /> */}
                </Switch>
              </QueryParamProvider>
            </div>
          </ThemeProvider>
        </Web3ReactManager>
      </ModalContextProvider>
    </Router>
  );
}
export default App;
