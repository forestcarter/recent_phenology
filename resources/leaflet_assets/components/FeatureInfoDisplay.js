import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class FeatureInfoDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    

    render(){
        const allTableRows=[];
        if(this.props.featureInfo.properties.displayName=='Linea MTP' || this.props.featureInfo.properties.displayName=='Unidad de Paisaje'){
            
            let lifeForms= ['arbol','arbusto','hierba', 'ave', 'herpetofauna','mamifero','Dato acumulado']
            let mya2=['total_observaciones','distinct_species','dominancia','shannon']
            let myIcons={'ave':'🦅','arbol':'🌲','arbusto':'🌳','hierba':'🌱','herpetofauna':'🐍','mamifero':'🦌'}
            
            lifeForms.map((life)=>{
                let oneTableRow={}
                oneTableRow['name']=(life=='herpetofauna')?'herpetofauna':life
                oneTableRow['name']=(life=='Dato acumulado') ? oneTableRow['name']:myIcons[life] + oneTableRow['name']
                

                mya2.map((category,ind)=>{
                    if (life=='Dato acumulado'){
                        let mysum= +this.props.featureInfo.properties[`${category}_ave`] + +this.props.featureInfo.properties[`${category}_hierba`] + +this.props.featureInfo.properties[`${category}_arbusto`] + +this.props.featureInfo.properties[`${category}_arbol`] + +this.props.featureInfo.properties[`${category}_herpetofauna`] + +this.props.featureInfo.properties[`${category}_mamifero`]                                
                        if (ind>1) mysum=(mysum/6).toPrecision(4)
                        oneTableRow[category]=mysum
                    }else{
                        let newCat=category.replace(`_${life}`,'')
                        let myValue=  ind>1 ? (+this.props.featureInfo.properties[`${category}_${life}`]).toPrecision(4):this.props.featureInfo.properties[`${category}_${life}`]
                        oneTableRow[newCat]=myValue
                    }
                })
                allTableRows.push(oneTableRow)
            })
        }
        const columns = [{
            dataField: 'name',
            text: 'Nombre',
            headerStyle: {
                width: '128px'
              }
            },{
            dataField: 'total_observaciones',
            text: 'Individuos'
            }, {
            dataField: 'distinct_species',
            text: 'Especies Distintas'
            }, {
            dataField: 'dominancia',
            text: 'Dominancia',
            classes: 'testme' 
            }, {
            dataField: 'shannon',
            headerStyle: {
                width: '62px'
              },
            text: 'Shannon'
            }];

        return(
            
        <div>
            <div className="container">
                <div className='flex-column d-flex justify-content-around align-items-center p-3'>
                    <div>
                        Ultimo Click:
                    </div>
                    <div>
                        lat: {this.props.markerPosition.lat.toPrecision(7)}, lng: {this.props.markerPosition.lng.toPrecision(7)}
                    </div>
                    <div>
                        {this.props.featureInfo.properties.displayName} = {this.props.featureInfo.properties[this.props.featureInfo.properties.featureColumn]}
                    </div>
                </div>
            </div>

                <BootstrapTable 
                    keyField='name' 
                    data={ allTableRows } 
                    columns={ columns } 
                    bordered={ true }
                    classes={ 'featureInfoTable' }
                    striped
                    hover
                    condensed
                    noDataIndication={ 'No hay datos' }
                />
        </div>
        )
    }
}

export default FeatureInfoDisplay;