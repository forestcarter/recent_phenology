import React from "react";

class MapControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleOpacityChange = this.handleOpacityChange.bind(this);
    }

 
    handleOpacityChange(event) {
        this.props.handleOpacityChange(event.target.value);
    }
   
    
    
    render(){
        return(
        <div>               
          <select name='table_option' id='table_optionOpacity' defaultValue="0.6" onChange={this.handleOpacityChange} className='table_option form-control '>
              <option value="1.0">1</option>
              <option value="0.8">.8</option>
              <option value="0.6">.6</option>
              <option value="0.4">.4</option>
              <option value="0.2">.2</option>
          </select>
  
        
        
        
        </div>
        )
    }
}

export default MapControl;