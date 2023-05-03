import useTokenDetail from 'hooks/useTokenDetail'
import React from 'react'
import { useParams } from 'react-router'

interface TransferDetailProps {
    tokenId: string
}

const TransferDetail = () => {
    const { tokenId } = useParams<TransferDetailProps>()

    const { tokenURI } = useTokenDetail(tokenId)

    return (
        <div>
            {tokenURI}
        </div>
    )
}

export default TransferDetail