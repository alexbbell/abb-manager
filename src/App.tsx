import React from 'react';
import './App.css';
import { StartPage } from './Pages/StartPage/StartPage';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path="/" element={<Layout />}>

        <Route path="/" element={<StartPage />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
