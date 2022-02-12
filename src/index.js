import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import { Provider } from './Context';
import App from './App';
import {StateProvider} from "./ContextApi/StateProvider";
import {initialState, reducer} from "./ContextApi/reducer";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);