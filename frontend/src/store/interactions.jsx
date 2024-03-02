import { ethers } from 'ethers';
import FASTLANE_ABI from '../abis/Fastlane.json'
import OBSTACLES_ABI from '../abis/Obstacles.json'


export const loadProvider = (dispatch) => {
	const connection = new ethers.providers.Web3Provider(window.ethereum)
	dispatch({ type: 'PROVIDER_LOADED', connection })

	return connection
}

export const loadNetwork = async (provider, dispatch) => {
	const {chainId} = await provider.getNetwork()
	dispatch({ type: 'NETWORK_LOADED', chainId })

	return chainId
}

export const loadAccount = async (provider, dispatch) => {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])

    dispatch({ type: 'ACCOUNT_LOADED', account })

    return account
}

export const loadFastlane = async (provider, address, dispatch) => {
	const fastlane = new ethers.Contract(address, FASTLANE_ABI, provider)
		dispatch({ type: 'FASTLANE_LOADING', fastlane })

		const segmentOwners = (await fastlane.getSegmentOwners()).toString()
		dispatch({ type: 'SEGMENT_OWNERS_LOADED', segmentOwners})

		const user = await provider.getSigner().getAddress()

		const userBalance = (await fastlane.balanceOf(user)).toString()
		dispatch({ type: 'USER_BALANCE_LOADED', userBalance})

		dispatch ({ type: 'FASTLANE_LOADED', fastlane })

		const totalTrack = await fastlane.totalTracks()
		const totalTracks = totalTrack.toString();
		dispatch({ type: 'TOTAL_TRACKS_LOADED', totalTracks})
		console.log(totalTracks)

	return fastlane
}

export const loadObstacles = async (provider, address, dispatch) => {
const obstacles = new ethers.Contract(address, OBSTACLES_ABI, provider)
		dispatch({ type: 'OBSTACLES_LOADING', obstacles })

		dispatch ({ type: 'OBSTACLES_LOADED', obstacles })
		

	return obstacles
}