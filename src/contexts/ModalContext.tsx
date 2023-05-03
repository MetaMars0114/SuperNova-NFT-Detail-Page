import React, { createContext, useContext, useState } from "react";

export enum ApplicationModal {
  WALLET = 1,
}

interface IModalContext {
  modalState: { [key: number]: boolean };
  setModalState?: React.Dispatch<
    React.SetStateAction<{
      1: boolean;
    }>
  >;
}

const ModalContext = createContext<IModalContext>({
  modalState: {},
});

export const ModalContextProvider = ({ children }: { children: any }) => {
  const [modalState, setModalState] = useState({
    [ApplicationModal.WALLET]: false,
  });

  return (
    <ModalContext.Provider value={{ modalState, setModalState }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalOpen = (ModalType: ApplicationModal): Boolean => {
  const { modalState } = useContext(ModalContext);
  const selectedState = modalState[ModalType];

  return selectedState;
};

export const useToggleModal = (ModalType: ApplicationModal) => {
  const { modalState, setModalState } = useContext(ModalContext);
  return () => {
    if (setModalState) {
      setModalState({ ...modalState, [ModalType]: !modalState[ModalType] });
    }
  };
};

export default ModalContext;
