import { useSelector } from 'react-redux'
import {ethers} from 'ethers'

const Testing = () => {
	const provider = useSelector(state => state.provider.connection)
    const fastlane = useSelector(state => state.fastlane.contract)
    const userAccount = useSelector(state => state.provider.account)
    const userBalance = useSelector(state => state.fastlane.userBalance)
   	
    
    
	const handleBuy = async () => {
        const buyTokenPrice = ethers.utils.parseEther("20")
        const signer = provider.getSigner()
        let transaction = await fastlane.connect(signer).buyToken({value: buyTokenPrice}) 
        await transaction.wait()
    }

    //const addSegmentOwner = async () => {
    //	const signer = provider.getSigner()
    //	let transaction = await fastlane.connect(signer).addSegemntOwner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8") 
     //   await transaction.wait()
    //}

    const collect = async () => {
    	const signer = provider.getSigner()
    	let transaction = await fastlane.connect(signer).collectToll(userAccount) 
        await transaction.wait()
    }

    const mint = async () => {
    	const signer = provider.getSigner()
    	let transaction = await fastlane.connect(signer).mintSegment(userAccount)
        await transaction.wait()
    }

	return(
		<div className=''>
		 		<div>
		 			<button onClick={handleBuy}>Buy Token</button>
		 		</div>	 
		 		<div> Total Winings: {userBalance}
		 			<br></br>
		 			<button onClick={collect}>Collect Winnings</button>
		 			<button onClick={mint}>Mint Track</button>
		 		</div>		
		</div>
	)
}
export default Testing;