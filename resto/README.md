Primer Exámen Final - Programación Web Frontend
Sistema de Gestión de Reservas para Restaurantes
Guía de Implementación y Uso

Integrantes del Equipo
• Sebastián Eduardo Martínez Mendoza (Coordinador) - CI: 4943941
• Alexis Gastón Cañete Agüero - CI: 6004159
• Mateo Brizuela

---

---

INSTRUCCIONES DE INSTALACIÓN

1. Requisitos del Sistema
   Versión de Node.js requerida: 24.11.1 o superior
   Versión de npm utilizada: 11.6.2
   Angular CLI: versión 20.3.10

   Instalación de Node.js:
   • Windows: obtener desde https://nodejs.org (versión LTS recomendada)
   • Linux/macOS: usar nvm para gestionar versiones de Node

   Verificar instalación correcta ejecutando:
   node -v
   npm -v
   ng version

2. Instalación de Angular CLI
   Ejecutar en terminal (instalación global, una sola vez):
   npm install -g @angular/cli

3. Configuración del Proyecto
   • Ubicar la carpeta del proyecto (extraer archivo comprimido si corresponde)
   • Abrir carpeta con Visual Studio Code u otro editor compatible
   • Asegurarse de estar en el directorio raíz del proyecto

4. Instalación de Dependencias
   Dentro del directorio del proyecto, ejecutar:
   npm install
   Este comando descarga todos los paquetes necesarios especificados en package.json

5. Ejecución del Servidor de Desarrollo
   Iniciar aplicación con el comando:
   npm start
   o alternativamente:
   ng serve

   Acceder desde navegador en: http://localhost:4200/

6. Gestión de Datos
   El sistema utiliza localStorage del navegador para persistencia de datos.
   No requiere configuración de base de datos externa.

   Para resetear información almacenada:
   • Abrir navegador en el sitio
   • Presionar F12 para abrir herramientas de desarrollo
   • Ir a pestaña Application → Local Storage
   • Eliminar claves del dominio localhost:4200
   • Refrescar página (F5)

---

ESTRUCTURA DEL PROYECTO

resto/
├── angular.json // Configuración de Angular
├── package.json // Dependencias del proyecto
├── tsconfig.json // Configuración TypeScript global
├── tsconfig.app.json // Configuración TypeScript para app
│
├── src/
│ ├── main.ts // Punto de entrada de la aplicación
│ ├── index.html // Página HTML principal
│ ├── styles.css // Estilos globales
│ │
│ ├── app/
│ │ ├── app.ts // Componente raíz
│ │ ├── app.html // Template principal
│ │ ├── app.routes.ts // Definición de rutas
│ │ ├── app.config.ts // Configuración de la app
│ │
│ │ ├── models/ // Modelos e interfaces
│ │ │ ├── restaurante.ts
│ │ │ ├── zona.ts
│ │ │ ├── mesa.ts
│ │ │ ├── reserva.ts
│ │ │ └── horario.ts
│ │
│ │ ├── services/ // Servicios de lógica y datos
│ │ │ ├── restauranteService.ts
│ │ │ ├── zonaService.ts
│ │ │ ├── mesaService.ts
│ │ │ ├── reservaService.ts
│ │ │ └── horarioService.ts
│ │
│ │ └── pages/ // Componentes de páginas
│ │ ├── home/
│ │ │ ├── home.ts
│ │ │ ├── home.html
│ │ │ └── home.css
│ │ │
│ │ ├── restaurantes/
│ │ │ ├── restaurantes.ts
│ │ │ ├── restaurantes.html
│ │ │ └── restaurantes.css
│ │ │
│ │ ├── zonas/
│ │ │ ├── zonas.ts
│ │ │ ├── zonas.html
│ │ │ └── zonas.css
│ │ │
│ │ ├── mesas/
│ │ │ ├── mesas.ts
│ │ │ ├── mesas.html
│ │ │ └── mesas.css
│ │ │
│ │ ├── horarios/
│ │ │ ├── horarios.ts
│ │ │ ├── horarios.html
│ │ │ └── horarios.css
│ │ │
│ │ ├── crear-reserva/
│ │ │ ├── crear-reserva.ts
│ │ │ ├── crear-reserva.html
│ │ │ └── crear-reserva.css
│ │ │
│ │ └── reservas/
│ │ ├── reservas.ts
│ │ ├── reservas.html
│ │ └── reservas.css

---

FUNCIONALIDADES DEL SISTEMA

1. GESTIÓN DE RESTAURANTES
   • Crear nuevos restaurantes
   • Editar información existente
   • Eliminar restaurantes (solo si no tienen zonas asociadas)
   • Visualizar listado completo

2. ADMINISTRACIÓN DE ZONAS
   • Agregar zonas vinculadas a restaurantes
   • Modificar datos de zonas
   • Eliminar zonas (solo si no tienen mesas asignadas)
   • Gestionar horarios disponibles por zona

3. CONTROL DE MESAS
   • Registrar mesas con capacidad específica
   • Asignar mesas a zonas determinadas
   • Editar información de mesas
   • Eliminar mesas del sistema

