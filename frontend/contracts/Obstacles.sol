//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract Obstacles {
	using Strings for uint256;

	string public name;
	uint256 public maxSupply;
	address public owner;
	string private baseURI;

	mapping(uint256 => bool) private _exists;
	mapping(uint256 => string) private _tokenURIs;
	mapping(uint256 => address) private tokenOwner;

	event Log(string message);

	event Transfer(
		address indexed from,
		address indexed to,
		uint256 indexed tokenId
		);

	constructor(
		string memory _name,
		uint256 _maxSupply
		) {
		name = _name;
		maxSupply= _maxSupply;
		owner = msg.sender;  
		baseURI = "file://obstacleMetadata/";
		}
	
	modifier onlyOwner {
		require(msg.sender == owner, "Only the ticket Master can call this function");
		_;
	}
	
	function _mint(address to, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(!_exists[tokenId], "Token already exists");
		
		tokenOwner[tokenId] = to;
		_exists[tokenId] = true;

		emit Transfer(address(0), to, tokenId);
	}
	function mint(address to, uint256 tokenId, string memory _tokenURI) public onlyOwner virtual {
		require(to != address(0), "ERC: mint to the zero address");
		
		_mint(to, tokenId);
		_setTokenURI(tokenId, _tokenURI);
		
	}

	function mintAllTokens(address to) public onlyOwner{
		for(uint256 i = 0; i < maxSupply; i++) {
			mint(to , i , i.toString());
		}
	}

	function tokenURI(uint256 tokenId) public view returns (string memory) {
		require(_exists[tokenId], "URI querry for nonexistent token");
		
		string memory _tokenURI = _tokenURIs[tokenId];

		if (bytes(_tokenURI).length > 0) {
			return string(abi.encodePacked(baseURI, _tokenURI));
		} else {
			return string(abi.encodePacked(baseURI, tokenId));
		}
	}

	function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
		if (bytes(_tokenURI).length > 0) {
			_tokenURIs[tokenId] = _tokenURI;
		} else {
			_tokenURIs[tokenId] = string(abi.encodePacked(tokenId));
		}
	}

	function ownerOf(uint256 tokenId) external virtual view returns (address) {
		return tokenOwner[tokenId];
	}
}