// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Recycle is ERC721Enumerable, Ownable, ReentrancyGuard {
  using Strings for uint256;
  using EnumerableSet for EnumerableSet.AddressSet;

  uint256 public cost = 1 ether;
  uint256 public maxSupply = 100000;
  bool public paused = false;
  bool public feeOn = true;
  bool public revealed = false;
  string public notRevealedUri;

  EnumerableSet.AddressSet private admins;
  mapping(uint256 => string) private _tokenURIs;

  constructor(
    string memory _name,
    string memory _symbol
  ) ERC721(_name, _symbol) {
  }

  modifier onlyAdmin() {
    require(msg.sender == owner() || admins.contains(msg.sender), "not admin");
    _;
  }


  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  // public
  function mint(string memory _tokenURI) public payable nonReentrant {
    
    uint256 supply = totalSupply();

    require(!paused);
    require(supply < maxSupply);

    if (msg.sender != owner() && feeOn == true) {
      require(msg.value >= cost);
    }
    _safeMint(msg.sender, supply);

    _setTokenURI(supply, _tokenURI);
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    string memory _tokenURI = _tokenURIs[tokenId];

    return _tokenURI;
  }

  function updateTokenURI(uint256 _tokenId, string memory _tokenURI) external onlyAdmin nonReentrant {
    _setTokenURI(_tokenId, _tokenURI);
  }

  function removeTokenURI(uint256 _tokenId) external onlyAdmin nonReentrant {
    _setTokenURI(_tokenId, "");
  }

  //only owner
  function reveal() public onlyOwner {
      revealed = true;
  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setFeeOn(bool _feeOn) public onlyOwner {
    feeOn = _feeOn;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
  function withdraw() public payable onlyOwner nonReentrant {
    // This will payout the owner 95% of the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }

  function adminAdd(address _newAdmin) external onlyOwner {
    require(!admins.contains(_newAdmin), "Already added");

    admins.add(_newAdmin);
  }

  function adminRevoke(address _admin) external onlyOwner {
    require(admins.contains(_admin), "No admin address");

    admins.remove(_admin);
  }
}
