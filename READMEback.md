# 🌍 TravelConnect - Plataforma de Gestión de Viajes Compartidos

> **Conecta, Comparte y Viaja.** La solución integral para coordinar viajes grupales, gestionar gastos y crear comunidad.

## 🚀 
TravelConnect revoluciona la forma en que los grupos coordinan sus aventuras. Olvídate de los hilos de mensajes interminables y los Excel desordenados. Nuestra plataforma centraliza la planificación, la gestión de participantes y la experiencia de compartir gastos en una interfaz moderna y fluida. Diseñada para nómadas digitales y amigos que quieren viajar sin estrés.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura **Monorepo** separada en cliente y servidor, asegurando escalabilidad y mantenibilidad.

### C) Mapa del Proyecto

```text
/ (Raíz del Proyecto)
├── README.md                 # Documentación General
├── viajes-backend/           # Servidor API REST
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/           # Configuración de BD y constantes
│       ├── controllers/      # Lógica de negocio (Auth, Trips...)
│       ├── middlewares/      # Guards de Backend (AuthMiddleware)
│       ├── models/           # Modelos de BBDD (MySQL)
│       ├── routes/           # Definición de Endpoints
│       └── services/         # Servicios externos (Email)
│
└── viajes-frontend/          # Cliente Angular SPA
    ├── package.json
    └── src/
        ├── app/
        │   ├── components/   # Componentes UI reutilizables
        │   ├── pages/        # Vistas principales (Home, Login, Perfil)
        │   ├── services/     # Comunicación HTTP con Backend
        │   └── models/       # Interfaces TypeScript
        └── environments/     # Configuración de URLs (Dev/Prod)
```

---

## 🔌 Backend API (Servidor)

Este directorio contiene la lógica del servidor, API REST y conexión a base de datos de la plataforma.

### 🛠️ Stack Tecnológico

*   **Runtime**: Node.js (Recomendado v18+)
*   **Framework**: Express 5 (Beta)
*   **Base de Datos**: MySQL
*   **Seguridad**: JWT (JSON Web Tokens) & Bcrypt
*   **Validación**: Zod
*   **Emails**: Brevo / Nodemailer

### 📋 Prerrequisitos

*   Node.js instalado (`v18.x` o superior recomendado).
*   Servidor MySQL corriendo localmente o accesible remotamente.

### ⚙️ Configuración (.env)

El sistema requiere variables de entorno para funcionar.

1.  **Copiar el ejemplo**:
    ```bash
    cp .env.example .env
    ```
2.  **Editar `.env`** con tus credenciales. Aquí tienes la referencia de las variables clave:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto donde escuchará el servidor | `4000` |
| `DB_HOST` | Host de la base de datos MySQL | `localhost` / `127.0.0.1` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `tu_password` |
| `DB_NAME` | Nombre de la BBDD | `grupo5_viajes` |
| `JWT_SECRET` | Clave para firmar tokens. ¡Hazla larga! | `s3cr3t_k3y_...` |
| `FRONTEND_URL` | URL del cliente Angular (para CORS/Redirección) | `http://localhost:4200` |
| `BREVO_API_KEY` | API Key de Brevo para envío de emails | `xkeysib-...` |
| `EMAIL_FROM` | Remitente de los correos del sistema | `no-reply@appviajes.com` |

### 🚀 Scripts Disponibles

En la raíz de esta carpeta, puedes ejecutar:

#### Instalación
Instala todas las dependencias del proyecto.
```bash
npm install
```

#### Inicialización de Base de Datos (Importante)
Ejecuta el script de inicialización para crear tablas y/o sembrar datos iniciales (Seeds) para pruebas.
```bash
npm run db:init
```

#### Desarrollo
Arranca el servidor en modo desarrollo con _hot-reload_ (usando `nodemon`).
```bash
npm run dev
```

#### Producción
Arranca el servidor de forma estándar (usando `node`).
```bash
npm start
```

### 📡 Estructura de la API

Todas las rutas públicas y protegidas están prefijadas bajo `/api`.

#### A) Tabla de Endpoints Principales

| Método | Endpoint | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| **AUTH** | | | |
| `POST` | `/api/auth/register` | Registro de nuevo usuario | Pública |
| `POST` | `/api/auth/login` | Inicio de sesión (Retorna JWT) | Pública |
| **USUARIOS** | | | |
| `GET` | `/api/users/me` | Obtener perfil del usuario actual | 🔒 Bearer |
| `PUT` | `/api/users/me` | Actualizar perfil propio | 🔒 Bearer |
| **VIAJES** | | | |
| `GET` | `/api/trips` | Listar viajes (con filtros) | Pública |
| `POST` | `/api/trips` | Crear un nuevo viaje | 🔒 Bearer |
| `GET` | `/api/trips/:id` | Ver detalles de un viaje | Pública |
| `POST` | `/api/participants/join` | Unirse a un viaje existente | 🔒 Bearer |

#### B) 🧪 Chuleta de Usuarios de Prueba (Seed Data)

> **⚠️ Atención**: El script `db:init` crea la estructura de tablas pero **NO** inserta usuarios por defecto.
> Para probar la aplicación, debes registrar manualmente estos usuarios sugeridos para seguir el guion de la demo:

| Rol Sugerido | Email (Login) | Contraseña | Propósito |
| :--- | :--- | :--- | :--- |
| **El Organizador** | `creador@test.com` | `123456` | Usuario que crea viajes y gestiona participantes. |
| **El Viajero** | `viajero@test.com` | `123456` | Usuario que busca y se une a viajes. |
| **El Admin** | `admin@test.com` | `123456` | (Opcional) Para gestión global. |

---

## 👥 Autores

Este proyecto ha sido desarrollado como Trabajo de Fin de Máster (TFM) por:

*   **Maria Victoria Alvaro Franch**
*   **Josep Gerau Garcia Contreras**
*   **Javier Martinez Valiente**
*   **Manuel Enrique Ortiz Ros**
*   **Aurelio Romero Sanchez**
*   **Andrea Stefany Proano Muñoz**
