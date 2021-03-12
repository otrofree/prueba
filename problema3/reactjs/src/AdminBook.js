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

 
 const EDITBOOK =gql`
	 mutation EditBook($titulo: String, $autor: String, $editorial: String, $sinopsis: String,$edicion: String, $libroId: Int!) {
	  editBook(libroId: $libroId, titulo: $titulo, autor: $autor, editorial: $editorial, sinopsis: $sinopsis, edicion:$edicion) {
		libroId
	  }
	 }
 `;
 
 const NEWBOOK =gql`
	 mutation NewBook($titulo: String!, $autor: String!, $editorial: String!, $sinopsis: String,$edicion: String) {
	  newBook(titulo: $titulo, autor: $autor, editorial: $editorial, sinopsis: $sinopsis, edicion:$edicion) {
		libroId
	  }
	 }
 `;
 
const DELBOOK=gql`
	mutation deleteBook($libroId: Int!) {
		deleteBook(libroId: $libroId) {
			libroId
		}
	}
 `;
 
//TODO - hacer paginación de los elementos
//TODO - regresar mesajes de error	
var AdminBook = withApollo((props) =>{
	// los datos de todos los libros
	const { loading, error, data, refetch } = useQuery(ALLBOOK); 
	const [editItem, setEditItem] = useState(-1);
	const [newItem, setNewItem] = useState(false);
	
	// para el formulario de edicion de datos
	const [form, setForm] = useState({ titulo: '', autor:'', editorial:'', sinopsis: '', edicion:'', libroId:-1 });
    const updateForm = (({ target }) => setForm({ ...form, [target.name]: target.value }))
	
	
	function prepareEdit(i) {
		let item=data.allBook[i];
		
		setForm({titulo:item.titulo, autor:item.autor, editorial:item.editorial, 
				sinopsis: item.sinopsis, edicion:item.edicion, libroId:item.libroId });
		setEditItem(i);
	}
	
	function prepareNew() {	
		setForm({ titulo: '', autor:'', editorial:'', sinopsis: '', edicion:'', libroId:-1 });
		setNewItem(true);
	}
	
	function deleteLibro(i) {
			
		props.client
		  .query({
			query: DELBOOK,
			variables: {libroId:data.allBook[i].libroId}
		  })
		  .then(result => {	
				//console.log("res",result);
				// veo si hay errores
				if(result.errors !== undefined) {
					// debe lanzar la ventana modal de error
					console.log("error",result.errors[0].message);
				} else {
					// actualizo la tabla			
					refetch()
				}
			}
			);
	}
	
	function validateEdit(i) {
		let msgs="", edo=true;

		if(form.autor.trim()==='') {
			edo=false; msgs=msgs+" \n El campo autor no puede ser nulo";
		}

		if(form.titulo.trim()==='') {
			edo=false; msgs=msgs+" \n El campo titulo no puede ser nulo";
		}

		if(form.editorial.trim()==='') {
			edo=false; msgs=msgs+" \n El campo editoria no puede ser nulo";
		}

		
		return {edo,msgs};
	}
	
	function saveEdit(i) {
		// hago la llamada a GrapQL para que modifique los datos
		let valida=validateEdit(i)	
		if(!valida.edo) {
			console.log("error de formulario", valida.msgs);
			return;
		}
		
		// si i=-1 agraga un nuevo libro
		props.client
		  .query({
			query: (i==-1? NEWBOOK : EDITBOOK),
			variables: form
		  })
		  .then(result => {	
				//console.log("res",result);
				// veo si hay errores
				if(result.errors !== undefined) {
					// debe lanzar la ventana modal de error
					console.log("error",result.errors[0].message);
				} else {
					// actualizo la tabla			
					refetch()
				}
			}
			);		  
		setEditItem(-1);
		setNewItem(false);
	}
	
	function cancelEdit(i) {		
		setEditItem(-1);
		setNewItem(false);
	}
	
	return (
		<React.Fragment>
			<h1 class="title">Administrar libros</h1>

			<Section>	
				<Button rounded color="primary" onClick={() => prepareNew() }>Agregar</Button>
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
				  {newItem && <tr >
						<td><Input name="titulo" value={form.titulo} onChange={updateForm} /></td>
						<td><Input name="autor" value={form.autor} onChange={updateForm} /></td>
						<td><Input name="editorial" value={form.editorial} onChange={updateForm} /></td>
						<td><Input name="sinopsis" value={form.sinopsis} onChange={updateForm} /></td>
						<td><Input name="edicion" value={form.edicion} onChange={updateForm} /></td>
						<td>
							<span className="icon">
								<i onClick={() => {saveEdit(-1) }} className="fa fa-check"></i>
							</span>
						</td>
						<td>
							<span className="icon">
								<i onClick={() => {cancelEdit() }} className="fa fa-times"></i>
							</span>
						</td>
					  </tr>
				  }
				  {data && data.allBook.map(function(e,i) {
						if(editItem == i) {						
							return <tr key={i}>
									<td><Input name="titulo" value={form.titulo} onChange={updateForm} /></td>
									<td><Input name="autor" value={form.autor} onChange={updateForm} /></td>
									<td><Input name="editorial" value={form.editorial} onChange={updateForm} /></td>
									<td><Input name="sinopsis" value={form.sinopsis} onChange={updateForm} /></td>
									<td><Input name="edicion" value={form.edicion} onChange={updateForm} /></td>
									<td>
										<span className="icon">
											<i onClick={() => {saveEdit(i) }} className="fa fa-check"></i>
										</span>
									</td>
									<td>
										<span className="icon">
											<i onClick={() => {cancelEdit(i) }} className="fa fa-times"></i>
										</span>
									</td>
								  </tr>
						} else {
							return <tr key={i}><td>{e.titulo}</td><td>{e.autor}</td><td>{e.editorial}</td><td>{e.sinopsis}</td><td>{e.edicion}</td>
									<td>
										<span className="icon">
											<i onClick={() => {prepareEdit(i) }} className="fa fa-edit"></i>
										</span>
									</td>
									<td>
										<span className="icon">
											<i onClick={() => {deleteLibro(i) }} className="fa fa-trash"></i>
										</span>
									</td>
									</tr>
						}
					})					
				  }
				  
				 </tbody>
			  </Table>

			</Section>
		</React.Fragment>
	);
})


export default AdminBook;
