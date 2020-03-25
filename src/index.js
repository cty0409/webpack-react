import React from 'react';
import ReactDom from 'react-dom';
import App from './app/index';
// ReactDOM.render(<SessionPage url="/api/session"/>, document.getElementById("App"));
ReactDom.render(<div>        
        <App />    
    </div>,    
    document.getElementById('app') 
)