import React, { Component } from 'react';
import Layout from './components/hoc/Layout/Layout';
import BurgerBuilder from '../src/components/containers/BurgerBuilder/BugerBuilder';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <BurgerBuilder/>
        </Layout>
      </div>
    );
  }
}

export default App;
