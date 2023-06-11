import { Route, Routes, Link } from 'react-router-dom';
import MainPage from './components/MainPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<MainPage />} />

        <Route path='*' element={
          <div>
            <div className='hero-box-wrapper'>
              <div className='hero-box-content-wrapper'>
                <h1 className='hero-box-title'>JSON.API...</h1>
                <Link className='get-started-link' to='/'>Lets het started</Link>
              </div>
            </div>
            
          </div>
        } />

      </Routes>
    </div>
  );
}

export default App;
