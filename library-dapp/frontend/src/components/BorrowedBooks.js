import React, { useState, useEffect } from 'react';
import { Button, Table, Card, CardBody, CardFooter, Alert } from 'react-bootstrap';
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { ethers } from 'ethers';
import Library from '../artifacts/contracts/Library.sol/Library.json';

export default function BorrowedBooks() {
    // Use the state hook to manage list of Transactions
    const [listOfBorrowedBooks, setListOfBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessReturned, setShowSuccessReturned] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, Library.abi, provider);
    
    const fetchAllBooks = async() => {
        try {
            const allBooksAddedList = await contract.getAllBooks();
            if(allBooksAddedList.length>0) {
                const allBorrowedBooks = allBooksAddedList
                .map((book, index) => {
                    const borrowedCopies = book.borrowers.length;
                    const availableCopies = book.copies.toNumber() - borrowedCopies;
                    
                    return {
                        id: index,
                        title: book.title,
                        copies: book.copies.toNumber(),
                        availableCopies: availableCopies,
                        borrowers: book.borrowers.map(hex => shortenAddress(hex))
                    };
                })
                .filter(book => book.borrowers.length>0); // filter books with borrowers to show borrowed books
                
                setListOfBorrowedBooks(allBorrowedBooks);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllBooks();
    }, []); // dependency array to re-run effect

    const handleReturnBook = async(bookId) => {
        try {
            setLoading(true);
            const contractSigner = contract.connect(provider.getSigner());
            const returedBook = await contractSigner.returnBook(bookId);
            
            // Refresh available books after borrowing
            if(returedBook.hash) {
                await fetchAllBooks();
            }

            // Update available books after a delay as fetching the updated list from the chain is taking max 35 seconds
            setTimeout(async () => {
                // Refresh the list
                const updatedBookList = listOfBorrowedBooks.filter(async (book) => {
                    if(book.borrowers.length==0) { 
                        return book.id !== bookId; // remove in the list if no more borrowers
                    } else {
                        await fetchAllBooks(); // get the updated list
                    }
                });
                setListOfBorrowedBooks(updatedBookList);
                
                setLoading(false);
                setShowSuccessReturned(true);
            }, 35000);
        } catch (error) {
            setLoading(false);
            console.error(error);            
            if (error.data && error.data.message) {
                setErrorMessage(error.data.message);
                setShowAlert(true);
            }
        }
    }

    const shortenAddress = (arrAddress) => {
        // Check if arrAddress is an array
        if (!Array.isArray(arrAddress)) {
            return `${arrAddress.slice(0, 15)}...${arrAddress.slice(-5)}`;
        }

        return arrAddress.map(hex => `${hex.slice(0, 15)}...${hex.slice(-5)}`);
    }

    return (
        <div>
            <div className="row mt-3">
                <div className="col-md-8 mx-auto">
                    <div className="card border-info ">
                        <div className="card-body">
                            <div className="card-title">
                                <Header title="Borrowed Books" margin="ml-2" icon={faBookBookmark} size="xs"/>
                            </div>      
                            {/* Nested Child Card */}
                            <Card>
                                <CardBody>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr className='text-center'>
                                                <th scope='col'>Title</th>
                                                <th scope='col'>Available Copies</th>
                                                <th scope='col'>Borrowers</th>
                                                <th scope='col'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listOfBorrowedBooks.length > 0 ? (
                                                listOfBorrowedBooks.map((book, index) => {
                                                    return (
                                                    <tr key={index} className='text-center'>
                                                        <>
                                                            <td width='30%'>{book.title}</td>
                                                            <td width='10%'>{book.availableCopies}</td>
                                                            {book.borrowers.length > 1 ? (
                                                                <td width='40%'>
                                                                    {book.borrowers.map((borrower, i) => (
                                                                        <div key={i}>{borrower}</div>
                                                                    ))}
                                                                </td>
                                                                ) : (
                                                                <td width='40%'>{book.borrowers[0]}</td>
                                                            )}
                                                            <td width='30%'>
                                                                <Button variant='outline-primary' onClick={() => handleReturnBook(book.id)} disabled={loading}>
                                                                    Return
                                                                </Button>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    )
                                                })  
                                                ): (
                                                <tr className='text-center'>
                                                    <td colSpan="6">No books available</td>
                                                </tr>
                                                )}
                                                
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <Alert className='mt-2' variant="success" show={showSuccessReturned} onClose={() => setShowSuccessReturned(false)} dismissible>
                                            Book has been returned!
                                    </Alert>
                                    <Alert className='mt-2' variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                                        {errorMessage}
                                    </Alert>
                                    { loading ? (
                                        <div className='spinner-border text-primary' role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                        </div>
                                    ) : 
                                    ( 
                                        <div style={{ height: '20px' }}></div>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}