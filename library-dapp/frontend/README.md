Assignment #3: Library DApp using Hardhat and ethers deployed to Moonbase

Submitted by: Ciel Recuerdo [101439257]
Submitted On: April 21, 2024 23:30

### TO DOs
1. Fix REACT_APP_CONTRACT_ADDRESS
2. Add Book <DONE>
3. List borrowed books <DONE>
4. List available books <DONE>
5. Borrow book > Update List available books <DONE>
6. Return book > Update List available books <DONE>
7. Update contract: (1)getAllBooks <DONE>
8. Validations <DONE>
9. Enhance UI layout <>
10. Code Cleaning <>

### Project Setup
1. npm install
2. Add .env file in the root folder and add the following:  MOONBASE_URL, PRIVATE_KEY, REACT_APP_CONTRACT_ADDRESS
3. npx hardhat compile
4. npx hardhat run scripts/deploy.js --network moonbase
5. Copy the deployed contract address to .env REACT_APP_CONTRACT_ADDRESS
6. npm run start    http://localhost:3000

### Sample UI Flows

### Features and Enhancements
1. Add Book
2. Borrow Book
3. Return Book
4. List of Available and Borrowed Books
5. Form and Contract Validations