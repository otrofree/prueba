import logo from './logo.svg';
import './App.css';

import { withApollo } from '@apollo/react-hoc';    

import React, { Fragment, useState, useCallback } from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';

// los componentes de Bulma, 
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Navbar, Form, Modal, Section, Container, Notification, Media, Image, Content, Level,
		Columns, Table } from 'react-bulma-components';

const { Input, Field, Control, Label } = Form;

 
const ALLBOOK = gql`
   query {
	allBook {
      libroId
      titulo
      autor
      editorial
	  sinopsis
	  edicion
    }
   }
 `;
 
const NEWBORROW =gql`
	 mutation newBorrow($usuarioId: Int!, $libroId: Int!) {
	  newBorrow(libroId: $libroId, usuarioId: $usuarioId) {
		prestamoId
	  }
	 }
 `;
 
var Libros = withApollo((props) =>{
	// los datos de todos los libros
	const { loading, error, data, refetch } = useQuery(ALLBOOK); 
		
	function solicita(i) {
		// hago la llamada a GrapQL para solicitar el prestamo	
		props.client
		  .query({
			query: NEWBORROW,
			variables: {libroId: data.allBook[i].libroId, usuarioId: props.usuarioId }
		  })
		  .then(result => {	
				// veo si hay errores
				if(result.errors !== undefined) {
					// debe lanzar la ventana modal de error
					console.log("error",result.errors[0].message);
				} else {
					// actualizo la tabla			
					refetch();					
					props.updatePrestamo();
				}
			}
			);		  
	}
		
	return (
		<React.Fragment>
			<h1 class="title">Libros existentes</h1>

			<Section>	
			  <Table>
				<thead>
				  <tr>	
					<th>Titulo</th>
					<th>Autor</th>
					<th>Editorial</th>
					<th>Sinopsis</th>
					<th>Edicion</th>
				  </tr>
				 </thead>
				 <tbody>
				  {data && data.allBook.map(function(e,i) {
					return <tr key={i}><td>{e.titulo}</td><td>{e.autor}</td><td>{e.editorial}</td>
							<td>{e.sinopsis}</td><td>{e.edicion}</td>
							<td>
								<span className="icon">
									<i onClick={() => {solicita(i) }} className="fa fa-book"></i>
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


export default Libros;