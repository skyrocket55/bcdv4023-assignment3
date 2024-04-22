import React, { useState, useEffect } from 'react';
import { Button, Form, Card, CardHeader, CardBody, Alert, CardFooter } from 'react-bootstrap';
import { ethers } from 'ethers';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Library from '../artifacts/contracts/Library.sol/Library.json';

export default function AddBook() {
    // Use the state hook to manage component state
    const [quantity, setQuantity] = useState(1);
    const [book, setBook] = useState({title: '', quantity: ''});
    const [actionSelected, setAction] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // handle adding of book in the contract
    const handleAddBook = async () => {
        // form validation
        if(!book.title || !book.quantity) {
            setShowAlert(true);
            return;
        }

        setLoading(true); //loading spinner
        try {
            const contractAddress = '0xe0003E2e604A1Fce6D2Ebc5933De49419CA6f80F';
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, Library.abi, provider);
            const contractSigner = contract.connect(provider.getSigner());
            const bookAdded = await contractSigner.addBook(book.title, book.quantity);
            await bookAdded.wait();

            console.log('bookAdded: ', bookAdded);
            if(bookAdded.hash) {
                // Update available books after a delay as fetching Available Books list from the chain is taking 20 seconds
                setTimeout(async () => {
                    // reset the form fields
                    setBook({title: '', quantity: ''});
                    setShowSuccess(true);
                    setLoading(false);
                }, 20000); // 20 seconds delay
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // handle form change
    const handleChange = (event) => {
        let { name, value } = event.target;

        //ensure qty is always positive integer
        if(name==='quantity') {
            const newQuantity = Math.max(1, parseInt(event.target.value) || 1);
            value = newQuantity;
        }
        console.log('handleChange: ', name, value);
        setBook({
        ...book,
        [name]: value
        });
    }

    const handleIncrement = () => {
        setQuantity(quantity + 1);
      };
    
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className='col-md-6 mx-auto'>
            <Card className='mt-3'>
              <CardHeader>
                <Header title="Add Book" margin="ml-2" icon={faBook} size="xs"/>
              </CardHeader>
              <CardBody>
                <div className='col'>
                    <Form>
                        <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Book Title"
                            name="title"
                            value={book.title}
                            onChange={handleChange}
                            required
                        />
        
                        <Form.Label className="mt-2">Quantity</Form.Label>
                        <div className="d-flex align-items-center">
                            <Button variant="outline-primary" onClick={handleDecrement}>-</Button>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={book.quantity}
                                onChange={handleChange}
                                style={{ width: '70px', textAlign: 'center' }}
                            />
                            <Button variant="outline-primary" onClick={handleIncrement}>+</Button>
                        </div>
                        </Form.Group>
                    </Form>

                    <Alert className='mt-2' variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>
                            Book successfully added!
                    </Alert>
                    <Alert className='mt-2' variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                        Please fill out all the required fields.
                    </Alert>
                </div>
              </CardBody>
              <CardFooter>
                    { loading ? (
                        <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                        </div>
                    ) : 
                    ( 
                        <div className='d-flex justify-content-center'>
                            <Button variant='outline-success' id='addButton' onClick={() => handleAddBook(book)}>
                                Submit
                            </Button>
                        </div>
                    )}
              </CardFooter>
          </Card>
        </div>
      )
}