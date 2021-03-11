import logo from './logo.svg';
import './App.css';


import React, { Fragment, useState } from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Navbar, Form, Modal, Section, Container, Notification, Media, Image, Content, Level } from 'react-bulma-components';
const { Input, Field, Control, Label } = Form;

 
const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
	login(email:$email, password: $password) {
		token
		usuario {
			usuarioId
			nombre
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

// el formulario de Login
function Login(props) {
  const [form, setForm] = useState({ email: '', password: '' });
  const update = (({ target }) => setForm({ ...form, [target.name]: target.value }))
  return (
    <React.Fragment>
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
    <React.Fragment>
	   <Field>
        <Control>          
          <Input name="busqueda" value={busqueda} onChange={update} />
        </Control>
      </Field>
        <Button fullwidth rounded color="primary" onClick={() => props.search(busqueda)}>Buscar</Button>
    </React.Fragment>
  );
}


function LibrosCont(props) {
/*
	const [search,{ data }] = useQuery(ALLBOOK);
	*/
	async function doSearch(qry){
		//let res= await search(ALLBOOK);
		//console.log("respuesta",res)
	}
	
	return (
		<React.Fragment>
			<BuquedaComp search={doSearch} />
			<div> OK </div>
		</React.Fragment>
	);
}

function App() {
	const [userName, setUserName] = useState("");
	const [userId, setUserId] = useState(0);
	const [userRol, setUserRol] = useState(0);
	const [isLogin, setIsLogin] = useState(false);
	
	const [isError, setIsError] = useState({show:false,msg:""});
	//const [isLogin, setIsLogin] = useState( localStorage.getItem());
  
  //const [userId, setCount] = useState(initialCount);
  /*
  const { loading, error, data } = useMutation(LOGIN, {
    variables: { email: 'english', password:"hola" },
  });	
  */
  const [userLogin,{ data, loading: mutationLoading, error: mutationError }] = useMutation(LOGIN);
  
  
  async function login(data) {
	try {
		if(data.email==="" || data.password==="") return;
		var x =await userLogin({ variables: { email: data.email , password: data.password } })
		try {
			localStorage.setItem('token',x.data.login.token);
			setIsLogin(true);
			setUserId(x.data.login.usuario.usuarioId);
			setUserName(x.data.login.usuario.nombre);
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
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu >
          <Navbar.Container>
			
          </Navbar.Container>
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
	  
	  
	  {!isLogin ? <Login login={login}/> : <LibrosCont />}
	  
	  <ErrorModal show={isError.show} onClose={closeModal} msg={isError.msg} />
	
	  </React.Fragment>
  );
}

//<div> {data} </div>

export default App;
