
const { gql } = require('apollo-server');

const typeDefs = gql`
	type User {
		usuarioId: Int!
		email: String!
		nombre: String
		rol: Int
	}
	type AuthPayload {
		token: String
		usuario: User
	}
	type Book {
		libroId: Int
		titulo: String!
		autor: String!
		editorial: String!
		sinopsis: String
		edicion: String
		prestamo: Borrow
	}
	type Borrow {
		prestamoId: Int
		usuario: User
		libro: Book
		estado: Int
	}
	type Msg {
		msg:String
	}
	type Query {
		allUser(email:String):[User!]!
		allBook:[Book!]!
		myBorrow:[Borrow!]!
	}
	type Mutation {
		login(email: String!, password: String!): AuthPayload
		setPassword(email: String!, password: String!): User
				
		newUser(email: String!, nombre: String!, password: String!, rol: Int!): User
		delUser(usuarioId:Int!): User
		editUser(usuarioId:Int!, email: String, nombre: String, password: String, rol: Int): User
		
		newBook(titulo: String!, autor: String!, editorial: String!,sinopsis: String, edicion: String): Book
		deleteBook(libroId: Int!): Book
		editBook(libroId: Int!, titulo: String, autor: String, editorial: String, sinopsis: String, edicion: String): Book		
		
		newBorrow(libroId: Int!, usuarioId: Int!): Borrow
		confirmBorrow(prestamoId: Int!): Msg
		returnBorrow(prestamoId: Int!): Msg
	}  
`;
module.exports = typeDefs;

/*

		fPrestado:  String
		fEntregaEstimada: String
		fEntregaReal: String

   type Usuario {
    email: String!
    nombre: String
  }

  type Query {
    tasks: [Task]!
    task(id: Int!): Task
	profile: [User!]!
  }
  type Mutation {
    addTask(
      name: String!,
      description: String!,
      completed: Boolean!
    ): Task!
  }
  
*/