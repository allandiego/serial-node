import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import Routes from './routes';

// const history = createHashHistory();

const App: React.FC = () => {
  return (
    <>
      <AppProvider>
        <Router>
          <Routes />
        </Router>
      </AppProvider>
      <GlobalStyle />
    </>
  );
};

export default hot(module)(App);
// export default App;
