# 🎨 ArtBiddo - Plataforma de Subastas de Arte

Una plataforma moderna y completa para subastas de arte con panel de administración, sistema de pagos y gestión de contenido.

## 🚀 Deploy en Vercel

### Estado Actual
- ✅ **Build exitoso** - Listo para producción
- ✅ **Panel de administración** - CMS completo
- ✅ **Base de datos PostgreSQL** - Configurada para Neon
- ✅ **Variables de entorno** - Preparadas para Vercel

### Deploy Rápido

1. **Crear base de datos en Neon:**
   - Ve a [neon.tech](https://neon.tech)
   - Crea un proyecto gratuito
   - Copia la URL de conexión

2. **Subir a GitHub:**
```bash
   git remote add origin https://github.com/tu-usuario/artbiddo-platform.git
   git push -u origin main
   ```

3. **Deploy en Vercel:**
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno
   - Deploy automático

### Variables de Entorno (Vercel)
```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-super-seguro
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
```

## 🎯 Funcionalidades

### Panel de Administración
- 📄 **Gestión de contenido** - CMS completo
- 👥 **Gestión de usuarios** - Administración de usuarios
- 🎨 **Gestión de subastas** - Control de obras de arte
- 📊 **Reportes** - Analytics y estadísticas
- ⚙️ **Configuración** - Ajustes del sitio

### Funcionalidades Principales
- 🔐 **Autenticación** - Login/registro seguro
- 💳 **Sistema de pagos** - Integración con Stripe
- 🎯 **Subastas en tiempo real** - Pujas en vivo
- 📱 **Responsive** - Diseño adaptativo
- 🚀 **Performance** - Optimizado para producción

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **Base de datos:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Autenticación:** NextAuth.js
- **Pagos:** Stripe
- **Deploy:** Vercel

## 📁 Estructura del Proyecto

```
auction-master/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   └── ...                # Páginas públicas
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── prisma/               # Schema y migraciones
└── public/               # Archivos estáticos
```

## 🔗 URLs Importantes

- **Sitio principal:** `/`
- **Panel admin:** `/admin/content`
- **Login admin:** `/admin/login`
- **Gestión usuarios:** `/admin/users`
- **Gestión subastas:** `/admin/auctions`

## 📚 Documentación

- [Guía de Deploy](DEPLOY_INSTRUCTIONS.md)
- [Configuración Neon](NEON_SETUP.md)
- [Configuración Stripe](STRIPE_SETUP.md)
- [Guía CMS](CMS_GUIDE.md)

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Base de datos
npx prisma db push
npx prisma db seed

# Deploy
git add .
git commit -m "Update"
git push
```

## 📞 Soporte

Para soporte técnico o preguntas sobre el deploy, revisa la documentación en los archivos `.md` del proyecto.

---

**¡Listo para el deploy en Vercel!** 🎉
