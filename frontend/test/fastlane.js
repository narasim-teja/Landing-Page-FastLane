const { expect } = require("chai");
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Fastlane', () => {
  let fastlane, accounts, deployer
  beforeEach(async () => {
    const Fastlane = await ethers.getContractFactory('Fastlane')
    fastlane = await Fastlane.deploy('Fastlane', tokens(5))
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]
    user3 = accounts[3]
    user4 = accounts[4]
    user5 = accounts[5]
  })

  describe('Deployment', () => {
    const name ='Fastlane'
    const tokenPrice = tokens(5)

    it('Has correct name', async () => {
    expect(await fastlane.name()).to.equal(name)
    })

    it('Has correct token price', async () => {
      expect(await fastlane.tokenPrice()).to.equal(tokenPrice)
    })
  })

  describe('Functions', () => {
    it('Buys a token, splits the token fee and updates balences', async () => {
    const tokenPrice = tokens(5)
    balanceBefore = await ethers.provider.getBalance(user1.address)
    await fastlane.connect(deployer).mintSegment(user2.address)
    await fastlane.connect(deployer).mintSegment(user3.address)
    await fastlane.connect(deployer).mintSegment(user4.address)
    await fastlane.connect(deployer).mintSegment(user5.address)
    transaction = await fastlane.connect(user1).buyToken({value: tokenPrice})
    result = await transaction.wait()
    balanceAfter = await ethers.provider.getBalance(user1.address)
    expect (balanceBefore < balanceAfter)
    const balance1= await fastlane.balanceOf(user2.address)
    expect (balance1).to.equal(tokens(1))
    const balance2= await fastlane.balanceOf(user3.address)
    expect (balance2).to.equal(tokens(1))
    const balance3= await fastlane.balanceOf(user4.address)
    expect (balance3).to.equal(tokens(1))
    const balance4= await fastlane.balanceOf(user5.address)
    expect (balance4).to.equal(tokens(1))
    expect(await fastlane.totalTracks()).to.equal(4)
    })

    it('Adds a new admin', async () => {
      await fastlane.connect(deployer).addAdmin(user1.address)
      const admins = await fastlane.getAdmins()
      expect(admins).to.include(user1.address)
      expect(admins).to.include(deployer.address)
    })

    it('Adds a new segment owner', async () => {
      await fastlane.connect(deployer).mintSegment(user2.address)
      await fastlane.connect(deployer).mintSegment(user3.address)
      const segmentOwners = await fastlane.getSegmentOwners()
      expect(segmentOwners).to.include(user2.address)
      expect(segmentOwners).to.include(user3.address)
    })

    

    it('Users can withdraw their balance from the contract', async () => {
      const tokenPrice = tokens(5)
      await fastlane.connect(deployer).mintSegment(user2.address)
      await fastlane.connect(deployer).mintSegment(user3.address)
      await fastlane.connect(deployer).mintSegment(user4.address)
      await fastlane.connect(deployer).mintSegment(user5.address)
      balanceBefore = await ethers.provider.getBalance(user2.address)
      await fastlane.connect(user1).buyToken({value: tokenPrice})
      const balance1= await fastlane.balanceOf(user2.address)
      await fastlane.connect(user2).collectToll(user2.address)
      balanceAfter = await ethers.provider.getBalance(user2.address)
      const balance2= await fastlane.balanceOf(user2.address)
      expect (balanceBefore > balanceAfter)
      expect (balance2).to.equal(0)
    })

    it('Admin can withdraw funds from smart contract', async () => {
      const tokenPrice = tokens(5)
      balanceBefore = await ethers.provider.getBalance(deployer.address)
      console.log(balanceBefore)
      await fastlane.connect(deployer).mintSegment(user2.address)
      transaction = await fastlane.connect(user1).buyToken({value: tokenPrice})
      result = await transaction.wait()
      transacion2 = await fastlane.connect(deployer).adminWithdraw(tokens(5))
      balanceAfter = await ethers.provider.getBalance(deployer.address)
      console.log(balanceAfter)
      expect (balanceAfter > balanceBefore)
    })
  })
})

describe('Failure cases', () => {
  let fastlane, accounts, deployer
  beforeEach(async () => {
    const Fastlane = await ethers.getContractFactory('Fastlane')
    fastlane = await Fastlane.deploy('Fastlane', tokens(5))
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1] 
  })
    it('Rejects users trying to withdraw funds with 0 balance', async () => {
      await expect(fastlane.connect(user2).collectToll(user2.address)).to.be.reverted
    })

    it('Stops any non-owner attempting to add admins', async () => {
      await expect(fastlane.connect(user1).addAdmin(user1.address)).to.be.reverted
    })

    it('Stops any non-owner attempting to adminWithdraw from contract', async () => {
      const tokenPrice = tokens(5)
      await fastlane.connect(deployer).mintSegment(user2.address)
      await fastlane.connect(user2).buyToken({value: tokenPrice})
      await expect(fastlane.connect(user1).adminWithdraw(user1.address)).to.be.reverted
    })
})

describe('Obstacles', () => {
  let obstacles, accounts, deployer
  beforeEach(async () => {
    const Obstacles = await ethers.getContractFactory('Obstacles')
    obstacles = await Obstacles.deploy('Obstacles', "4")
    accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  describe('Deployment' , () => {
    const name = 'Obstacles'
    const totalSupply = '0'
    const maxSupply = '4'

    it('Has correct name', async () => {
    expect(await obstacles.name()).to.equal(name)
    })

    it('Has correct max supply', async () => {
      expect(await obstacles.maxSupply()).to.equal(maxSupply)
    })

  })

  describe('Mint All NFTs' , () => {
    let transaction, result
    
    beforeEach(async () => {
    transaction = await obstacles.connect(deployer).mintAllTokens(deployer.address)
    result = await transaction.wait()
    })

    it('Mints all NFT to deployer', async () => {
      expect(await obstacles.ownerOf(0)).to.equal(deployer.address)
      expect(await obstacles.ownerOf(1)).to.equal(deployer.address)
      expect(await obstacles.ownerOf(2)).to.equal(deployer.address)
      expect(await obstacles.ownerOf(3)).to.equal(deployer.address)
    })

    it('Emits a transfer events', async () => {
      const event = result.events[1]
      expect(event.event).to.equal("Transfer")
      const args = event.args
      expect(args.to).to.equal(deployer.address)
      expect(args.tokenId).to.equal(1)
    })

    it('Sets the correct tokenURI for tokenId 3', async () => {
      const checkURI = await obstacles.connect(deployer).tokenURI(3)
      const expectedURI = "file://obstacleMetadata/3"
      expect(checkURI).to.equal(expectedURI)
    })
  })

  describe('Failure cases' , () => {
    it('Rejects mint attempts from addresses other than the owner', async () => {
      await expect(obstacles.connect(user1).mintAllTokens(user1.address)).to.be.reverted  
    })
  })
})