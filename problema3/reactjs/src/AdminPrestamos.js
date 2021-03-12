import logo from './logo.svg';
import './App.css';

import { withApollo } from '@apollo/react-hoc';    

import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';

// los componentes de Bulma, 
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Navbar, Form, Modal, Section, Container, Notification, Media, Image, Content, Level,
		Columns, Table } from 'react-bulma-components';

const { Input, Field, Control, Label } = Form;

 
const ALLBORROW =gql`
	query AllBorrow($estado:Int!){
		allBorrow(estado:$estado){
			prestamoId
			estado
			libro {
				titulo
			}
		  }
	}
 `;
 
 const CONFIRMBORROW =gql`
	 mutation ConfirmBorrow($prestamoId:Int!){
		confirmBorrow(prestamoId:$prestamoId){
			msg
		  }
	}
 `;

 const RETURNBORROW =gql`
	 mutation ReturnBorrow($prestamoId:Int!){
		returnBorrow(prestamoId:$prestamoId){
			msg
		  }
	}
 `; 
 
const estados={'0':"Pendiente", '1':'Aprobado', '2':"Regresado"}
 
var Prestamos = withApollo((props) =>{
	const [edoShow, setEdoShow] = useState(-1);
	// los datos de todos mis prestamos
	const { loading, error, data, refetch } = useQuery(ALLBORROW, 
													{variables: { estado: edoShow }}); 

	const handleAddrTypeChange = (e) => {
		setEdoShow(parseInt(e.target.value))
		// actualizo la consulta
		refetch();
	}

	function procesa(e) {
		switch(e.estado) {
			case 0: // esta pendiente de aprobar
				aprueba(e.prestamoId);
				break;
			case 1: // esta aprobada
				regreso(e.prestamoId);
				break;
			default:
				break;
		}
	}
	
	function aprueba(id) {
		// hago la llamada a GrapQL para solicitar el prestamo	
		props.client
		  .query({
			query: CONFIRMBORROW,
			variables: {prestamoId: id }
		  })
		  .then(result => {	
				// veo si hay errores
				if(result.errors !== undefined) {
					// debe lanzar la ventana modal de error
					console.log("error",result.errors[0].message);
				} else {
					// actualizo la tabla			
					refetch();
				}
			}
			);		  
	}	
	
	function regreso(id) {
		// hago la llamada a GrapQL para solicitar el prestamo	
		props.client
		  .query({
			query: RETURNBORROW,
			variables: {prestamoId: id }
		  })
		  .then(result => {	
				// veo si hay errores
				if(result.errors !== undefined) {
					// debe lanzar la ventana modal de error
					console.log("error",result.errors[0].message);
				} else {
					// actualizo la tabla			
					refetch();
				}
			}
			);		  
	}	
	
	function retIcon(edo) {
		switch(edo) {
			case 0:
				return "fa fa-check";
			case 1:
				return "fa fa-undo";
		}
	}
	
	return (
		<React.Fragment>
			<h1 className="title"> Prestamos {props.update}</h1>
			<div className="select is-primary">
			  <select onChange={e => handleAddrTypeChange(e)} >
				<option selected value="0">Pendientes</option>
				<option value="1">Aprobados</option>
				<option value="2">Regresados</option>
			  </select>
			</div>
				
			<Section>	
			  <Table>
				<thead>
				  <tr>	
					<th>Titulo</th>
					<th>Edo. Prestamo</th>
				  </tr>
				 </thead>
				 <tbody>
				  {data && data.allBorrow.map(function(e,i) {
					return <tr key={i}><td>{e.libro.titulo}</td><td>{estados[e.estado]}</td>
							<td>
								<span className="icon">
									<i onClick={() => {procesa(e) }} className={retIcon(e.estado)}></i>
								</span>
							</td>
							</tr>
					})					
				  }				  
				 </tbody>
			  </Table>

			</Section>
		</React.Fragment>
	);
})


export default Prestamos;