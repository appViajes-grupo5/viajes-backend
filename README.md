# viajes-backend
API REST para el TFM de appViajes

## 🗄️ Base de Datos e Infraestructura

Este proyecto utiliza MySQL como base de datos relacional. La estructura y los datos necesarios se encuentran en la carpeta `/db`.

### Variables de Entorno (.env)
Para que el backend funcione correctamente, crea un archivo `.env` en la raíz basado en `.env.example` con las siguientes claves:

| Variable      | Descripción                          | Ejemplo               |
|---------------|--------------------------------------|-----------------------|
| `PORT`        | Puerto del servidor Express          | `4000`                |
| `DB_HOST`     | Host de la base de datos             | `localhost`           |
| `DB_USER`     | Usuario de MySQL                     | `root`                |
| `DB_PASSWORD` | Contraseña de MySQL                  | `1234`                |
| `DB_NAME`     | Nombre de la base de datos           | `grupo5_viajes`       |
| `DB_PORT`     | Puerto de MySQL                      | `3306`                |
| `JWT_SECRET`  | Clave secreta para firmar tokens     | `super_secreto_123`   |

### Inicialización de la Base de Datos

Hemos automatizado la creación de las tablas. Puedes inicializar la BBDD ejecutando el siguiente comando desde la terminal del backend:

```bash
npm run db:init