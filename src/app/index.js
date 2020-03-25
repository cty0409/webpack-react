import React from 'react';
import './style.less'

export default class App extends React.Component {
    constructor(props) { 
        super(props);        
        this.state = {            
            data: 'hello'        
        }   
    }    
render() {
        return (
            <div> 
                <span>1111111111</span>
               <p className='site_page_header'> 
                   {this.state.data} 
               </p> 
           </div>        
        )    
}}