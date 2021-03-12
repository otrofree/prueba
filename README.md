## Solución a los problemas de "Prueba Software Engineer".

Cada directorio contiene la solución a los problemas descritos en la "Prueba".

## problema1
El directorio contiene la solución al problema 1. 

Para ver la solución abrir en el navegador el archivo "problema1\index.html" 

Probado en:
- Chrome Escritorio v88.0.43
- Firefox v86.0
		

## problema2

En el directorio se encuentran los diseños del proyecto de la tienda de artesanías.

El archivo **Diseno_gral.pdf** es el documento. En el directorio *soporte* se ecuentran todos los archivos que fueron soporte para generar este documento.


## problema3

Para esta solución se decidió dividir el proyecto en los siguientes ambientes:

Servidor de Aplicacion/Negocio
Se localiza en el directorio **server**

Este es el servidor de **Negocio** y **Datos** (en este ejemplo decidí que estarían juntos, por simplicidad).

Backend	
	Node.js
	Apollo server para graphQL 

BAse de datos
	Prisma sobre SQLite
	


Frontend.
El codigo fuente esta en el directorio **reactjs**.
Para el desarrollo use reactjs + Bulma (para CSS) +  apollo-client


Cabe mencionar que antes de realizar esta prueba no sabia las tecnologías Apollo, Prisma o Bulma, así que en este timpo las investigue, estudio y apredí para resolver el problema

### como ejecutar
Debes tener instalado Node.js v10 o más, yarn (dentro de nodejs)

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
http-server build
```

despues habir tu navegaor esta dirección [http://127.0.0.1:8080/](http://127.0.0.1:8080/)





