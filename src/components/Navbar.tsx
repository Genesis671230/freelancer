import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import abi from '../abi/Freelancer.json'


const runABI = abi.abi
const Navbar = () => {
  const [accountAddress,setAccountAddress] = useState<String | null>()
 
  
 const contractAddress: string = '0x3d79863b00E9E96F19287eB5F2a79c31842038FA'
  const checkWallet = async() => { 
    if((window as any).ethereum){
      const accounts = await (window as any).ethereum.request({method:"eth_requestAccounts"} );
        const response = accounts[0] ;
        setAccountAddress(response)
    }
   }
  

    const getWhitelistedFreelancer = async() => { 
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)
      const listedJobs = await contract.whitelistF({gasLimit:100000});
      await listedJobs.wait()
      console.log(listedJobs)
    
  }



    const disconnectWallet = () => {
      setAccountAddress(null);
    }
  
  return (
    <div className='bg-transparent fixed w-full z-10 top-0  '>
     <div className='backdrop-blur-sm w-full h-full flex justify-between  bg-white/50 p-5'>
      <div>Jobs</div>

      <div className='flex justify-center gap-10 mr-20'>
      <div className='font-bold cursor-pointer'>Post Job</div>
      <div className='font-bold cursor-pointer'>Hire Freelancer</div>
      <div className='font-bold cursor-pointer'>Projects</div>
      <div className='font-bold cursor-pointer' onClick={getWhitelistedFreelancer}>Become a Freelancer</div>
      <div className='font-bold cursor-pointer' >{!accountAddress ? <div onClick={checkWallet}>Connect Wallet</div> : <div onClick={disconnectWallet}>{accountAddress}</div> }</div>
     </div>
    </div>
      </div>
  )
}

export default Navbar