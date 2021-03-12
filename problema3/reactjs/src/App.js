import logo from './logo.svg';
import './App.css';

import { withApollo } from '@apollo/react-hoc';    

import React, { Fragment, useState, useCallback } from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';

// los componentes de Bulma, 
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Navbar, Form, Modal, Section, Container, Notification, Media, Image, Content, Level,
		Columns, Table } from 'react-bulma-components';

// los componentes propios de la interfaz		
import AdminUsers from './AdminUsers'
//import AdminBook from './AdminBook'
		
const { Input, Field, Control, Label } = Form;

 
const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
	login(email:$email, password: $password) {
		token
		usuario {
			usuarioId
			nombre
			rol
		}
    }
  }
`;

const ALLBOOK = gql`
  query {
	allBook {
      libroId
      titulo
      editorial
      autor
      sinopsis
      edicion
	}
  }
`;

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
 
// el formulario de Login
function Login(props) {
  const [form, setForm] = useState({ email: '', password: '' });
  const update = (({ target }) => setForm({ ...form, [target.name]: target.value }))
  return (
    <React.Fragment>
	 <div class="container is-fluid">

      <section data-section-id="1" data-category="sign-in"  class="section">
        <div class="container has-text-centered">
          <div class="columns is-centered">
            <div class="column is-5 is-4-desktop">
			
			   <Field>
				<Control>
				  <Label>Email</Label>
				  <Input name="email" value={form.email} onChange={update} />
				</Control>
			  </Field>
			  <Field>
				<Control>
				  <Label>Password</Label>
				  <Input name="password" type="password" value={form.password} onChange={update} />
				</Control>
			  </Field>
			  <Button.Group>
				<Button fullwidth rounded color="primary" onClick={() => props.login(form)}>Login</Button>
			  </Button.Group>
	  
		   </div>
		 </div>
	  </div>
	  </section>
	  </div>
    </React.Fragment>
  );
}

function ErrorModal(props) {
	return(
	  <Modal show={props.show} onClose={props.onClose} >
		<Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>
            Error
          </Modal.Card.Title>
        </Modal.Card.Head>
        <Modal.Card.Body>
          <Media>
            <Media.Item renderAs="figure" position="left">
              <Image size={64} alt="64x64" src="http://bulma.io/images/placeholders/128x128.png" />
            </Media.Item>
            <Media.Item>
              <Content>
                <p>
                  {props.msg}
                </p>
              </Content>
            </Media.Item>
          </Media>
        </Modal.Card.Body>
        <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center' }}>
          <p>
			<Button fullwidth rounded color="primary" onClick={props.onClose}>Cerrar</Button>
          </p>
        </Modal.Card.Foot>
      </Modal.Card>
	  </Modal>	
	);
}


function BuquedaComp(props) {
  const [busqueda, setBusqueda] = useState('');
  const update = (({ target }) => setBusqueda(target.value ));
  
  return (
	<Level>
	 <Level.Item>
        <Field kind="addons">
          <Control>
            <Input name="busqueda" value={busqueda} onChange={update} />
          </Control>
          <Control>
            <Button fullwidth rounded color="primary" onClick={() => props.search(busqueda)}>
				<span className="icon">
					<i className="fa fa-search"></i>
				</span>
			</Button>
          </Control>
        </Field>
      </Level.Item>
	 </Level>
  );
}


var LibrosCont = withApollo((props) =>{
	async function doSearch(qry){
		props.client
		  .query({
			query: ALLBOOK
		  })
		  .then(result => console.log("jjjj",result));		  
	}
	
	return (
		<React.Fragment>
			<h1 class="title">Busqueda de libros</h1>
			<BuquedaComp search={doSearch} />
			<div> OK </div>
		</React.Fragment>
	);
})

var Solicitudes = withApollo((props) =>{
	async function doSearch(qry){
		props.client
		  .query({
			query: ALLBOOK
		  })
		  .then(result => console.log("jjjj",result));		  
	}
	
	return (
		<React.Fragment>
			<h1 class="title">Solicitudes de prestamo</h1>
			<BuquedaComp search={doSearch} />
			<div> OK </div>
		</React.Fragment>
	);
})

/*
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
		if(!valida.edo) return;
		
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
*/

function MainLayout(props) {
	return (
	<Container>
	<Columns>
	  <Columns.Column size="half">
		<Notification >			
			{props.rol==2? (
				<Solicitudes/>
			) : (
				<LibrosCont rol={props.rol}/>
			)}
		</Notification>
	  </Columns.Column>
	  <Columns.Column>
		<Notification color="info">
			{props.rol===2? (
				<AdminUsers />
			 ):(
				<div />
			 )
			 }
		</Notification>
	  </Columns.Column>
	</Columns>
	</Container>
	);
}




function App() {
	const [userName, setUserName] = useState("");
	const [userId, setUserId] = useState(0);
	const [userRol, setUserRol] = useState(3);
	const [isLogin, setIsLogin] = useState(localStorage.getItem("token")===null?false:true);
	
	// Para mostrar la ventana de error
	const [isError, setIsError] = useState({show:false,msg:""});


	// para el menu responsive
	const [isMenuActive, setisMenuActive] = React.useState(false)

    const [userLogin,{ data, loading: mutationLoading, error: mutationError }] = useMutation(LOGIN);
  
  
  async function login(data) {
	try {
		if(data.email==="" || data.password==="") return;
		// pido el login al servidor
		var ld =await userLogin({ variables: { email: data.email , password: data.password } })
		try {
			localStorage.setItem('token',ld.data.login.token);
			setIsLogin(true);
			setUserId(ld.data.login.usuario.usuarioId);
			setUserName(ld.data.login.usuario.nombre);
			setUserRol(ld.data.login.usuario.rol);
			
			console.log("...",ld);
		}catch(e) {	}
	}catch(e) {
		console.log(e.message);
		setIsLogin(false);
		setIsError({show:true, msg:e.message});		
	}
  }
  
  function logout() {
	localStorage.removeItem("token");
	setIsLogin(false);
	setUserName("");
	setUserRol(3);
  }
  
  function closeModal(){
	setIsError({show:false, msg:""})
  }
  
  return (  
	<React.Fragment>
	 <Navbar fixed={'top'} >
        <Navbar.Brand>
          <Navbar.Item renderAs="a" href="#">
            <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
          </Navbar.Item>
          <Navbar.Burger 
			data-target="navbarBasicExample" 
			className={`navbar-burger burger ${isMenuActive ? "is-active" : ""}`}
			onClick={() => {setisMenuActive(!isMenuActive) }} 
		  />
        </Navbar.Brand>
        <Navbar.Menu 
			id="navbarBasicExample"
			className={`navbar-menu ${isMenuActive ? "is-active" : ""}`} 
		 >
		  
              <Navbar.Container position="end">
			<Navbar.Item  href="#">
              {(isLogin && userName) || "" }
            </Navbar.Item>
            <Navbar.Item onClick={logout} href="#">
                  Logout
            </Navbar.Item>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
	  
	  
	  {!isLogin ? (
		<Login login={login}/> 
	  ):(
		<MainLayout rol={userRol} />
      )}
	  
	  <ErrorModal show={isError.show} onClose={closeModal} msg={isError.msg} />
	
	  </React.Fragment>
  );
}

//<div> {data} </div>

export default App;
