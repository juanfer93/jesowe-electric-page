# Jesowe Electric

Sitio web Next.js para King Electric, con un panel privado para editar el contenido del sitio sin modificar el código.

## Vista previa local con Docker

1. Copia `.env.example` a `.env.local` y configura las credenciales locales.
2. Ejecuta `docker compose up --build -d`.
3. Abre `http://localhost:3001/admin/login`.

Docker Compose guarda el contenido en un volumen llamado `jesowe-site-content`, por lo que sobrevive a reinicios del contenedor. `docker compose down` conserva el volumen. Haz una copia de respaldo antes de eliminar volúmenes.

## Variables para producción

Configura estas variables en el servicio donde se despliegue la aplicación. No subas `.env.local` ni contraseñas al repositorio.

| Variable | Requerida | Uso |
| --- | --- | --- |
| `ADMIN_USERNAME` | Sí | Usuario único de administración. |
| `ADMIN_PASSWORD_HASH` | Sí | Hash scrypt con formato `scrypt:<salt hexadecimal>:<hash hexadecimal>`. No admite la contraseña en texto claro. |
| `ADMIN_SESSION_SECRET` | Sí | Secreto aleatorio de al menos 32 caracteres para firmar las sesiones. |
| `ADMIN_CONTENT_PATH` | Recomendado | Ruta absoluta al archivo JSON dentro de almacenamiento persistente y escribible, por ejemplo `/app/.data/site-content.json`. |

Genera el hash de la contraseña con `node scripts/generate-admin-password-hash.mjs`; el texto de la contraseña no se muestra. Genera `ADMIN_SESSION_SECRET` con `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. Guarda ambos valores directamente en el gestor de variables/secretos del hosting.

En producción usa HTTPS y almacenamiento persistente para `ADMIN_CONTENT_PATH`. Si la plataforma reemplaza contenedores, el contenido no debe quedar únicamente en el filesystem temporal. La guía del editor está en [`docs/admin-user-manual.md`](docs/admin-user-manual.md).

## Alcance del panel

El panel permite editar detalles del negocio, navegación, textos, servicios, proyectos, reseñas e imágenes compatibles. Usa las secciones y el diseño ya definidos por el sitio; no modifica el código, el diseño general ni la configuración del servidor. Los cambios guardados aparecen inmediatamente en el sitio público.
