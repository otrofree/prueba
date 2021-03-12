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

 
const MYBORROW =gql`
	 query MyBorrow($usuarioId:Int!){
	  myBorrow(usuarioId:$usuarioId)  {
		libro { titulo }
		estado
	  }
	}
 `;
 
const estados={'0':"Pendiente", '1':'Aprobado', '2':"Regresado"}
 
var Prestamos = withApollo((props) =>{
	// los datos de todos mis prestamos
	const { loading, error, data, refetch } = useQuery(MYBORROW, 
													{variables: { usuarioId: props.usuarioId }}); 
	var itemAct=0;												
													
	useEffect(() => {
		// veo si estan forzano una actualización
		if(itemAct != props.update) {
			itemAct = props.update;
			// actualizo la tabla
			refetch();
		}
	});
	
	return (
		<React.Fragment>
			<h1 class="title">Mis prestamos</h1>

			<Section>	
			  <Table>
				<thead>
				  <tr>	
					<th>Titulo</th>
					<th>Edo. Prestamo</th>
				  </tr>
				 </thead>
				 <tbody>
				  {data && data.myBorrow.map(function(e,i) {
					return <tr key={i}><td>{e.libro.titulo}</td><td>{estados[e.estado]}</td></tr>
					})					
				  }				  
				 </tbody>
			  </Table>

			</Section>
		</React.Fragment>
	);
})


export default Prestamos;