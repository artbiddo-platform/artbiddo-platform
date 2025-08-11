# 🔗 Configuración de Webhook en Stripe

## 📋 Pasos en Stripe Dashboard:

### 1. **Ir a Webhooks**
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Inicia sesión en tu cuenta
3. Ve a **Developers** → **Webhooks**

### 2. **Crear Endpoint**
1. Click **Add endpoint**
2. **Endpoint URL:** `https://tu-dominio.com/api/webhooks/stripe`
   - Para desarrollo local: `http://localhost:3001/api/webhooks/stripe`
3. **Events to send:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `account.updated` (para vendedores)

### 3. **Obtener Webhook Secret**
1. Después de crear el endpoint
2. Click en el endpoint creado
3. Copia el **Signing secret** (empieza con `whsec_`)
4. Añádelo a tu `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
   ```

### 4. **Probar Webhook**
1. En el endpoint, click **Send test webhook**
2. Selecciona `checkout.session.completed`
3. Click **Send test webhook**
4. Verifica que llegue a tu servidor

## 🔍 Verificar Configuración:
- ✅ Webhook creado
- ✅ Secret copiado
- ✅ Eventos configurados
- ✅ URL correcta
