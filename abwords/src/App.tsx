import React from 'react';
import './App.css';
import { StartPage } from './Pages/StartPage/StartPage';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Components/Layout/Layout';
import { Dashboard } from './Pages/Dashboard/Dashboard';
import { EditBlog } from './Pages/EditBlog/EditBlog';
import { ThemeProvider } from '@mui/material';
import store, {persistor} from './Store/store'

import { Provider } from 'react-redux';
import { WordMemPage } from './Pages/WordMemPage/WordMemPage';
import { PersistGate} from 'redux-persist/integration/react'
import { SignupPage } from './Pages/SignupPage/SignupPage';
import { theme } from './theme';
import About from './Components/About/About';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>

            <Routes >
              <Route path="/" element={<Layout />}>

                <Route path="/" element={<StartPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/:id" element={<EditBlog isNew={false} />} />
                <Route path="/dashboard/new" element={<EditBlog isNew={true} />} />
                <Route path="/memory/" element={<WordMemPage />} />
                <Route path="/about/" element={<About />} />
                <Route path="/signup/" element={<SignupPage />} />
              </Route>
            </Routes>

          </ThemeProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
