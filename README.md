# 📝 Gestor de Tareas PRO - Proyecto Sur Maderas


Este es un proyecto completo de **Gestor de Tareas** desarrollado como práctica profesional de desarrollo web.  
Se trabajó en:

- Separación de roles
- Organización de carpetas
- Manejo de datos persistentes
- Estructuración de código profesional
- Debug y resolución de problemas reales (rutas, localStorage, validaciones)

---

## 🚀 Descripción del proyecto

El Gestor de Tareas permite:

- ✅ Crear tareas desde la vista de Administrador.
- ✅ Asignar tareas a distintos empleados.
- ✅ Definir prioridad numérica de cada tarea (del 1 al 6).
- ✅ Filtrar tareas por pendientes, completadas o todas.
- ✅ Mostrar contador de tareas pendientes por cada empleado.
- ✅ Los empleados sólo pueden ver y completar sus propias tareas.
- ✅ Persistencia de datos utilizando `localStorage`.
- ✅ Separación completa entre vista de Administrador y vista de Empleado.
- ✅ Navegación completa desde un menú inicial.

---

## ⚙️ Tecnologías utilizadas

- HTML5
- CSS3 + SCSS (modularizado)
- JavaScript Vanilla (puro, sin frameworks)
- LocalStorage para persistencia
- Git & GitHub para control de versiones

---

## 🎯 Funcionalidades detalladas

### ✅ Administrador (`admin.html`)

- Crea tareas con título, descripción, responsable y prioridad.
- Filtra tareas por estado: todas, pendientes o completadas.
- Ordena las tareas por prioridad numérica (más baja = mayor prioridad).
- Muestra contador de tareas pendientes por cada empleado.
- Puede eliminar tareas.
- Puede marcar tareas como completadas o pendientes.
- Persistencia automática en `localStorage`.

### ✅ Empleados (`empleado.html`)

- Seleccionan su propio nombre (dropdown fijo).
- Ven sólo sus tareas asignadas.
- Marcan sus tareas como completadas o pendientes.
- No pueden crear, eliminar ni modificar otras tareas.

### ✅ Menú inicial (`index.html`)

- Permite ingresar a cualquiera de los dos perfiles:
  - Administración
  - Empleado

---

Desarrollador: Matías Rojo

Localidad: 🇦🇷 Argentina

Proyecto realizado como práctica profesional de desarrollo full vanilla frontend.

