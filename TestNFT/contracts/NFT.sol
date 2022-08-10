pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFT is ERC721, PullPayment, Ownable {
  using Counters for Counters.Counter;

  uint256 public constant TOTAL_SUPPLY = 10_000;
  uint256 public constant MINT_PRICE = 0.01 ether;

  Counters.Counter private currentTokenId;

  string public baseTokenURI;

  constructor() ERC721("NFTTutorial", "NFT") {
    baseTokenURI = "";
  }

  function getTokenId() public view returns (uint256) {
    return currentTokenId.current();
  }

  function mintTo(address recipient) public payable returns (uint256) {
    uint256 tokenId = currentTokenId.current();
    require(tokenId < TOTAL_SUPPLY, "Max supply reached");
    require(msg.value == MINT_PRICE, "Transaction value did not equal the mint price");

    currentTokenId.increment();
    uint256 newItemId = currentTokenId.current();
    _safeMint(recipient, newItemId);
    return newItemId;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

  function withdrawPayments(address payable payee) public override onlyOwner virtual {
      super.withdrawPayments(payee);
  }
}