## Solucion al Problema3


### Dise�o

Para esta soluci�n se decidi� dividir el proyecto en los siguientes ambientes:

Servidor de Aplicacion/Negocio
Se localiza en el directorio **server**

Este es el servidor de **Negocio** y **Datos** (en este ejemplo decid� que estar�an juntos, por simplicidad).

Backend	
	Node.js
	Apollo server para graphQL 

BAse de datos
	Prisma sobre SQLite
	


Frontend.
El codigo fuente esta en el directorio **reactjs**.
Para el desarrollo use reactjs + Bulma (para CSS) +  apollo-client


Cabe mencionar que antes de realizar esta prueba no sabia las tecnolog�as Apollo, Prisma o Bulma, as� que en este timpo las investigue, estudio y apred� para resolver el problema


### Notas sobre implemetanci�n
El servidor de Negocio entrega un token al navegador al hacer el login, por lo que si se quieren probra con usuarios diferentes (para probar multiples Roles) se deben abrir en diferentes navegadores o en el mismo navegador en pesta�a normal y otra privada.

En el servidor de Negocios se valida el **Rol** del usuario antes de hacer una acci�n (esto agrega seguridad)

#### Como abrir GrapQL Playground
Por las restricciones de **token** el playground de GraphQL no puede hacer **Mutation** porque no tiene el token. Existe un backdor para que playground pueda hacer los **Mutation** .

Abre esta p�gina
[http://127.0.0.1:4000/](http://127.0.0.1:4000/)

ejecutar el siguiente consulta, para no checar los permisos:
```
mutation {
  checkGrants(check:false) {
    msg
  }
}
```
Si quieres que cheuqe de nuevo los perimos se debe poner "true"

#### Notas sobre el Frontend
En el perfil del administador se muestra el rol del usuario c�mo un numero (0-administrador, 1-bibliotecario, 2-lector) en lugar de un **Select** esto es con el fin de demostrar la validaci�n de usuarios.

Los mensajes de Error, aun no se muestran en una ventana modal, pero si en la consola del navegador. 

Aun hay muchos detalles por afinar en el Frontend, pero creo que el trabajo es sufienciente para esta prueba.

### como ejecutar
Debes tener instalado Node.js v10 o m�s, yarn (dentro de nodejs)

Necesitas dos terminales del shell:
**Terminal 1** 
```
cd server
yarn install
yarn dev
```


**Terminal 2** 
```
cd reactjs
yarn install
http-server buildApp
```

Despu�s habir tu navegaor esta direcci�n [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

Los usuarios existentes son:
| email | password | rol |
| --- | --- | --- |
| user1@yo.com | user1 | Lector |
| user2@yo.com | user2 | Lector |
| user3@yo.com | user3 | Lector |
| user4@yo.com | user4 | Bibliotecario |
| user5@yo.com | user5 | Administrador |
| user6@yo.com | user6 | Administrador |






