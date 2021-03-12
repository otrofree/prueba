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
import AdminBook from './AdminBook'
import Libros from './Libros'
import Prestamos from './Prestamos'
import AdminPrestamos from './AdminPrestamos'
		
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

 
// el formulario de Login
function Login(props) {
  const [form, setForm] = useState({ email: '', password: '' });
  const update = (({ target }) => setForm({ ...form, [target.name]: target.value }))
  return (
    <React.Fragment>
	 <div className="container is-fluid">

      <section data-section-id="1" data-category="sign-in"  className="section">
        <div className="container has-text-centered">
          <div className="columns is-centered">
            <div className="column is-5 is-4-desktop">
			
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
	}
	
	return (
		<React.Fragment>
			<h1 className="title">Busqueda de libros</h1>
			<BuquedaComp search={doSearch} />
			<div> OK </div>
		</React.Fragment>
	);
})


function MainLayout(props) {
	const [update, setUpdate] = useState(0);
	const updatePrestamo=()=> setUpdate(update+1)
	const perfiles=["Administador","Bibliotecario","Lector"]
	
	return (
	<Container>
	<h1 className="title"> Bienvenido al portal de {perfiles[parseInt(props.rol)]}</h1>
	<Columns>
	  <Columns.Column >
		<Notification >			
			{(() => {
			switch (parseInt(props.rol)) {
			  case 0: // admin
				return <AdminBook />;
			  case 1: // bibliotecatio
				return <AdminPrestamos />;								
			  case 2: // user
				return <Libros rol={props.rol} usuarioId={props.usuarioId} updatePrestamo={updatePrestamo} />;
			  default: // cualquier otra cosa
				return <div />;			 
			}
		  })()}
		</Notification>
	  </Columns.Column>

			{(() => {
				switch (parseInt(props.rol)) {
				  case 0: // admin
					return 	  <Columns.Column>
								<Notification color="info">
									<AdminUsers />
								</Notification>
							 </Columns.Column>;
				  case 1: // bibliotecatio
					return <div />;
				  case 2: // user
					return 	  <Columns.Column>
								<Notification color="info">
									<Prestamos rol={props.rol} usuarioId={props.usuarioId} update={update} />
								</Notification>
							 </Columns.Column>;
				  
					return 
				  default: // cualquier otra cosa
					return <div />;			 
				}
			  })()}	
	</Columns>
	</Container>
	);
}




function App() {
	const [userName, setUserName] = useState("");
	const [userId, setUserId] = useState(0);
	const [userRol, setUserRol] = useState(localStorage.getItem("rol")===null?3:localStorage.getItem("rol"));
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
			localStorage.setItem('rol',ld.data.login.usuario.rol);
			setIsLogin(true);
			setUserId(ld.data.login.usuario.usuarioId);
			setUserName(ld.data.login.usuario.nombre);
			setUserRol(ld.data.login.usuario.rol);
		}catch(e) {	}
	}catch(e) {
		//console.log(e.message);
		setIsLogin(false);
		setIsError({show:true, msg:e.message});		
	}
  }
  
  function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("rol");
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
		<MainLayout rol={userRol} usuarioId={userId} />
      )}
	  
	  <ErrorModal show={isError.show} onClose={closeModal} msg={isError.msg} />
	
	  </React.Fragment>
  );
}

//<div> {data} </div>

export default App;
