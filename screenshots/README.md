# 📸 Screenshots Documentation

Visual guide for MongoDB Restaurant Directory API setup and operations.

## �️ Screenshot Index

### Database Setup (Sprint 1)
| File | Description | Sprint | Status |
|------|-------------|--------|--------|
| [`connection-setup.png`](./connection-setup.png) | MongoDB Atlas connection configuration | 1 | ✅ |
| [`connection-established.png`](./connection-established.png) | Successful database connection | 1 | ✅ |
| [`database-collection-creation.png`](./database-collection-creation.png) | Creating database and collection | 1 | ✅ |
| [`csv-import-command.png`](./csv-import-command.png) | CSV import process | 1 | ✅ |
| [`csv-import-command-2.png`](./csv-import-command-2.png) | Alternative import method | 1 | ✅ |
| [`data-view-compass.png`](./data-view-compass.png) | Viewing data in MongoDB Compass | 1 | ✅ |
| [`create-indexes-command.png`](./create-indexes-command.png) | Creating performance indexes | 1 | ✅ |

### API Testing (Sprint 2)
| File | Description | Sprint | Status |
|------|-------------|--------|--------|
| `api-get-all-restaurants.png` | GET all restaurants endpoint | 2 | 🔄 Pending |
| `api-post-create-restaurant.png` | POST create restaurant endpoint | 2 | 🔄 Pending |
| `api-put-update-restaurant.png` | PUT update restaurant endpoint | 2 | 🔄 Pending |
| `api-delete-restaurant.png` | DELETE restaurant endpoint | 2 | 🔄 Pending |
| `api-search-functionality.png` | Search and filter testing | 2 | 🔄 Pending |
| `api-geospatial-query.png` | Nearby restaurants query | 2 | 🔄 Pending |
| `postman-collection-overview.png` | Postman test collection | 2 | 🔄 Pending |

### 2. connection-established.png  
**Descripción:** Conexión establecida exitosamente
- Compass conectado a MongoDB Atlas
- Cluster visible y accesible
- Estado de conexión activo

### 3. database-collection-creation.png
**Descripción:** Creación de base de datos y colección
- Base de datos: `tattler-db` 
- Colección: `restaurants`
- Estructura inicial creada

### 4. csv-import-command.png
**Descripción:** Comando de importación CSV (Paso 1)
- Terminal/shell ejecutando script de importación
- Inicio del proceso de importación
- Preparación de datos CSV

### 5. csv-import-command-2.png
**Descripción:** Comando de importación CSV (Paso 2)
- Continuación del proceso de importación
- Datos siendo insertados desde CSV
- Confirmación de importación exitosa

### 6. create-indexes-command.png
**Descripción:** Comando de creación de índices
- Ejecución del script create-indexes.js
- 18 índices siendo creados
- Optimización de consultas

### 7. data-view-compass.png
**Descripción:** Vista final de datos en Compass
- 5 restaurantes importados exitosamente
- Datos visibles en la colección restaurants
- Estructura completa de documentos

## ✅ Estado del Sprint 1:
- **Conexión:** Establecida ✅
- **Base de datos:** tattler-db creada ✅  
- **Colección:** restaurants creada ✅
- **Datos:** 5 restaurantes importados ✅
- **Índices:** 18 índices optimizados ✅
- **Verificación:** Datos visibles en Compass ✅