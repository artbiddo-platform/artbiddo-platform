# 🐘 Configuración de Neon Database

## 📋 Pasos para crear la base de datos

### 1. Crear cuenta en Neon
1. Ve a [neon.tech](https://neon.tech)
2. Haz clic en "Start for Free"
3. Regístrate con GitHub o email

### 2. Crear proyecto
1. Haz clic en "Create New Project"
2. Elige un nombre: `artbiddo-platform`
3. Selecciona la región más cercana
4. Haz clic en "Create Project"

### 3. Obtener la URL de conexión
1. En el dashboard, ve a "Connection Details"
2. Copia la URL que aparece como:
   ```
   postgresql://[user]:[password]@[host]/[database]
   ```

### 4. Configurar variables en Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   ```
   DATABASE_URL=tu_url_de_neon_aqui
   ```

## 🔧 Configuración adicional

### Ejecutar migraciones
```bash
# En Vercel CLI o terminal local
npx prisma migrate deploy
```

### Ejecutar seed (opcional)
```bash
npx prisma db seed
```

## ✅ Verificación
- Base de datos creada ✅
- URL de conexión copiada ✅
- Variables configuradas en Vercel ✅
- Migraciones ejecutadas ✅

¡Listo para el deploy! 🎉
