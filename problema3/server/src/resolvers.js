const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('./utils');

const msgs ={
	userNotFound:"El usuario no existe",
	invalidPassword: "Password invalido",
	bookNotFound:"El libro no existe",
	borrowNotFound: "Prestamo no existe",
	noGrants:"No tienes permisos para realizar esta accion",	
}

// para verificar permisos antes de procesar cualquier cosa
var checkGrants=true;

module.exports = {
	Query: {
		allUser: async (parent, args, context) => {	
			return await context.prisma.usuario.findMany({});
		},
		
		allBook: async (parent, args, context) => {
			return await context.prisma.libro.findMany({});
		},
		
		myBorrow: async (parent, args, context) => {	
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal			
			if(checkGrants) {
				if(context.usuario.rol!=2) {
					throw new Error(msgs.noGrants);
				}
			}
			
			// tomo el Id del token, si el Id que le pasan en cero (sucede cuando se refresca la página)			
			if(args.usuarioId == 0) {
				args.usuarioId=context.usuario.usuarioId;
			}
			
			return await context.prisma.prestamo.findMany({
				where: { usuarioId: args.usuarioId},
				select:{
					prestamoId: true,
					estado: true,
					libro: { select: {libroId:true ,titulo:true, autor:true, editorial:true, sinopsis: true, edicion: true}},
					usuario: {select: { usuarioId: true, email:true, nombre:true}}
				} 
			});
		},

		
		allBorrow: async (parent, args, context) => {	
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal			
			if(checkGrants) {
				if(context.usuario.rol!=1) {
					throw new Error(msgs.noGrants);
				}
			}
			
			// si el estado = -1 quiere todos los prestamos
			let where={}
			if(args.estado >=0 && args.estado < 3 ) {
				where={estado:args.estado};
			}
			
			return await context.prisma.prestamo.findMany({
				where: where,
				select:{
					prestamoId: true,
					estado: true,
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

			const token = jwt.sign({ usuarioId: usuario.usuarioId, rol: usuario.rol }, APP_SECRET);

			return {
				token,
				usuario,
				rol:usuario.rol
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
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}
			
			// encripto la clave
			const clave = await bcrypt.hash(args.password, 10);
			delete args.password;  // en la base no hay campo "password"
		
			const usuario = await context.prisma.usuario.create({
				data: { ...args, clave }
			});
			
			return usuario;
		},
		
		
		delUser: async(parent, args, context, info) => {
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}
			
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
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}

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
			}
			delete args.password;  // en la base no hay campo "password" en su lugar se llama "clave"
			
			const usuario = await context.prisma.usuario.update({
				 where: { usuarioId: args.usuarioId  },
				 data: {... args}
			});
			
			return usuario;
		},
		
		
		newBook: async(parent, args, context, info) => { 
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}
			
			const libro = await context.prisma.libro.create({
				data: { ...args }
			});
			
			return libro;
		},
		
		deleteBook: async(parent, args, context, info) => {
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}
			
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
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=0) {
					throw new Error(msgs.noGrants);
				}
			}
			
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
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal
			if(checkGrants) {
				if(context.usuario.rol!=2) {
					throw new Error(msgs.noGrants);
				}
			}
			
			// tomo el Id del token, si el Id que le pasan en cero (sucede cuando se refresca la página)
			if(args.usuarioId == 0) {
				args.usuarioId=context.usuario.usuarioId;
			}
			console.log("args2",args);
			
			//hago la acción
			const libro = await context.prisma.prestamo.create({
				data: { ...args, estado:0  }
			});

			return libro;
		},
		
		
		confirmBorrow: async(parent, args, context, info) => { 
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal			
			
			console.log("confirmar ",args);
			
			if(checkGrants) {
				if(context.usuario.rol!=1) {
					throw new Error(msgs.noGrants);
				}
			}			
			
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
			// checar que se el rol apropiado, 0-admin,1-bilbiotecario,2-usuario normal			
			if(checkGrants) {
				if(context.usuario.rol!=1) {
					throw new Error(msgs.noGrants);
				}
			}

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
		
		// solo para depuracion, permite usar el GraphQL playground para hacer las pruebas
		checkGrants: async(parent, args, context, info) => { 
			checkGrants=args.check;
			
			return {msg:"Checar permisos de usario antes de hacer un Mutate: "+args.check}
		},		
	},
  
 
};