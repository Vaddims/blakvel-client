import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import './app.scss';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import CatalogPage from './pages/catalog';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path='auth'>
            <Route path='login' element={<LoginPage />} />
            <Route path='signup' element={<SignupPage />} />
          </Route>
          <Route path='products' element={<CatalogPage />}>
            <Route path=':id' />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
