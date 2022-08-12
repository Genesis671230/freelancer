import { ethers } from 'ethers'
import  {BigNumber}  from 'ethers'
import React, { useEffect, useState } from 'react'
import abi from '../abi/Freelancer.json'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const runABI = abi.abi



const Hero = () => {
  const [accountAddress,setAccountAddress] = useState()

  const [listedJobs, setlistedJobs] = useState();
  const [open, setOpen] = useState(false);
   const [title,setTitle] = useState()
  const [deadline,setDealine] = useState()
  const [price,setPrice] = useState()





  const contractAddress = '0x3d79863b00E9E96F19287eB5F2a79c31842038FA'

  const listJobsArr = async() => { 
 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)
      const listedJobs = await contract.listJobs();

      const jobArr = listedJobs.map((item)=>{
        const single_Obj = Object.entries(item).map(([key,value])=>{
          return {[key]:value}
      })

      const perfectObj = {title:"",deadline:null,
      price:null,applied:null,hiredFreelancer:"",status:null}
      single_Obj.map((item)=>{
        if(item.title){
          perfectObj.title = item.title;
        }
        if(item.deadline){
          perfectObj.deadline = (new Date(BigNumber.from(item.deadline).toNumber()*1000)).toLocaleString();
        }
        if(item.price){

          perfectObj.price = BigNumber.from(item.price).toNumber();
        }
        if(item.applied){

          perfectObj.applied = item.applied;
        }
        if(item.hiredFreelancer){
          perfectObj.hiredFreelancer = item.hiredFreelancer
        }
        if(item.status){
          perfectObj.status = item.status
        }
      })
      
      
      return perfectObj;
      })

      setlistedJobs(jobArr);
    
  }

  const PostJobFUN = async() => { 
      const provider = new ethers.providers.Web3Provider(window .ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)

    const num_price = ethers.utils.parseEther(price)
      const listedJobs = await contract.PostJob(title,deadline,num_price,{value:num_price});
      const res = await listedJobs.wait()

      console.log(res)
    
  }

  const totalJobs = async() => { 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)
      const listedJobs = await contract.totalJobSupply();
      const res = BigNumber.from(listedJobs).toNumber()
      console.log(res)
    
  }
  const applyforjob = async(id) => { 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)
      const listedJobs = await contract.applyForJob(id,{gasLimit:120000});
      await listedJobs.wait()
      console.log(listedJobs)
    window.location.reload()
  }

  const completeJob = async(id) => { 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress,runABI,signer)
      const listedJobs = await contract.applyForJob(id,{gasLimit:90000});
      await listedJobs.wait()
      console.log(listedJobs)
  }

  useEffect(() => {
    listJobsArr()
  }, []);



  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const close_With_PostingJob = () => {
  PostJobFUN();
  setTitle();
  setDealine();
  setPrice();
    setOpen(false);
  };
  const handleClose = () => { 
  setOpen(false);

   }


   const checkWallet = async() => { 
    if(window.ethereum){
      const accounts = await window.ethereum.request({method:"eth_requestAccounts"} );
        const response = accounts[0] ;
        setAccountAddress(response)
    }
   }

   useEffect(() => {
    checkWallet()
 }, [])
 
  return (
    <div>
       <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent >
          <DialogContentText>
           To Post your job make sure to define title, duration and price of the project
          </DialogContentText>
          <div className='flex  justify-between gap-10'>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Job Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Deadline"
            type="number"
            fullWidth
            value={deadline}
            onChange={(e)=>setDealine(e.target.value)}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Cost"
            type="number"
            fullWidth
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            variant="standard"
          />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={close_With_PostingJob}>Post Job</Button>
        </DialogActions>
      </Dialog>

      
    <div className='bg-[url("https://source.unsplash.com/random/?freelancer")] h-screen bg-cover flex justify-center items-start flex-col'>
        <div className='text-capitalize backdrop-blur-sm h-full  bg-white/50 p-40  rounded-br-full  gap-10  justify-center flex flex-col   '>
            <div className='font-bold text-3xl uppercase'>Welcome to new Era of Freelancing</div>
            
            
            <div>
        <div className='font-bold text-xl '>Hire Professional Talent</div>
        <div>Trusted by over 500,000 Clients and 200+ Companies</div>
            </div>
            
            <div className='flex gap-5'>
        <div onClick={totalJobs}><button className='rounded-lg bg-slate-500 p-3 text-white'>Hire Freelancer</button></div>
        <div onClick={handleClickOpen}><button className='rounded-lg bg-red-600 p-3 text-white'>Post a Job</button></div>
            </div>
        </div>
    </div>

    <div className=' flex  bg-yellow-600 justify-center items-center'>
      <div className='m-10 w-full gap-y-10 flex flex-wrap  '>
      {listedJobs?.map((item,index)=>(
        <div className={`m-10 backdrop-blur-sm h-full  rounded-lg p-5  bg-white/50 ${item?.status == 1 && 'w-full'} `}>
          <div className='font-bold'>
          <span className='mr-5'>Job title</span>{item?.title}
          </div>
          <div className=''>
          <span className='mr-5 text-sm'>Deadline</span> {item?.deadline}
          </div>
          <div className=''>
          <span className='mr-5 text-sm'>Project price</span> <span>${item?.price}</span>
          </div>
          {item?.hiredFreelancer != 0x0000000000000000000000000000000000000000 ? ( 
          <div className=''>
          <span className='mr-5 text-sm'>Hired freelancer</span> <span>{item?.hiredFreelancer}</span>
          </div>)
          : null}


          {item?.status == null  && ( 
            <div className=''>
          <span className='mr-5 text-sm'>Active
          <div onClick={()=>applyforjob(index)}><button className='rounded-lg bg-red-600 p-3 mt-5 text-white'>Apply for Job</button></div>
          </span>

          </div>)}

          {item?.status == 1 && (<span>Pending ...</span>)}
          
          { item?.hiredFreelancer.toUpperCase() == accountAddress?.toUpperCase() && (
          <div onClick={()=>completeJob(index)}><button className='rounded-lg bg-red-600 p-3 mt-5 text-white'>Deliever Project</button></div>
          )}
        </div>
      ))}
      </div>
    </div>
    </div>
  )
}

export default Hero