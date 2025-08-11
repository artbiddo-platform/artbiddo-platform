# 🎨 Guía del Sistema de Gestión de Contenido (CMS)

## 📋 Descripción General

El CMS de ArtBiddo te permite editar textos, imágenes y configuraciones del sitio web sin necesidad de modificar código. Es un sistema completo y fácil de usar para administradores.

## 🚀 Acceso al CMS

1. **Inicia sesión como administrador**:
   - Ve a `/admin/login`
   - Usa las credenciales: `admin@artbiddo.com` / `admin123456`

2. **Accede al CMS**:
   - En el menú lateral, haz clic en "🎨 Contenido"
   - O ve directamente a `/admin/content`

## 📊 Tipos de Contenido

### 1. 📄 Contenido de Páginas
Contenido específico para cada página del sitio:

- **Página**: Identificador de la página (home, about, contact, etc.)
- **Sección**: Sección específica de la página (hero, features, footer, etc.)
- **Título**: Título del contenido
- **Subtítulo**: Subtítulo opcional
- **Descripción**: Descripción breve
- **Contenido**: Contenido principal (texto, HTML)
- **Imagen**: URL de imagen opcional
- **Enlace**: Enlace opcional
- **Orden**: Orden de aparición
- **Activo**: Si está visible o no

### 2. ⚙️ Configuraciones del Sitio
Configuraciones globales del sitio web:

- **Clave**: Identificador único (site_name, contact_email, etc.)
- **Valor**: Valor de la configuración
- **Tipo**: Tipo de dato (text, json, boolean, number)
- **Descripción**: Descripción de la configuración
- **Público**: Si es visible para usuarios o solo para admin

### 3. 🧱 Bloques de Contenido
Bloques reutilizables de contenido:

- **Nombre**: Identificador único (hero_title, about_description, etc.)
- **Título**: Título del bloque
- **Contenido**: Contenido del bloque
- **Tipo**: Tipo de contenido (TEXT, HTML, IMAGE, VIDEO, JSON)
- **Metadatos**: Datos adicionales en formato JSON
- **Activo**: Si está visible o no

## 🎯 Uso en el Código

### Componente DynamicContent

```tsx
import DynamicContent from '@/components/DynamicContent';

// Mostrar un bloque de contenido
<DynamicContent 
  blockName="hero_title" 
  fallback="ARTBIDDO"
  as="h1"
  className="text-4xl font-bold"
/>

// Mostrar una configuración del sitio
<DynamicContent 
  settingKey="contact_email" 
  fallback="info@artbiddo.com"
  as="span"
/>
```

### API Pública

```javascript
// Obtener un bloque específico
fetch('/api/content?block=hero_title')

// Obtener contenido de una página
fetch('/api/content?page=home&section=hero')

// Obtener todas las configuraciones públicas
fetch('/api/content')
```

## 📝 Ejemplos de Uso

### 1. Editar el Título Principal

1. Ve al CMS → Pestaña "Bloques"
2. Busca el bloque "hero_title"
3. Haz clic en "Editar"
4. Cambia el contenido a tu nuevo título
5. Guarda los cambios

### 2. Cambiar Información de Contacto

1. Ve al CMS → Pestaña "Configuración"
2. Busca la configuración "contact_email"
3. Haz clic en "Editar"
4. Cambia el valor al nuevo email
5. Guarda los cambios

### 3. Modificar Contenido de la Página Principal

1. Ve al CMS → Pestaña "Páginas"
2. Busca la página "home" y sección "hero"
3. Haz clic en "Editar"
4. Modifica título, subtítulo, descripción o contenido
5. Guarda los cambios

## 🔧 Configuraciones Predefinidas

### Bloques de Contenido Iniciales

- `hero_title` - Título principal de la página de inicio
- `hero_subtitle` - Subtítulo principal
- `hero_description` - Descripción del hero
- `about_title` - Título de la sección "Sobre Nosotros"
- `about_description` - Descripción de la empresa
- `stats_sales` - Estadística de ventas anuales
- `stats_founded` - Año de fundación

### Configuraciones del Sitio

- `site_name` - Nombre del sitio web
- `site_description` - Descripción del sitio
- `contact_email` - Email de contacto
- `contact_phone` - Teléfono de contacto
- `contact_address` - Dirección de contacto
- `social_facebook` - Enlace a Facebook
- `social_twitter` - Enlace a Twitter
- `social_instagram` - Enlace a Instagram

## 🛠️ Funcionalidades del CMS

### ✅ Características Implementadas

- **Gestión completa de contenido**: Crear, editar, eliminar
- **Interfaz intuitiva**: Tabs organizados por tipo de contenido
- **Validación de datos**: Verificación de campos requeridos
- **Autenticación segura**: Solo administradores pueden acceder
- **APIs RESTful**: Endpoints para gestión y consulta
- **Contenido dinámico**: Componente React para mostrar contenido
- **Fallbacks**: Contenido por defecto si no se encuentra

### 🔄 Próximas Funcionalidades

- **Editor WYSIWYG**: Editor visual para contenido HTML
- **Subida de imágenes**: Gestión de archivos multimedia
- **Versionado**: Historial de cambios
- **Plantillas**: Plantillas predefinidas para contenido
- **SEO**: Metadatos para SEO
- **Caché**: Sistema de caché para mejor rendimiento

## 🔒 Seguridad

- **Autenticación requerida**: Solo usuarios con rol ADMIN
- **Validación de entrada**: Todos los campos son validados
- **Sanitización**: Contenido HTML es sanitizado
- **Logs**: Todas las acciones son registradas
- **Backup**: Datos respaldados automáticamente

## 📞 Soporte

Si tienes problemas con el CMS:

1. **Verifica permisos**: Asegúrate de estar logueado como admin
2. **Revisa la consola**: Busca errores en las herramientas de desarrollador
3. **Contacta soporte**: Envía un email a info@artbiddo.com

---

**¡El CMS está listo para usar!** 🎉
