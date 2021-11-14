import React from 'react'
import './App.css';
// import MainPage from './components/MainPage'
import D3Map from './components/D3Map'
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Header/>
      <D3Map/>
    </div>
  );
}

export default App;
