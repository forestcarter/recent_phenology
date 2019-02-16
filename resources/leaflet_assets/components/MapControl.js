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
            <div className="form-group row  justify-content-start align-items-center p-1 mx-3">
               
                <div className ="p-3">
                    <label className="style_option">Opacidad</label>
                    <select name='table_option' id='table_optionOpacity' defaultValue="0.6" onChange={this.handleOpacityChange} className='table_option form-control '>
                        <option value="1.0">1.0</option>
                        <option value="0.8">0.8</option>
                        <option value="0.6">0.6</option>
                        <option value="0.4">0.4</option>
                        <option value="0.2">0.2</option>
                    </select>
                </div>
            
            </div>
        
        
        
        </div>
        )
    }
}

export default MapControl;