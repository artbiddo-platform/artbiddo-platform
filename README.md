# ArtBiddo - Plataforma de Subastas de Arte

Plataforma profesional de subastas de arte contemporáneo con obras originales, serigrafías, litografías y aguafuertes.

## 🚀 Características

- **Catálogo de Obras**: Obras de arte profesionales con imágenes de alta calidad
- **Sistema de Pujas**: Pujas en tiempo real con validación de saldo
- **Autenticación**: Sistema completo de registro y login de usuarios
- **Categorías**: Serigrafías, Litografías, Aguafuertes y Obras Únicas
- **Diseño Responsive**: Optimizado para móvil y desktop
- **Panel de Administración**: Gestión completa de usuarios y subastas

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **ORM**: Prisma
- **Autenticación**: JWT con bcryptjs
- **Pagos**: Stripe (configurado)
- **Deployment**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd auction-master
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Configurar la base de datos**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🌐 Despliegue en Vercel

### 1. Preparación

- Asegúrate de que el build funcione localmente: `npm run build`
- Verifica que todas las variables de entorno estén configuradas

### 2. Variables de Entorno en Vercel

Configura las siguientes variables en el dashboard de Vercel:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.vercel.app"
JWT_SECRET="tu-super-secreto-jwt-muy-seguro-2024"
```

### 3. Base de Datos de Producción

Para producción, se recomienda usar PostgreSQL:

1. Crear una base de datos PostgreSQL (Vercel Postgres, Supabase, etc.)
2. Actualizar `DATABASE_URL` en Vercel
3. Ejecutar migraciones: `npx prisma db push`
4. Poblar datos: `npm run db:seed`

### 4. Despliegue

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

## 👥 Usuarios de Prueba

- **Admin**: `admin@artbiddo.com` / `admin123456`
- **Vendedor**: `carlos.rodriguez@email.com` / `password123`
- **Comprador**: `ana.lopez@email.com` / `password123`

## 📱 URLs Principales

- **Inicio**: `/`
- **Subastas**: `/subastas`
- **Login**: `/login`
- **Registro**: `/register`
- **Admin**: `/admin/login`

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run db:seed` - Poblar base de datos
- `npx prisma studio` - Interfaz de base de datos

## 📊 Estado del Proyecto

### ✅ Completado
- Frontend completo y responsive
- APIs de autenticación
- Sistema de pujas
- Catálogo de obras
- Panel de administración
- Diseño profesional

### 🔄 En Desarrollo
- Integración completa con Stripe
- Notificaciones en tiempo real
- Sistema de mensajería

### 📋 Pendiente
- Despliegue en producción
- Configuración de dominio personalizado
- Optimizaciones de rendimiento

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte técnico, contacta a: info@artbiddo.com
