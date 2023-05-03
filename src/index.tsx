import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { ReusableProvider } from "reusable";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import "./i18n";
import getLibrary from "./utils/getLibrary";
import ThemeProvider from "theme";

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");

if ("ethereum" in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ReusableProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ReusableProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </I18nextProvider>,
  document.getElementById("root") as HTMLElement
);
