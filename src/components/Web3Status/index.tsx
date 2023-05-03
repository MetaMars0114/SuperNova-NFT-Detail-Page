import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { darken, lighten } from "polished";
import React from "react";
import { Activity } from "react-feather";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import WalletConnectIcon from "../../assets/images/walletConnectIcon.svg";
import { injected, walletconnect } from "../../connectors";
import { NetworkContextName } from "../../constants";
import useENSName from "../../hooks/useENSName";

import { shortenAddress } from "../../utils";
import { ButtonSecondary } from "../Button";
import WalletSVG from "../../assets/svg/wallet.svg";

import Identicon from "../Identicon";

import WalletModal from "../WalletModal";
import { ApplicationModal, useToggleModal } from "contexts/ModalContext";

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`;

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`;

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  // background-color: ${({ theme }) => theme.primary4};
  background: linear-gradient(241deg, #f6509c, #8f2ffd);
  border: none;
  color: white;
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
      }
    `}
`;

const Web3StatusConnected = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => lighten(0.05, theme.bg2)};

    :focus {
      border: 1px solid ${({ theme }) => darken(0.1, theme.bg3)};
    }
  }
`;

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`;

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />;
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={""} />
      </IconWrapper>
    );
  }
  return null;
}

function Web3StatusInner() {
  const { t } = useTranslation();
  const { account, connector, error } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const toggleWalletModal = useToggleModal(ApplicationModal.WALLET);

  if (account) {
    return (
      <Web3StatusConnected
        id="web3-status-connected"
        onClick={toggleWalletModal}
      >
        <Text>{ENSName || shortenAddress(account)}</Text>
        {connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    );
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>
          {error instanceof UnsupportedChainIdError ? "Wrong Network" : "Error"}
        </Text>
      </Web3StatusError>
    );
  } else {
    return (
      <Web3StatusConnect
        id="connect-wallet"
        onClick={toggleWalletModal}
        faded={!account}
      >
        <img src={WalletSVG} alt="wallet-icon" />
        <Text>{t("Connect Wallet")}</Text>
      </Web3StatusConnect>
    );
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const { ENSName } = useENSName(account ?? undefined);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} />
    </>
  );
}
