export const provider = (state = {}, action) => {
	switch (action.type) {
		case 'PROVIDER_LOADED':
		return {
			...state, 
			connection: action.connection
		}

		case 'NETWORK_LOADED':
		return {
			...state, 
			chainId: action.chainId
		}

		case 'ACCOUNT_LOADED':
		return {
			...state, 
			account: action.account
		}
	default:
		return state
	}
}

const DEFAULT_FASTLANE_STATE = {
	loading:false, 
	contract: {},
	segmentOwners:[],
	userBalance: [],
	totalTracks: null,
	events: [] 
}

export const fastlane = (state = DEFAULT_FASTLANE_STATE, action) => {

	switch (action.type) {

		case 'FASTLANE_LOADING':
	      	return {
	        ...state,
	        loading: true,
      		}

		case 'FASTLANE_LOADED':
			return {
				...state,
				loading: false,
				contract: action.fastlane
			}

		case 'SEGMENT_OWNERS_LOADED':
			return {
				...state,
				loading: false,
				segmentOwners: action.segmentOwners
			}
		case 'USER_BALANCE_LOADED':
			return {
				...state,
				loading: false,
				userBalance: action.userBalance
			}

		case 'TOTAL_TRACKS_LOADED':
			return {
				...state,
				loading: false,
				totalTracks: action.totalTracks
			}	

		default:
			return state
	}
}

const DEFAULT_OBSTACLES_STATE = {
	loaded:false, 
	contract: {},
}

export const obstacles = (state = DEFAULT_OBSTACLES_STATE, action) => {

	switch (action.type) {

		case 'OBSTACLES_LOADING':
	      	return {
	        ...state,
	        loaded: true,
      		}

		case 'OBSTACLES_LOADED':
			return {
				...state,
				loaded: true,
				contract: action.obstacles
			}


		default:
			return state
	}
}