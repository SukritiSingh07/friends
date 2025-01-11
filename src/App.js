import './App.css';
import Auth from './Components/Auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