4. CONFIGURACIÓN DE HORARIOS
   • Establecer horarios de atención por zona
   • Formato de 24 horas (00:00 a 23:00)
   • Modificar horarios existentes
   • Eliminar horarios obsoletos

5. SISTEMA DE RESERVAS
   Creación de Reservas:
   • Selección de restaurante
   • Elección de zona disponible
   • Selección de fecha (no permite fechas pasadas)
   • Elección de horario según disponibilidad
   • Ingreso de cantidad de personas
   • Registro de datos del cliente (nombre, apellido, teléfono)
   • Asignación automática de mesa según disponibilidad y capacidad

   Consulta de Reservas:
   • Visualización de todas las reservas
   • Filtros por restaurante
   • Filtros por zona
   • Filtros por fecha
   • Información detallada de cada reserva
   • Opción de cancelar reservas

6. VALIDACIONES IMPLEMENTADAS
   • No permite reservas en fechas anteriores a hoy
   • Verifica disponibilidad real de mesas
   • Considera capacidad mínima según cantidad de personas
   • Previene asignación de mesas ya reservadas
   • Selecciona automáticamente la mesa más adecuada

---

NAVEGACIÓN DEL SISTEMA

Rutas disponibles:
• / → Página principal (Home)
• /restaurantes → Gestión de restaurantes
• /zonas → Administración de zonas
• /mesas → Control de mesas
• /horarios → Configuración de horarios
• /reservas/crear → Crear nueva reserva
• /reservas → Listado y filtrado de reservas

---

TECNOLOGÍAS UTILIZADAS

• Angular 20.3.10 (Standalone Components)
• TypeScript 5.x
• HTML5 y CSS3
• LocalStorage API para persistencia
• Reactive Forms (FormsModule)
• Angular Router para navegación

---

NOTAS IMPORTANTES

• El sistema opera completamente en el navegador (frontend)
• Los datos se mantienen mientras no se limpie localStorage
• Compatible con navegadores modernos (Chrome, Firefox, Edge, Safari)
• Diseño responsive adaptable a diferentes tamaños de pantalla
• Interfaz intuitiva con validaciones en tiempo real

---

FLUJO DE USO RECOMENDADO

1. Configuración Inicial:
   a) Crear uno o más restaurantes
   b) Agregar zonas a los restaurantes
   c) Configurar horarios para cada zona
   d) Registrar mesas asignadas a cada zona

2. Gestión de Reservas:
   a) Acceder a "Nueva Reserva" desde el Home
   b) Seguir el flujo guiado de 7 pasos
   c) Confirmar cuando se encuentre mesa disponible
   d) Consultar reservas desde el listado con filtros

3. Mantenimiento:
   • Actualizar horarios según temporada
   • Modificar capacidad de mesas si es necesario
   • Revisar y cancelar reservas según políticas del negocio

4)Instalar dependencias. Dentro de la carpeta del proyecto ejecutar el comando:
npm install

5)Ejecutar en modo desarrollo para iniciar el proyecto, mediante el comando:
npm start
Abrir el navegador en: http://localhost:4200/

6. Persistencia
   La app no usa backend: guarda todo en localStorage del navegador.
   Para “reiniciar” los datos:
   Abrir el sitio.
   Herramientas del navegador → Application/Almacenamiento → Local Storage.
   Borrar claves y Refrescar.

7)Estructura básica del proyecto
sistema-reservas-restaurantes/
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
│
├── src/
│ ├── main.ts
│ ├── index.html
│ ├── styles.css
│
│ ├── app/
│ │ ├── app.component.ts
│ │ ├── app.component.html
│ │ ├── app.routes.ts
│ │ ├── app.config.ts
│ │
│ │ ├── modelos/ //Contiene Interfaces principales
│ │ │ ├── restaurante.model.ts
│ │ │ ├── zona.model.ts
│ │ │ ├── mesa.model.ts
│ │ │ ├── reserva.model.ts
│ │ │ ├── horario-zona.model.ts
│ │
│ │ ├── servicios/ //Contiene Lógica + LocalStorage
│ │ │ ├── datos-reservas.service.ts
│ │
│ │ ├── componentes/ //Contiene Pantallas del Sistema
│ │ │ ├── restaurantes/
│ │ │ │ ├── restaurantes.component.ts
│ │ │ │ ├── restaurantes.component.html
│ │ │
│ │ │ ├── zonas/
│ │ │ │ ├── zonas.component.ts
│ │ │ │ ├── zonas.component.html
│ │ │
│ │ │ ├── mesas/
│ │ │ │ ├── mesas.component.ts
│ │ │ │ ├── mesas.component.html
│ │ │
│ │ │ ├── horarios/
│ │ │ │ ├── horarios-zona.component.ts
│ │ │ │ ├── horarios-zona.component.html
│ │ │
│ │ │ ├── reservas/
│ │ │ │ ├── reservas-nueva.component.ts
│ │ │ │ ├── reservas-nueva.component.html
│ │ │
│ │ │ ├── reservas-listado/
│ │ │ │ ├── reservas-listado.component.ts
│ │ │ │ ├── reservas-listado.component.html
