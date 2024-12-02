# API con Node.js, Express y TypeScript

## 🚀 Características

- Estructura modular y escalable.
- Configuración con TypeScript.
- Scripts para desarrollo y producción.
- Manejo de errores centralizado.
- Variables de entorno con soporte para `.env`.

## 📦 Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/brayanyinlin/ts-api-rest-storage
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd ts-api-rest-storage
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

## 🛠️ Scripts

- **Desarrollo**: Inicia el servidor con recarga automática:
  ```bash
  npm run dev
  ```

- **Construcción**: Transpila TypeScript a JavaScript:
  ```bash
  npm run build
  ```

- **Producción**: Inicia la API en modo producción:
  ```bash
  npm start
  ```

- **Test**: Ejecuta pruebas (si están configuradas):
  ```bash
  npm test
  ```

## 📁 Estructura del Proyecto

```plaintext
src/
├── controllers/      # Controladores para manejar la lógica de negocio
├── routes/           # Definición de las rutas
├── middlewares/      # Middlewares personalizados
├── models/           # Modelos para interactuar con la base de datos
├── utils/            # Funciones reutilizables
└── index.ts         # Punto de entrada de la aplicación
```
