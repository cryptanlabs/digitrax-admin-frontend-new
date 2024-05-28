import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';

console.stdlog = console.log.bind(console);
console.stderr = console.error.bind(console);
console.logs = [];
console.log = function(){
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
}
console.error = function(){
  const errorLog = [...Array.from(arguments), "ERROR_LOG"]
  console.logs.push(errorLog);
  console.stderr.apply(console, arguments);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <App />
    </Router>
  </React.StrictMode>,
)
