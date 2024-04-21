import React, { useState, useEffect } from 'react';
import { Button, Form, Card, CardHeader, CardBody, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { ethers } from 'ethers';

export default function Dashboard({contract, provider}) {
    // Use the state hook to manage list of Transactions
    const [listOfAvailableBooks, setListOfAvailableBooks] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        const fetchAvailableBooks = async() => {
            try {
                const booksList = await contract.getAvailableBooks();
                console.log('fetchAvailableBooks: ', booksList);
                setListOfAvailableBooks(booksList);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        
        fetchAvailableBooks();
    }, [contract, provider]); // dependency array to re-run effect when contract or provider changes

    const handleBorrowedBook = async(bookId) => {
        try {
            console.log('handleBorrowBook: ', bookId);
            const contractSigner = contract.connect(provider.getSigner());
            const borrowedBook = await contractSigner.borrowBook(bookId);
            console.log('borrowedBook: ', borrowedBook);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="row mt-3">
                <div className="col-md-6 mb-3">
                    <div className="card border-info ">
                        <div className="card-body">
                            <h5 className="card-title">Available Books</h5>

                            {/* Nested Child Card */}
                            <div className="card">
                                <div className="card-body">
                                    {listOfAvailableBooks.length > 0 ? (
                                        listOfAvailableBooks.map((book, index) => (
                                            <React.Fragment key={index}>
                                                <div className='row text-truncate'>
                                                    <div className='col-md-4 mb-1 col-12'>
                                                        <FontAwesomeIcon icon={faBook} size='2x'/> &nbsp;
                                                    </div>
                                                    <div className='col-md-4 mb-1 col-12'>
                                                        <p className="text-primary">{book.title}</p> 
                                                    </div>
                                                    <div className='col-md-4 mb-1 col-12'>
                                                        <Button variant='outline-success' id='addButton' onClick={() => handleBorrowedBook(index)}>
                                                            Borrow
                                                        </Button>
                                                    </div>
                                                </div>
                                                {index===(listOfAvailableBooks.length-1) ? <></> : <hr className="hr" />}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                    <div>
                                        No books available
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-center justify-content-center">
                            <a href="/transactions" className="link-primary" style={{ textDecoration: 'none' }}>
                                View All Transactions
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-info ">
                        <div className="card-body">
                            <h5 className="card-title">Borrowed Books</h5>

                            {/* Nested Child Card */}
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        {listOfAvailableBooks.length > 0 ? (
                                            listOfAvailableBooks.map((book, index) => (
                                                <React.Fragment key={index}>
                                                    <div className='row text-truncate'>
                                                        <div className='col-md-4 mb-1 col-12'>
                                                            <FontAwesomeIcon icon={faBook} size='xl'/> &nbsp;
                                                            Title
                                                            <p className="text-primary">{book.title}</p> 
                                                        </div>
                                                        <div className='col-md-4 mb-1 col-12'>
                                                            To 
                                                            {/* <p className="text-primary">{transaction.destination.slice(0, 15)}...</p>  */}
                                                        </div>
                                                        <div className='col-md-4 mb-1 col-12'>
                                                            Timestamp
                                                            {/* <p className="text-secondary">{formatTimestamp(transaction.createdAt)}</p>  */}
                                                        </div>
                                                    </div>
                                                    {index===(listOfAvailableBooks.length-1) ? <></> : <hr className="hr" />}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                        <div>
                                            No books available
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-center justify-content-center">
                            <a href="/blocks" className="link-primary" style={{ textDecoration: 'none' }}>
                                View Blocks
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}