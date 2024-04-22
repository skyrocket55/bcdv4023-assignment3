Assignment #3: Library DApp using Hardhat and ethers deployed to Moonbase

Submitted by: Ciel Recuerdo [101439257]
Submitted On: April 21, 2024 23:30

### Project Setup
1. npm install
2. Add .env file in the root folder and add the following:  MOONBASE_URL, PRIVATE_KEY, REACT_APP_CONTRACT_ADDRESS
3. npx hardhat compile
4. npx hardhat run scripts/deploy.js --network fuji
5. Copy the deployed contract address to .env REACT_APP_CONTRACT_ADDRESS
6. npm run start    http://localhost:3000

### Sample UI Flows

### Features and Fixes
1. Add Book
2. Borrow Book
3. Return Book
4. Updated the contract Library.sol to fetch all the books
5. Form and Contract Validations