import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Dashboard from './components/Dashboard';
import AddBook from './components/AddBook';
import Navigation from './components/Navigation';
import BorrowedBooks from './components/BorrowedBooks';

function App() {
  return (
    <div className='container-fluid'>
      <Router>
        <Navigation/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/add-book" element={<AddBook/>} />
          <Route path="/borrowed-books" element={<BorrowedBooks/>} />
          {/* Invalid Path Redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
