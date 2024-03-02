// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


contract Fastlane {
    string public name;
    address public owner;
    uint256 public tokenPrice;
    address [] public admins;
    address [] public segmentOwners;
    uint256 public totalTracks;

    mapping(address => uint256) private balance;
    mapping(uint256 => address) private trackOwner;

    constructor(
        string memory _name,
        uint256 _tokenprice
        ) {
        name = _name;
        tokenPrice = _tokenprice;
        owner = msg.sender;  
        admins.push(msg.sender);  //adds owner to admins
        }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the contract owners can call this function");
        _;
    }

    modifier onlyAdmin() {
        bool isAdmin = false;
        for (uint i = 0; i < admins.length; i++) {
            if (admins[i] == msg.sender) {
                isAdmin = true;
                break;
            }
        }
        require(isAdmin, "Only admins can call this function");
        _;
    }

    event TokenPurchased(
        address buyer, 
        uint256 amountPaid
    );

    //this will be our main pay function user will pay fee to contract to play the game

    function buyToken () external payable {
        require(msg.value >= tokenPrice, 'Insufficient funds');

        (bool success, ) = address(this).call{value: msg.value}("");
        require(success, "Transfer failed");

        splitFee();
        emit TokenPurchased(msg.sender, msg.value);
    }

    //this will split the road fee to all segment owners

    function splitFee() private {
        require(segmentOwners.length > 0, "No useres in array");
        uint256 feePerUser = (tokenPrice * 8) / (10 * segmentOwners.length);
        for (uint256 i= 0; i < segmentOwners.length; i++) {
            //balances will be updated in a forloop
            balance[segmentOwners[i]] += feePerUser;
        }
    }

    // Receive function to receive Ether sent directly to the contract
    // Handle Ether transfers sent directly to the contract
    receive() external payable {
    }

    // this will need to be changed from public but just for initial testing 
    //this might have to be incorporate into minting the track segments

    function mintSegment(address user) public {
        uint256 trackId = totalTracks + 1;
        trackOwner[trackId] = user;
        addSegmentOwner(user);
        totalTracks++;
    }

    function addSegmentOwner(address user) private {
        require(user != address(0), "segment owner cannot be a 0 address");
        segmentOwners.push(user);
    }

    //this will return an array of segment owners

    function getSegmentOwners() external view returns (address[] memory) {
    return segmentOwners;
    }

    // this function should retrieve the total balance of user 

    function balanceOf(address user) public virtual view returns (uint256) {
        return balance[user];
    }

    // this will add other dev team members to the owner category important that only the orginal contract deployer can call this function

    function addAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "Admin cannot be a 0 address");
        admins.push(newAdmin);
    }

    //returns a list of Admins

    function getAdmins() external view returns (address[] memory) {
        return admins;
    }

     //This function will be used only by the contract owners to withdraw funds from the contract

    function adminWithdraw(uint256 amount) onlyAdmin external {
        require(address(this).balance >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Admin Withdraw failed");
    }
    
    //this function will award road owners with the total value of their collected tolls to reduce tranaction fee we can 
    //I need to work on making this function be called by the deployer contract potentially

    function collectToll(address payable to) public payable {
        
        //retrieve balance of sender

        require(to != address(0), "Transfer to a zero address");
        uint256 prizeAmount = balanceOf(msg.sender);
        require(balanceOf(msg.sender) > 0, "No available balance to withdraw");

        //transfer balance to the specific address

        (bool success, ) = to.call{value: prizeAmount}("");
        require(success, "Transfer failed");

        //reset user balance to 0

        balance[msg.sender] = 0;
    }
    
    //this will tell any contract owner what the balance in the contract is
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}