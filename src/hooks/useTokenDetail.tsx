import { useEffect, useState } from "react"
import { useRecycleContract } from "./useContract"
import { resolveIPFS } from "utils"

const useTokenDetail = (tokenId: string) => {
    const recycleContract = useRecycleContract()

    const [tokenURI, setTokenURI] = useState<any>()
    const [csvData, setCsvData] = useState<any>()

    useEffect(() => {
        (async () => {
            try {
                if (recycleContract && tokenId) {
                    const tokenURI = await recycleContract.tokenURI(tokenId)
                    setTokenURI(tokenURI)
                }
            } catch (err) {
                console.log(err)
            }
        })()
    }, [recycleContract, tokenId])

    useEffect(() => {
        if (tokenURI) {
            fetch(resolveIPFS(tokenURI), {
                method: 'get',
                mode: 'no-cors',
                headers: {
                    'content-type': 'text/csv;charset=UTF-8',
                    //'Authorization': //in case you need authorisation
                }
            })
                .then((res) => {
                    return res.text()
                })
                .then((res) => {
                    console.log(res)
                })
        }
    }, [tokenURI])

    return {
        tokenURI
    }
}

export default useTokenDetail