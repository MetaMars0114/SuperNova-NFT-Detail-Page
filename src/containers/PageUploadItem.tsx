import React, { FC, useCallback, useState } from "react";
import generateBase64Encode from "utils/genBase64Encode";
import styled from "styled-components";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useActiveWeb3React } from "hooks";
import CreateModal from "components/Modal/CreateModal";
import { ButtonPrimary } from "components/Button";
import { useRecycleContract } from "hooks/useContract";

export interface PageUploadItemProps {
  className?: string;
}

const DragFileInput = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const projectId = "00d025dcca4d8e4121dd";
const projectSecret =
  "dbdc1650d97cf4b674d10cf7aa829a0af46b4fe3a64b2df85b3c643df9d148c3";

const StyledImage = styled.svg`
  overflow: hidden;
  width: 3rem;
  height: 3rem;
  margin-left: auto;
  margin-right: auto;
  color: #9ca3af;
`;

const Container = styled.div`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1rem;
  padding-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 1024px;
    `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 640px;
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 720px;
    `};
`;

const Container2 = styled.div`
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  margin-bottom: 3rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-top: 4rem;
    margin-bottom: 4rem;
    `};
`;

const CSVField = styled.div`
  --tw-space-y-reverse: 0;
  margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2.5rem * var(--tw-space-y-reverse));
`;

const UploadField = styled.div`
  border-style: dashed;
  border-width: 2px;
  border-color: rgba(209, 213, 219, 1);
  border-radius: 0.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
`;

const ButtonWrapper = styled.div`
  --tw-space-y-reverse: 0;
  margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2rem * var(--tw-space-y-reverse));
  display: flex;
  flex-direction: row;
  padding-top: 0.5rem;
`;

const UploadLabelAndInput = styled.div`
  display: flex;
`;

const UPloadLabel = styled.label`
  color: rgba(2, 132, 199, 1);
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  position: relative;
`;

const HiddenInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

const PageUploadItem: FC<PageUploadItemProps> = ({ className = "" }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<string | Blob | undefined>();
  const [assetInput, setAssetInput] = useState();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { chainId } = useActiveWeb3React();

  const recycleContract = useRecycleContract();

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      generateBase64Encode(file, setAssetInput, true);
      setFile(file);
    }
  }, []);

  const handleFileInputChange = useCallback(
    async (e: any) => {
      const file = e.target.files[0];
      setFile(file);
      setFileName(file.name);
      generateBase64Encode(file, setAssetInput, true);
    },
    [setAssetInput]
  );

  const handleCreate = useCallback(async () => {
    console.log("here");
    if (file && recycleContract) {
      const formData = new FormData();
      formData.append("file", file);

      const addedCSV = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          body: formData,
          headers: {
            pinata_api_key: projectId,
            pinata_secret_api_key: projectSecret,
          },
        }
      ).then((response) => response.json());
      const csv = `ipfs://${addedCSV.IpfsHash}`;
      const response = await recycleContract
        .mint(csv)
        .then((response: TransactionResponse) => response);
      return response;
    }
  }, [chainId, file, recycleContract]);

  return (
    <div
      className={`nc-PageUploadItem ${className}`}
      data-nc-id="PageUploadItem"
    >
      <Container>
        <Container2>
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Create New Item
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can create and deploy your very own NFT. You will pay a flat
              fee for every NFT minted.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <CSVField>
            <div>
              <h3 className="text-lg sm:text-2xl font-semibold">CSV file</h3>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                File types supported: CSV
              </span>
              {assetInput && (
                <div>
                  <img
                    alt={fileName}
                    src={assetInput}
                    className={"w-50 m-auto"}
                    width="500"
                  />
                </div>
              )}
              <form
                id="form-file-upload"
                onSubmit={(e) => e.preventDefault()}
                onDragOver={(e) => console.log(e)}
                onDragEnter={handleDrag}
                className="mt-5 relative"
              >
                <UploadField>
                  <div style={{ textAlign: "center" }}>
                    <StyledImage
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </StyledImage>
                    <UploadLabelAndInput className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                      <UPloadLabel
                        htmlFor="file-upload"
                        className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload </span>
                        <HiddenInput
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept={".csv"}
                          onChange={handleFileInputChange}
                        />
                      </UPloadLabel>
                      <p style={{ paddingLeft: 4 }}> or drag and drop</p>
                      {dragActive && (
                        <DragFileInput
                          id="drag-file-element"
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        />
                      )}
                    </UploadLabelAndInput>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      your NFT file, up to 50MB
                    </p>
                  </div>
                </UploadField>
                {dragActive && (
                  <DragFileInput
                    id="drag-file-element"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  />
                )}
              </form>
            </div>

            <ButtonWrapper className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 ">
              <ButtonPrimary
                className="flex-1"
                onClick={() => setModalOpen(true)}
              >
                Create NFT
              </ButtonPrimary>
            </ButtonWrapper>
          </CSVField>
        </Container2>
      </Container>
      <CreateModal
        show={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

// function CheckIcon(props: any) {
//   return (
//     <svg viewBox='0 0 24 24' fill='none' {...props}>
//       <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
//       <path
//         d='M7 13l3 3 7-7'
//         stroke='#fff'
//         strokeWidth={1.5}
//         strokeLinecap='round'
//         strokeLinejoin='round'
//       />
//     </svg>
//   )
// }

export default PageUploadItem;
