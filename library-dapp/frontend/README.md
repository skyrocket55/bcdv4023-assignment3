Assignment #3: Library DApp using Hardhat and ethers deployed to Moonbase Alpha

Submitted by: Ciel Recuerdo [101439257]
Submitted On: April 21, 2024 10:00

### TO DOs
1. Fix REACT_APP_CONTRACT_ADDRESS
2. Add Book <DONE> *Updated contract addBook
3. Increase Qty/Copies <>
4. List available books <DONE>
5. Borrow book > Update List available books <DONE>
6. Return book > Update List available books
7. Update contract: (1)getAvailableBooks
8. Add getBorrowedBooks
9. Validations: (1)hasBook, (2)borrowBook, (3)returnBook, (4)addBook, (5)bookMustExist, (6)onlyOwner
10. Enhance UI layout
11. Code Cleaning

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
4. Validations