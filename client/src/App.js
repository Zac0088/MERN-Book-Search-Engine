import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
// import Switch from 'react-bootstrap/esm/Switch';

const client = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
         authorization: token ? ` Bearer ${token}` : ''
    }
  })
  },
  uri: '/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<SearchBooks/> }/>
          <Route exact path='/saved' element={<SavedBooks/>}/>
          <Route render={() => <h1 element='display-2'>Wrong page!</h1>} />
        </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
