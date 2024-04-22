Assignment #3: Library DApp using Hardhat and ethers deployed to Moonbase

Submitted by: Ciel Recuerdo [101439257]
Submitted On: April 22, 2024 10:00

### Project Setup using the existing deployed contract. You can borrow a book and return the book using the same metamask account used in borrowing book.
1. npm install
2. Add .env file in the root folder and add the following:  MOONBASE_URL, PRIVATE_KEY, REACT_APP_CONTRACT_ADDRESS
3. REACT_APP_CONTRACT_ADDRESS=0xe0003E2e604A1Fce6D2Ebc5933De49419CA6f80F npm run start    
http://localhost:3000

### To Add Book, compile and deploy a new contract. Otherwise, you will ecnounter a contract error: Contract was not called by the owner.
1. npm install
2. Add .env file in the root folder and add the following:  MOONBASE_URL, PRIVATE_KEY, REACT_APP_CONTRACT_ADDRESS. Removed `0x` in hardhat.config.js as it is working without that.
3. npx hardhat compile
4. npx hardhat run scripts/deploy.js --network moonbase
5. REACT_APP_CONTRACT_ADDRESS=<INSERT DEPLOYED CONTRACT ADDRESS> npm run start    
http://localhost:3000

### Sample UI Flows
1. Using the existing deployed contract
https://www.loom.com/share/95a709c72ac6430cbccfa32e9dca6dcf

2. Deploying a new contract


### Features and Fixes
1. Add Book
2. Borrow Book
3. Return Book
4. Updated the contract Library.sol to fetch all the books including borrowed books
5. Form and Contract Validations