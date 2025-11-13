import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;