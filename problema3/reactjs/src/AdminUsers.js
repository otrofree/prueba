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

 

const ALLUSER = gql`
   query {
	allUser {
      usuarioId
      nombre
      email
      rol
    }
   }
 `;

 
 const EDITUSER =gql`
 mutation EditUser($email: String, $password: String, $rol: Int, $nombre: String, $usuarioId: Int!) {
  editUser(usuarioId: $usuarioId, email: $email, password: $password, rol: $rol, nombre: $nombre) {
    usuarioId
    nombre
    rol
	email
  }
}
 `;
 
 const NEWUSER =gql`
	mutation NewUser($email: String!, $nombre: String!, $password: String!, $rol: Int!) {
		newUser(email: $email, nombre: $nombre, password: $password, rol: $rol) {
			usuarioId
		}
	}
 `;
 
const DELUSER=gql`
	mutation DelUser($usuarioId: Int!) {
		delUser(usuarioId: $usuarioId) {
			email
		}
	}
 `;
 
//TODO - poner un select box en el campo de Rol
//TODO - hacer paginación de los elementos
var AdminUsers = withApollo((props) =>{
	// los datos de todos los usuarios
	const { loading, error, data, refetch } = useQuery(ALLUSER); 
	const [editItem, setEditItem] = useState(-1);
	const [newItem, setNewItem] = useState(false);
	
	// para el formulario de edicion de datos
	const [form, setForm] = useState({ email: '', nombre:'', rol:'', password: '', usuarioId:-1 });
    const updateForm = (({ target }) => setForm({ ...form, [target.name]: target.value }))
	
	
	function prepareEdit(i) {
		let item=data.allUser[i];
		
		setForm({email:item.email, nombre:item.nombre, rol:item.rol, password: '', usuarioId:item.usuarioId });
		setEditItem(i);
	}
	
	function prepareNew() {	
		setForm({ email: '', nombre:'', rol:'', password: '', usuarioId:-1 });
		setNewItem(true);
	}
	
	function deleteUser(i) {
			
		props.client
		  .query({
			query: DELUSER,
			variables: {usuarioId:data.allUser[i].usuarioId}
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
		
		if(form.rol!=='') {
			form.rol=parseInt(form.rol);
			//console.log("...",form.rol); return false;
			if(form.rol>2 || form.rol<0 || isNaN(form.rol)) {
				edo=false; msgs=msgs+" El rol debe ser 0,1 o 2";
			}
		}
		
		return {edo,msgs};
	}
	
	function saveEdit(i) {
		// hago la llamada a GrapQL para que modifique los datos
		let valida=validateEdit(i)	
		if(!valida.edo) {
			console.log("Error de formulario", valida.msgs);
			return;
		}

		
		// si i=-1 agraga un nuevo usuario
		props.client
		  .query({
			query: (i==-1? NEWUSER : EDITUSER),
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
			<h1 class="title">Administrar usuarios</h1>

			<Section>	
				<Button rounded color="primary" onClick={() => prepareNew() }>Agregar</Button>
				
			  <Table>
				<thead>
				  <tr>	
					<th>Email</th>
					<th>Nombre</th>
					<th>Rol</th>
					<th>Password</th>
				  </tr>
				 </thead>
				 <tbody>
				  {newItem && <tr >
						<td><Input name="email" value={form.email} onChange={updateForm} /></td>
						<td><Input name="nombre" value={form.nombre} onChange={updateForm} /></td>
						<td><Input name="rol" value={form.rol} onChange={updateForm} /></td>
						<td><Input name="password" value={form.password} onChange={updateForm} type="password"/></td>
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
				  {data && data.allUser.map(function(e,i) {
						if(editItem == i) {						
							return <tr key={i}>
									<td><Input name="email" value={form.email} onChange={updateForm} /></td>
									<td><Input name="nombre" value={form.nombre} onChange={updateForm} /></td>
									<td><Input name="rol" value={form.rol} onChange={updateForm} /></td>
									<td><Input name="password" value={form.password} onChange={updateForm} type="password"/></td>
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
							return <tr key={i}><td>{e.email}</td><td>{e.nombre}</td><td>{e.rol}</td><td></td>
									<td>
										<span className="icon">
											<i onClick={() => {prepareEdit(i) }} className="fa fa-edit"></i>
										</span>
									</td>
									<td>
										<span className="icon">
											<i onClick={() => {deleteUser(i) }} className="fa fa-trash"></i>
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


export default AdminUsers;
