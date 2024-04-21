import React from 'react';
import { BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Dashboard from './components/Dashboard';
import AddBook from './components/AddBook';
import Library from './artifacts/contracts/Library.sol/Library.json';
import { Contract } from 'ethers';
import Navigation from './components/Navigation';
import { ethers } from 'ethers';

function App() {
  const contractAddress = '0x3D91c21b1d9987Fe29deF84105d6b82ad4d24C4C';
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, Library.abi, provider);
  console.log('contractAddress: ', contractAddress);
  console.log('contract: ', contract);

  return (
    <div className='container-fluid'>
      <Router>
        <Navigation/>
        <Routes>
          <Route path="/" element={<Dashboard contract={contract} provider={provider}/>} />
          <Route path="/add-book" element={<AddBook contract={contract} provider={provider}/>} />
          {/* Invalid Path Redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
