import React, { FC, useCallback, useState } from "react";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import Modal from "./index";
import { ButtonPrimary } from "components/Button";
import { ButtonSecondary } from "components/Button";
import styled from "styled-components";

export interface ModalEditProps {
  show: boolean;
  onCloseModal: () => void;
  onCreate: () => Promise<TransactionResponse>;
}

export enum ModalState {
  IDLE,
  PENDING,
  SUBMITTED,
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  margin-top: 20px;
  justify-content: center;
`;

const CreateModal: FC<ModalEditProps> = ({ show, onCloseModal, onCreate }) => {
  const [state, setState] = useState<ModalState>(ModalState.IDLE);

  const handleSubmit = useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setState(ModalState.PENDING);
      onCreate()
        .then(() => {
          setState(ModalState.SUBMITTED);
        })
        .catch(() => {
          setState(ModalState.IDLE);
        });
    },
    [onCreate]
  );

  return (
    <Modal isOpen={show} onDismiss={onCloseModal}>
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Create NFT
        </h3>
        <>
          {state === ModalState.IDLE ? (
            <>
              <span className="text-sm">
                Are you sure you want to create a new NFT with these attributes?
              </span>
              <ButtonGroup>
                <ButtonPrimary type="submit">Create</ButtonPrimary>
                <ButtonSecondary type="button" onClick={onCloseModal}>
                  Cancel
                </ButtonSecondary>
              </ButtonGroup>
            </>
          ) : state === ModalState.PENDING ? (
            <div>
              <span className="text-sm">Processing, please wait...</span>
            </div>
          ) : state === ModalState.SUBMITTED ? (
            <div>
              <span className="text-sm">
                Your transaction has been submitted. We will let you know when
                it's confirmed by the network. You can safely close this popup.
              </span>
            </div>
          ) : null}
        </>
      </form>
    </Modal>
  );
};

export default CreateModal;
