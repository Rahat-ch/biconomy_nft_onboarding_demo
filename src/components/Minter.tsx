import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../utils/abi.json";
import SmartAccount from "@biconomy/smart-account";
import styles from '../styles/Home.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    smartAccount: SmartAccount
    provider: any
    loading: boolean
  }

const Minter:React.FC<Props> = ({ smartAccount, provider, loading}) => {
    const [nftContract, setNFTContract] = useState<any>(null)
    const [nftCount, setNFTCount] = useState<number>(0);
    const nftAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";

    useEffect(() => {
      getNFTCount()
  },[])

    if(loading) {
        return <div />
    }

    const getNFTCount= async() => {
        const contract = new ethers.Contract(
            nftAddress,
            abi,
            provider,
          )
        setNFTContract(contract)
        const count = await contract.balanceOf(smartAccount.address)
        setNFTCount(count.toNumber());
    }

    const mintNFT = async () => {
        try {
            const infoToast = toast.info('Minting your NFT...', {
                position: "top-right",
                autoClose: 25000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            const mintTx = await nftContract.populateTransaction.mint()
            const tx1 = {
            to: nftAddress,
            data: mintTx.data,
            }
            const txResponse = await smartAccount.sendTransaction({ transaction: tx1})

            const txHash = await txResponse.wait();
            console.log({txHash})
            
            getNFTCount()
            toast.dismiss(infoToast)
            toast.success('Your NFT has been minted!', {
                position: "top-right",
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } catch (error) {
            console.log(error)
            toast.error('error occured check the console', {
                position: "top-right",
                autoClose: 25000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
    }

    const nftURL = `https://testnets.opensea.io/${smartAccount.address}`

    return(
        <div>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
            <button className={styles.demoButton} onClick={() => mintNFT()}>Mint NFT</button>
            {nftCount ? (<p>You own {nftCount} NFTs </p>): null}
            <p>View your NFTs <a className={styles.viewNFT} href={nftURL} target="_blank">here</a> after minting </p>
        </div>
    )
};

export default Minter;

