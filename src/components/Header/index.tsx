import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  InputBase,
  Tooltip,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { createBrowserHistory } from "history";
import expeditionLogo from "../../expedition.png";
import { useTranslation } from "react-i18next";
import { isAddress } from "utils";
import { createPreserveQueryHistory } from "../../helpers/createPreserveHistory";
import useEthRPCStore from "stores/useEthRPCStore";
import ETHJSONSpec from "@etclabscore/ethereum-json-rpc-specification/openrpc.json";
import HeaderSub2 from "./headerSub2";
import useDarkMode from "use-dark-mode";
import { Public } from "@material-ui/icons";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { useActiveWeb3React } from "hooks";
import styled from "styled-components";
import Web3Status from "components/Web3Status";

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) =>
    !active ? theme.bg2 : theme.bg4};
  } */
`;

const isKeccakHash = (q: string): boolean => {
  const re = new RegExp(ETHJSONSpec.components.schemas.Keccak.pattern);
  return re.test(q);
};

const isBlockNumber = (q: string): boolean => {
  const re = new RegExp(/^-{0,1}\d+$/);
  return re.test(q);
};

const history = createPreserveQueryHistory(createBrowserHistory, [
  "network",
  "rpcUrl",
])();

const Header = () => {
  const { t } = useTranslation();
  const darkMode = useDarkMode();

  const [ethRPC] = useEthRPCStore();
  const [search, setSearch] = useState();
  const { account } = useActiveWeb3React();

  const handleSearch = async (qry: string | undefined) => {
    if (qry === undefined) {
      return;
    }
    const q = qry.trim();
    if (isAddress(q)) {
      history.push(`/address/${q}`);
    }
    if (isKeccakHash(q)) {
      let transaction;

      try {
        transaction = await ethRPC.eth_getTransactionByHash(q);
      } catch (e) {
        // do nothing
      }

      if (transaction) {
        history.push(`/tx/${q}`);
      }
      let block;
      try {
        block = await ethRPC.eth_getBlockByHash(q, false);
      } catch (e) {
        // do nothing
      }
      if (block) {
        history.push(`/block/${q}`);
      }
    }
    if (isBlockNumber(q)) {
      const block = await ethRPC.eth_getBlockByNumber(
        `0x${parseInt(q, 10).toString(16)}`,
        false
      );
      if (block) {
        history.push(`/block/${block.hash}`);
      }
    }
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        borderRight: "1px solid rgba(0,0,0,0.15)",
        borderLeft: "1px solid rgba(0,0,0,0.15)",
        padding: "5px",
        margin: "auto",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "95vw",
        maxWidth: "1366px",
        borderRadius: "0px 0px 10px 10px",
      }}
    >
      <Toolbar
        style={{
          margin: "auto",
          textAlign: "center",
          alignContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1280px",
        }}
      >
        <Grid
          container
          alignItems="center"
          alignContent="center"
          style={{ margin: "0px", maxWidth: "100%" }}
        >
          <Grid item  style={{ margin: "auto" }}>
            <Link
              component={({
                className,
                children,
              }: {
                children: any;
                className: string;
              }) => (
                <RouterLink className={className} to={"/"}>
                  {" "}
                  {children}{" "}
                </RouterLink>
              )}
            >
              <Grid container  style={{ margin: "7px" }}>
                <Grid>
                  {" "}
                  <div>
                    {" "}
                    <img alt="Logo" height="32" src={expeditionLogo} />{" "}
                  </div>{" "}
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid item style={{ margin: "auto" }}>
            <div>
              <InputBase
                placeholder={t("Search addresses, transactions, and blocks...")}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.keyCode === 13) {
                    handleSearch(search);
                  }
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value) {
                    const { value } = event.target;
                    setSearch(value as any);
                  }
                }}
                fullWidth
                style={{
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: "99px",
                  padding: "5px 5px 5px 15px",
                  fontSize: "10pt",
                  fontWeight: "normal",
                  width: "700px",
                  minWidth: "305px",
                  maxWidth: "55vw",
                  margin: "5px",
                  textAlign: "center",
                }}
              />
            </div>
          </Grid>
          <div style={{ margin: "0px 0px 0px 0px" }}>
            {" "}
            <HeaderSub2 />{" "}
          </div>
          <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
            <Web3Status />
          </AccountElement>

          {/* <div style={{margin: "7px"}}> <HeaderSub1 />  </div> */}

          {/* <div>
            <Button
              color="secondary"
              variant="outlined"
              href="https://novanetwork.io/verified-contracts"
              target="_blank"
              style={{ borderRadius: "10px" }}
              >Tokens</Button>
          </div> */}

          <div style={{ margin: "7px" }}>
            <Tooltip title={t("Official Website") as string}>
              <IconButton
                size="small"
                onClick={() => window.open("https://novanetwork.io/")}
              >
                <Public />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ margin: "7px" }}>
            <Tooltip title={t("Official Twitter") as string}>
              <IconButton
                size="small"
                onClick={() =>
                  window.open("https://twitter.com/NovaNetworkSNT")
                }
              >
                <TwitterIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ margin: "7px" }}>
            <Tooltip title={t("Github") as string}>
              <IconButton
                size="small"
                onClick={() =>
                  window.open("https://github.com/nova-network-inc/")
                }
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ margin: "7px" }}>
            <Tooltip title={t("Dark/Light Mode") as string}>
              <IconButton onClick={darkMode.toggle} size="small">
                {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
