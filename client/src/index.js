import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './css/App.css';
import './css/vars.css';
import './css/Sidebar.css';
import './css/Board.css';
import './css/Header.css';
import './css/Stickie.css';
import './css/highlightJS.css';
import './css/AddBtn.css';
import './css/ListStickie.css';
import './css/Spinner.css';
import './css/GoogleLogin.css';
import './css/LogoutBtn.css';
import './css/Login.css';
import './css/SecondaryBtn.css';
import './css/Hamburger.css';
import './css/flexbox.css';
import './css/helpers.css';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
