import React, { useState, useEffect } from 'react';
import { Button, Table, Card, CardBody, CardFooter, Alert } from 'react-bootstrap';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { ethers } from 'ethers';
import Library from '../artifacts/contracts/Library.sol/Library.json';

export default function Dashboard() {
    // Use the state hook to manage list of Transactions
    const [listOfAvailableBooks, setListOfAvailableBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessBorrowed, setShowSuccessBorrowed] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, Library.abi, provider);

    const fetchAvailableBooks = async() => {
        try {
            const availableBooksList = await contract.getAvailableBooks();
            
            if(availableBooksList.length>0) {
                const availableBooks = availableBooksList.map(book => ({
                    id: book.id.toNumber(), // Convert BigNumber to integer: e.g. BigNumber _hex : "0x02"
                    title: book.title
                }));
                setListOfAvailableBooks(availableBooks);
            }
        } catch (error) {
            console.error(error);
            if (error.data && error.data.message) {
                setErrorMessage(error.data.message);
                setShowAlert(true);
            }
        }
    }

    useEffect(() => {
        fetchAvailableBooks();

    }, []); // dependency array to re-run effect

    const handleBorrowBook = async(bookId) => {
        try {
            setLoading(true);
            const contractSigner = contract.connect(provider.getSigner());
            const borrowedBook = await contractSigner.borrowBook(bookId);
            
            // Refresh available books after getting the transaction hash
            if(borrowedBook.hash) {
                await fetchAvailableBooks();
            }
            
            // Update available books after a delay as fetching the updated list from the chain is taking max 35 seconds
            setTimeout(async () => {
                // Refresh the list
                const updatedBookList = listOfAvailableBooks.filter((book) => book.id !== bookId);
                setListOfAvailableBooks(updatedBookList);
                
                setLoading(false);
                setShowSuccessBorrowed(true);
            }, 35000);
        } catch (error) {
            console.error(error);
            setLoading(false);
            if (error.data && error.data.message) {
                setErrorMessage(error.data.message);
                setShowAlert(true);
            }
        }
    };

    return (
        <div>
            <div className="row mt-3">
                <div className="col-md-8 mx-auto">
                    <div className="card border-info ">
                        <div className="card-body">
                            <div className="card-title">
                                 <Header title="Available Books" margin="ml-2" icon={faBookOpen} size="xs"/>
                            </div>
                            {/* Nested Child Card */}
                            <Card>          
                                <CardBody>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr className='text-center'>
                                                <th scope='col'>Title</th>
                                                <th scope='col'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listOfAvailableBooks.length > 0 ? (
                                                listOfAvailableBooks.map((book, index) => {
                                                    return (
                                                    <tr key={index} className='text-center'>
                                                        <>
                                                            <td width='70%'>{book.title}</td>
                                                            <td width='30%'>
                                                                <Button variant='outline-primary' onClick={() => handleBorrowBook(book.id)} disabled={loading}>
                                                                    Borrow
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
                                    <Alert className='mt-2' variant="success" show={showSuccessBorrowed} onClose={() => setShowSuccessBorrowed(false)} dismissible>
                                            Book has been borrowed!
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