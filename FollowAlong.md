# Follow-Along - Smart Contract
Follow the instructions below to write code for a smart contract!

## Getting Started with Remix
**Remix** is an online IDE (**I**ntegrated **D**evelopment **E**nvironment) for Ethereum. Basically, it's a place where you can write smart contracts, and test them out!

### Basic Rundown
Start by walking through the interactive tour of Remix.

1. [Click here to go to Remix](https://remix.ethereum.org/)
1. Click through the opening pop-up - either option is fine  
  ![](Assets/improveremix.png)
1. Click "Next" on the "Welcome to Remix" pop-up  
  ![](Assets/welcometoremix.png)
1. The next pop-up shows where the compiler is - this is where code is saved and built  
  ![](Assets/soliditycompiler.png)
1. The pop-up after that shows where the deployment is - this is where you can test out the smart contracts you've built  
  ![](Assets/deploycontract.png)

### Running Code
Now it's time to run some code!

1. On the left side of the screen, click the "Files" menu, open the "Contracts" folder, and click on the **1_Storage.sol** file to open it  
  ![](Assets/openstoragesol.png)
1. Take a look at the code - there is a **number**, a **store** function, and a **retrieve** function  
  - Don't worry if this doesn't make too much sense!
1. Save and build the code by opening the "Compiler" menu, and clicking the "Compile 1_Storage.sol" button  
  ![](Assets/compilebutton.png)
1. Now, test the code by opening the "Deploy" menu, and clicking the "Deploy" button  
  ![](Assets/deploybutton.png)
1. The contract is live! Scroll down and open it up to see how it looks  
  ![](Assets/deployedstorage.png)
1. Enter a number, and click the "store" button
1. Click the "retrieve" button, and verify that the stored number appears!

This contract is quite simple, but it shows the basic flow of Remix - write code, compile it, and deploy it.

## Song Lyrics NFT - Using the Deployment
Now that the basic stuff is out of the way, it's time to get into something a little more interesting.

### Deploying the Contract
There is some starter code for the Song Contract:

<div id="pre-remix-code" style="display: none">
  Note: Changing the code in the JS block below will update the "Click here to open new code" remix link.
</div>

```js
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Data about each song
struct Song {
    string name;
    string lyrics;
}

// Contract
contract SongsContract is ERC721, Ownable {
    // What does it cost to create a new NFT?
    uint256 public mintPrice;

    // Keep track of an ID for each token
    uint256 currentTokenId = 0;

    // Check if minting is currently allowed
    bool public isMintEnabled = false;

    // Our list of songs stored as NFTs
    Song[] public songs;

    // Mapping song IDs to owners - see who owns a given song
    mapping(uint256 => address) public songOwners;

    // Mapping owners to song count - see how many songs someone owns
    mapping(address => uint256) public ownerSongCount;

    // Set the name and symbol of the token
    constructor() payable ERC721("SongMint", "SNG") {
        // Set the price
        mintPrice = 50000 wei;
    }

    // Function to enable and disable minting
    function toggleIsMintEnabled() external onlyOwner {
        isMintEnabled = !isMintEnabled;
    }

    // Function to get the lyrics for a given song name
    function getLyricsForSong(string calldata songName) external view returns(string memory lyrics) {
        // Loop through each song in the list
        for (uint256 i = 0; i < songs.length; i++) {
            // If we found the song we are looking for...
            if (keccak256(abi.encodePacked(songs[i].name)) == keccak256(abi.encodePacked(songName))) {
                // Return the lyrics for the song!
                return songs[i].lyrics;
            }
        }

        // We couldn't find a song with that name :(
        return "No song found";
    }

    // Find all the songs owned by a given address
    function getSongsByOwner(address owner) public view returns(uint256[] memory) {
        // Create a new list
        uint256[] memory result = new uint256[](ownerSongCount[owner]);

        // Setup a counter to keep track of how many songs we have
        uint256 counter = 0;

        // Loop through each song
        for (uint256 i = 0; i < songs.length; i++) {
            // If the owner owns this song...
            if (songOwners[i] == owner) {
                // Add the song ID to the list
                result[counter] = i;

                // Make the counter go up by one
                counter++;
            }
        }

        // Return the list
        return result;
    }

    // Create the NFT based on the song name and song lyrics
    function mint(string calldata songName, string calldata songLyrics) external payable {
        // Check if minting is enabled
        require(isMintEnabled, "minting not enabled");

        // Check if the caller provided the proper amount of currency
        require(msg.value == mintPrice, "wrong value");

        // Make sure a song with this name does not already exist
        require(!songNameExists(songName), "song with that name already exists");

        // Make sure a song with these lyrics does not already exist
        require(!songLyricsExists(songLyrics), "song with those lyrics already exists");

        // Make a new song with the name and lyrics, and add it to our list
        Song memory newSong = Song(songName, songLyrics);
        songs.push(newSong);
        
        // Set the owner of the new song to be the caller
        songOwners[currentTokenId] = msg.sender;
        ownerSongCount[msg.sender]++;

        // Mint the NFT!
        _safeMint(msg.sender, currentTokenId);

        // Update our current token ID for next time
        currentTokenId++;
    }

    // Helper function - check if a song with the given name already exists
    function songNameExists(string calldata songName) private view returns(bool exists) {
        for (uint256 i = 0; i < songs.length; i++) {
            if (keccak256(abi.encodePacked(songs[i].name)) == keccak256(abi.encodePacked(songName))) {
                return true;
            }
        }

        return false;
    }

    // Just a little test

    // Helper function - check if a song with the given lyrics already exists
    function songLyricsExists(string calldata songLyrics) private view returns(bool exists) {
        for (uint256 i = 0; i < songs.length; i++) {
            if (keccak256(abi.encodePacked(songs[i].lyrics)) == keccak256(abi.encodePacked(songLyrics))) {
                return true;
            }
        }

        return false;
    }
}
```

1. <a id="remix-url" target="_blank">Click here to open the new code</a>

## Song Lyrics NFT - Updating the Code

### Adding an Artist

### 