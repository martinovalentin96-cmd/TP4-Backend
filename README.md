# SVM Books — Backend

API REST para una librería virtual. Desarrollada con Express.js, Sequelize y SQLite.

## Integrantes

- Quevedo, Samir
- Vélez, Manuel
- Martino, Valentín

## Tecnologías

- Node.js + Express.js
- Sequelize ORM + SQLite
- JSON Web Token (JWT)
- bcryptjs
- express-validator

## Instalación

```
npm install
```

## Levantar el servidor

```
node src/app.js
```

El servidor corre en `localhost:3000`.

## Entidades

- Genero
- Editorial
- Autor
- Libro
- Usuario
- Pedido
- ItemPedido
- Resena

## Endpoints

### Géneros
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/generos | Listar todos los géneros |
| POST | /api/generos | Crear un género |
| PUT | /api/generos/:id | Editar un género |
| DELETE | /api/generos/:id | Eliminar un género |

### Editoriales
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/editoriales | Listar todas las editoriales |
| POST | /api/editoriales | Crear una editorial |
| PUT | /api/editoriales/:id | Editar una editorial |
| DELETE | /api/editoriales/:id | Eliminar una editorial |

### Autores
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/autores | Listar todos los autores |
| GET | /api/autores/:id | Obtener un autor con sus libros |
| POST | /api/autores | Crear un autor |
| PUT | /api/autores/:id | Editar un autor |
| DELETE | /api/autores/:id | Eliminar un autor |

### Libros
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/libros | Listar libros (soporta ?titulo= ?autor= ?genero=) |
| GET | /api/libros/:id | Obtener detalle de un libro |
| POST | /api/libros | Crear un libro |
| PUT | /api/libros/:id | Editar un libro |
| DELETE | /api/libros/:id | Eliminar un libro |

### Autenticación
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | /api/auth/register | Registrar nuevo usuario |
| POST | /api/auth/login | Iniciar sesión — devuelve JWT |

### Usuarios (requiere token)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/usuarios | Listar usuarios (solo admin) |
| GET | /api/usuarios/:id | Ver perfil de un usuario |
| DELETE | /api/usuarios/:id | Eliminar un usuario (solo admin) |

### Pedidos (requiere token)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/pedidos | Listar pedidos del usuario autenticado |
| GET | /api/pedidos/:id | Ver detalle de un pedido |
| POST | /api/pedidos | Crear un pedido |
| PUT | /api/pedidos/:id | Actualizar estado del pedido |

### Reseñas
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/resenas/libro/:id | Listar reseñas de un libro |
| POST | /api/resenas | Crear una reseña (requiere token) |
| PUT | /api/resenas/:id | Editar una reseña propia (requiere token) |
| DELETE | /api/resenas/:id | Eliminar una reseña propia (requiere token) |

## Autenticación

Las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al registrarse o iniciar sesión.

## Ejemplos

### Registrar usuario
```
POST /api/auth/register
{
  "nombre": "Juan",
  "email": "juan@gmail.com",
  "password": "123456"
}
```

### Iniciar sesión
```
POST /api/auth/login
{
  "email": "juan@gmail.com",
  "password": "123456"
}
```

### Crear un libro
```
POST /api/libros
{
  "titulo": "El Aleph",
  "precio": 4500,
  "stock": 12,
  "autorId": 1,
  "generoId": 1,
  "editorialId": 1
}
```

### Filtrar libros
```
GET /api/libros?titulo=aleph
GET /api/libros?autor=borges
GET /api/libros?genero=ficcion
```

### Crear un pedido
```
POST /api/pedidos
Authorization: Bearer <token>
{
  "items": [
    { "libroId": 1, "cantidad": 2 },
    { "libroId": 2, "cantidad": 1 }
  ]
}
```
