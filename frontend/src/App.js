import { BrowserRouter } from 'react-router-dom';
import './App.css';
import NavBar from './components/navbar/NavBar';
import { Router } from './Router/Router';

function App() {
  
  return (
    <BrowserRouter>
      <NavBar />
      <Router />
    </BrowserRouter>
  )
}

export default App