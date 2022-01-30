import React from 'react'
import './App.css';
import D3Map from './components/D3Map'
import Header from './components/Header'

/**
 * This function intitializes the app.
 * @returns {object} - React component
 */
function App() {
  return (
    <div className="App">
      <Header/>
      <D3Map/>
    </div>
  );
}

export default App;
