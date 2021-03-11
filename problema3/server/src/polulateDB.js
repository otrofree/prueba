
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const libros = [
	{titulo:"Libro 1",autor:"Autor 1", editorial:"", sinopsis:"", edicion:""},
	{titulo:"Libro 2",autor:"Autor 2", editorial:"", sinopsis:"", edicion:""},
	{titulo:"Libro 3",autor:"Autor 3", editorial:"", sinopsis:"", edicion:""},
	{titulo:"Libro 4",autor:"Autor 4", editorial:"", sinopsis:"", edicion:""},
	{titulo:"Libro 5",autor:"Autor 5", editorial:"", sinopsis:"", edicion:""},
]

const usuarios = [
	{email:"user1@yo.com", name:"", clave:"",activo:0,role:0},
	{email:"user2@yo.com", name:"", clave:"",activo:0,role:0},
	{email:"user3@yo.com", name:"", clave:"",activo:0,role:0},
	{email:"user4@yo.com", name:"", clave:"",activo:0,role:0},
	{email:"user5@yo.com", name:"", clave:"",activo:0,role:0},
	
]


// A `main` function so that you can use async/await
async function populate() {
  // ... you will write your Prisma Client queries here
  
/*	
	libros.forEach(async function(item) {	
		await prisma.libro.create({	data: item })
	})
	

	usuarios.forEach(async function(item) {	
		await prisma.usuario.create({ data: item })
	})
*/
  
	//console.log( await prisma.prestamo.create({ data: { usuarioId:1,libroId:1,estado:0 } 	})   ) ;

		/*
  prestado        DateTime @default(now())
  entregaEstimada DateTime @default(now())
  entregaReal     
  */
  
	
	//await prisma.user.create({	data: item })
	
  let a=await prisma.prestamo.findMany();
  console.log(a);
  
  
  console.log(await prisma.prestamo.findMany( { 
	select:{
		libroId: true,
		libro: { select: {titulo:true}}
	} 
  } ));
  
  
    console.log(await prisma.usuario.findMany( { 
	select:{
		email:true,
		Prestamo: {
			select:{
				fPrestado:true
			}
		}
	} 
  } ));
  
}


populate()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
