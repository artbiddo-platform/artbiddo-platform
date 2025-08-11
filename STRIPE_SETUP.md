# 🚀 Configuración de Stripe para ArtBiddo

## 📋 Pasos para configurar tu cuenta de Stripe:

### 1. **Obtener Claves de API**
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Inicia sesión en tu cuenta
3. Ve a **Developers** → **API Keys**
4. Copia las claves:
   - **Publishable key** (empieza con `pk_live_`)
   - **Secret key** (empieza con `sk_live_`)

### 2. **Configurar Variables de Entorno**
Reemplaza en el archivo `.env`:

```env
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

### 3. **Configurar Webhook**
1. En Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://tu-dominio.com/api/webhooks/stripe`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 4. **Configurar Cuenta Conectada (para vendedores)**
1. Ve a **Connect** → **Settings**
2. Configura las transferencias automáticas
3. Los vendedores necesitarán crear cuentas Stripe Connect

### 5. **Probar el Sistema**
1. Usa tarjetas de prueba en modo test
2. Verifica que los webhooks funcionen
3. Confirma que las comisiones se cobren correctamente

## 💰 Flujo de Dinero:
- **Usuario deposita €100** → Tu cuenta recibe €100
- **Venta de €1000** → Vendedor recibe €950, tú cobras €50
- **Comisión automática del 5%** en cada venta

## 🔒 Seguridad:
- Stripe maneja todos los datos de pago
- Nunca almacenamos información de tarjetas
- Cumplimiento PCI DSS automático
