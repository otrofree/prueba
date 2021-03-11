const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('./utils');




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
				throw new Error('No such user found');
			}

			const valid = await bcrypt.compare( args.password, usuario.clave );
			if (!valid) {
				throw new Error('Invalid password');
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
				throw new Error('No such user found');
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
			
			const usuario = await context.prisma.usuario.delete({
				 where: { usuarioId: args.usuarioId  },
			});
			
			return usuario;
		},
		
		
		editUser: async(parent, args, context, info) => { 
			// checar el rol que
			
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
		
	},
  
 
};