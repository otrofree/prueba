const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolvers.js');

// para la generacion de token
const { getUserId } = require('./utils');


const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const server = new ApolloServer({
	typeDefs,
	resolvers,
	playground: true,
	context: ({ req }) => {
		// paso el contexto con el objeto de prisma y con el ID que viene de la llamada del cliente
		return {
		  ...req,
		  prisma,
		  userId:
			req && req.headers.authorization
			  ? getUserId(req)
			  : null
		};
	}
});

  
server.listen().then(() => {
  console.log('servidor corriendo en <http://localhost:4000/grapqhql>');
});
