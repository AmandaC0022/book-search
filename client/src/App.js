import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

import { setContext } from '@apollo/client/link/context'; 

//Components 
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//create our API endpoint 
const httpLink = createHttpLink({
  uri: '/graphql', 
}); 

const authLink = setContext((_, { headers }) => {
  //grab token from localstorage 
  const token = localStorage.getItem('id_token'); 

  return {
    headers: {
      ...headers,
      authorization: token ? `Owner ${token}` : '', 
    }
  };
});

//create our new Apollo Client which uses the auth middleware before calling to our API endpoint 
const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(), 
}); 

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <Navbar />
        <Switch>
          <Route exact path='/'>
            <SearchBooks /> 
          </Route>
          <Route exact path='/saved'>
            <SavedBooks /> 
          </Route>
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
    </Router>
    </ApolloProvider>
  );
}

export default App;
