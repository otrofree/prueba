const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('./utils');

const msgs ={
	userNotFound:"El usuario no existe",
	invalidPassword: "Password invalido",
	bookNotFound:"El libro no existe",
	borrowNotFound: "Prestamo no existe",
	notGrants:"No tienes permisos para realizar esta accion",	
}


module.exports = {
	Query: {
		allUser: async (parent, args, context) => {
			//console.log("paps", args);				
			return await context.prisma.usuario.findMany({});
		},
		
		allBook: async (parent, args, context) => {
			return await context.prisma.libro.findMany({});
		},
		
		myBorrow: async (parent, args, context) => {
			return await context.prisma.prestamo.findMany({
				select:{
					prestamoId: true,
					libro: { select: {libroId:true ,titulo:true, autor:true, editorial:true, sinopsis: true, edicion: true}},
					usuario: {select: { usuarioId: true, email:true, nombre:true}}
				} 
			});
		}		
	},	
	
	
	Mutation: {
		login: async(parent, args, context, info) => {
			const usuario = await context.prisma.usuario.findUnique({
				where: { email: args.email }
			});
			
			if (!usuario) {
				throw new Error(msgs.userNotFound);
			}

			const valid = await bcrypt.compare( args.password, usuario.clave );
			if (!valid) {
				throw new Error(msgs.invalidPassword);
			}

			const token = jwt.sign({ userId: usuario.id, rol: usuario.rol }, APP_SECRET);

			return {
				token,
				usuario
				};
		},
		
		setPassword:  async(parent, args, context, info) => {
			const usuario = await context.prisma.usuario.findUnique({
				where: { email: args.email }
			});
			
			if (!usuario) {
				throw new Error(msgs.userNotFound);
			}
			
			const password = await bcrypt.hash(args.password, 10);
			const profile = await context.prisma.usuario.update({
				where: { email: args.email },
				data:{ clave:password }
			})
			
			return profile;
		},

		newUser:  async(parent, args, context, info) => {
			// checar el rol que
			
			// encripto la clave
			const clave = await bcrypt.hash(args.password, 10);
			delete args.password;  // en la base no hay campo "password"
		
			const usuario = await context.prisma.usuario.create({
				data: { ...args, clave }
			});
			
			return usuario;
		},
		
		
		delUser: async(parent, args, context, info) => {
			// checar el rol que
			
			// veo que el usuario exista
			const userT = await context.prisma.usuario.findUnique({
				where: { usuarioId: args.usuarioId  },
				select: { usuarioId: true }
			});
			
			if(!userT) {
				throw new Error(msgs.userNotFound);
			}			
			
			// procedo			
			const usuario = await context.prisma.usuario.delete({
				 where: { usuarioId: args.usuarioId  },
			});
			
			return usuario;
		},
		
		
		editUser: async(parent, args, context, info) => { 
			// checar el rol que

			// veo que el usuario exista
			const userT = await context.prisma.usuario.findUnique({
				where: { usuarioId: args.usuarioId  },
				select: { usuarioId: true }
			});
			
			if(!userT) {
				throw new Error(msgs.userNotFound);
			}			
			
			// procedo						
			if(args.password) {				
				// encripto la clave
				args.clave = await bcrypt.hash(args.password, 10);
				delete args.password;  // en la base no hay campo "password"
			}
			
			const usuario = await context.prisma.usuario.update({
				 where: { usuarioId: args.usuarioId  },
				 data: {... args}
			});
			
			return usuario;
		},
		
		
		newBook: async(parent, args, context, info) => { 
			// checar el rol que
			
			const libro = await context.prisma.libro.create({
				data: { ...args }
			});
			
			return libro;
		},
		
		deleteBook: async(parent, args, context, info) => {
			// checar el rol que
			
			// TODO - verificar que el libro no este prestado
			// veo que el libro exista
			const libroT = await context.prisma.libro.findUnique({
				where: { libroId: args.libroId },
				select: {libroId:true}
			});
			
			if(!libroT) {
				throw new Error(msgs.bookNotFound);
			}			
			
			// procedo			
			const libro = await context.prisma.libro.delete({
				 where: { libroId: args.libroId  },
			});
			
			return libro;
		},
		
		
		editBook: async(parent, args, context, info) => { 
			// checar el rol que

			// veo que el libro exista
			const libroT = await context.prisma.libro.findUnique({
				where: { libroId: args.libroId }, 
				select: {libroId:true}
			});
			
			if(!libroT) {
				throw new Error(msgs.bookNotFound);
			}			
			
			// procedo
			const libro = await context.prisma.libro.update({
				 where: { libroId: args.libroId  },
				 data: {... args}
			});
			
			return libro;
		},
		
		
		newBorrow: async(parent, args, context, info) => { 
			// checar el rol que
			
			const libro = await context.prisma.prestamo.create({
				data: { ...args, estado:0  }
			});
			//console.log(libro);
			return libro;
		},
		
		
		confirmBorrow: async(parent, args, context, info) => { 
			// checar el rol que
			
			
			// veo que el prestamo exista
			const prestamo = await context.prisma.prestamo.findUnique({
				where: { prestamoId: args.prestamoId },
			});
			
			if(!prestamo) {
				throw new Error(msgs.borrowNotFound);
			}
			
			// procedo
			await context.prisma.prestamo.update({
				where: { prestamoId: args.prestamoId },
				data: { ...args, estado:1  }
			});
			
			return {msg:"ok"}
		},
		
		
		returnBorrow: async(parent, args, context, info) => { 
			// checar el rol que

			// veo que el prestamo exista
			const prestamo = await context.prisma.prestamo.findUnique({
				where: { prestamoId: args.prestamoId },
			});
			
			if(!prestamo) {
				throw new Error(msgs.borrowNotFound);
			}
			
			// procedo
			await context.prisma.prestamo.update({
				where: { prestamoId: args.prestamoId },
				data: { ...args, estado:2  }
			});
			
			return {msg:"ok"}
		},
		
		
	},
  
 
};