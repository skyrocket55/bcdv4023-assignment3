// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Ownable {
    address public owner;

    modifier onlyOwner() {
        require(owner == msg.sender, "Contract was not called by the owner.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
}

contract Library is Ownable {

    struct Book {
        string title;
        uint copies;
        address[] borrowers;
    }

    Book[] private books;

    struct AvailableBook {
        uint id;
        string title;
    }

    // Events
    event NewBookAdded(uint id, string title);
    event NewCopiesAdded(uint id, uint copies);
    event BookBorrowed(uint indexed id, address borrower);
    event BookReturned(uint id, address borrower);

    // Modifier
    modifier bookMustExist(uint _id) {
        require(books.length>0, "The library has no books currently.");
        require(_id <= books.length - 1, "Book with this ID does not exist the collection.");
        _;
    }

    function addBook(string calldata _title, uint _copies) public onlyOwner {
        require(_copies > 0, "Add at least one copy of the book.");
        for(uint i=0; i<books.length; i++) {
            if(keccak256(abi.encodePacked(books[i].title)) == keccak256(abi.encodePacked(_title))) {
                // check if the book already exists in the Library
                // If it does then increase the number of copies
                books[i].copies = books[i].copies + _copies;
                emit NewCopiesAdded(i, _copies);
                return;
            }
        }

        // if the book currently does not exist in the collection then add it
        books.push();
        books[books.length - 1].title = _title;
        books[books.length -1].copies = _copies;
        emit NewBookAdded(books.length-1, _title);
    }

    function getAvailableBooks() public view returns (AvailableBook[] memory) {
        // retrieve the number of available book titles
        uint counter = 0;
        for(uint i=0; i<books.length; i++) {
            if(books[i].copies - books[i].borrowers.length > 0) {
                counter++;
            }
        }
        //retrieve available books
        AvailableBook[] memory availableBooks = new AvailableBook[] (counter);
        counter = 0;
        for(uint i=0; i<books.length; i++) {
            if(books[i].copies - books[i].borrowers.length > 0) {
               availableBooks[counter] = AvailableBook(i, books[i].title);
               counter++; 
            }
        }
        return availableBooks;
    }

    function hasBook(uint _id, address _user) private view returns (bool) {
        for(uint i=0; i<books[_id].borrowers.length; i++) {
            if(_user == books[_id].borrowers[i]) {
                return true;
            }
        }
        return false;
    }

    function borrowBook(uint _id) public bookMustExist(_id) {
        require(hasBook(_id, msg.sender) == false, "Book must be returned before it can be borrowed again.");
        require(books[_id].copies - books[_id].borrowers.length > 0, "There are no copies of the book currently available.");

        // Borrow the book
        books[_id].borrowers.push(msg.sender);
        emit BookBorrowed(_id, msg.sender);
    }

    function returnBook(uint _id) public bookMustExist(_id) {
        require(hasBook(_id, msg.sender) == true, "You do not have this book out on loan.");

        for(uint i=0; i<books[_id].borrowers.length; i++) {
            if(msg.sender == books[_id].borrowers[i]) {
                removeIndexFromAddressArray(books[_id].borrowers, i);
                emit BookReturned((_id), msg.sender);
                return;
            }
        }
    }

    function removeIndexFromAddressArray(address[] storage _array, uint _index) private  {
        _array[_index] = _array[_array.length - 1];
        _array.pop();
    }
}