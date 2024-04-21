import React, { useState, useEffect } from 'react';
import { Button, Form, Card, CardHeader, CardBody, Alert } from 'react-bootstrap';
import { ethers } from 'ethers';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';

export default function AddBook({contract, provider}) {
    // Use the state hook to manage component state
    const [quantity, setQuantity] = useState(1);
    const [listOfAvailableBooks, setListOfAvailableBooks] = useState([]);
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
            const contractSigner = contract.connect(provider.getSigner());
            const bookAdded = await contractSigner.addBook(book.title, book.quantity);
            await bookAdded.wait();

            console.log('bookAdded: ', bookAdded);
            if(bookAdded.hash) {
                // reset the form fields
                setBook({title: '', quantity: ''});

                setShowSuccess(true);
                setLoading(false);
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
        <div className='col-md-4'>
            <Alert className='mt-2' variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>
                    Book successfully added!
            </Alert>
            <Card className='mt-3'>
              <CardHeader>
                <Header title="Add Book" margin="ml-2" icon={faBook} size="xs"/>
              </CardHeader>
              <CardBody className='text-center justify-content-center'>
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
                            readOnly={ actionSelected==='updateButton' }
                        />
        
                        <Form.Label>Quantity</Form.Label>
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

                    <Alert className='mt-2' variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                        Please fill out all the required fields.
                    </Alert>
                </div>
                <Button variant='outline-success' id='addButton' onClick={() => handleAddBook(book)}>
                  Submit
                </Button>
                { loading ? (
                    <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                    </div>
                ) : 
                ( 
                    <div style={{ height: '20px' }}></div>
                )}
              </CardBody>
          </Card>
        </div>
      )
}