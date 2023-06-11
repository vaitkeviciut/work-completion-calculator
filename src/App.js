import { Route, Routes, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/work-completion-calculator' element={<MainPage />} />

        <Route path='*' element={
          <div>
            <div className='hero-box-wrapper'>
              <div className='hero-box-content-wrapper'>
                <Link className='get-started-link' to='/'>Lets get started</Link>
              </div>
            </div>
            
          </div>
        } />

      </Routes>
    </div>
  );
}

export default App;
