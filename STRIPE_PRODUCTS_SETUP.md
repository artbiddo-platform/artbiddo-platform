# 🛍️ Configuración de Productos en Stripe

## 📋 Crear Productos para Depósitos:

### 1. **Ir a Productos**
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products** → **Add product**

### 2. **Crear Producto "Depósito de Saldo"**
1. **Product name:** "Depósito de Saldo - ArtBiddo"
2. **Description:** "Recarga de saldo para participar en subastas"
3. **Pricing model:** One-time payment
4. **Price:** €10.00 (precio base)
5. **Currency:** EUR

### 3. **Configurar Precios Variables**
1. **Pricing:** Variable price
2. **Minimum amount:** €10
3. **Maximum amount:** €10,000
4. **Currency:** EUR

### 4. **Configurar Tax**
1. **Tax behavior:** Exclusive
2. **Tax code:** Digital goods
3. **Tax rates:** Configurar según tu país

## 🔧 Configuración Avanzada:

### **Webhook Events:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### **Customer Portal:**
1. **Settings** → **Customer Portal**
2. **Enable customer portal**
3. **Allow customers to:** Update payment methods

### **Payment Methods:**
1. **Settings** → **Payment methods**
2. **Enable:** Credit cards, Debit cards
3. **Disable:** PayPal (opcional)

## ✅ Verificar:
- ✅ Producto creado
- ✅ Precios configurados
- ✅ Tax configurado
- ✅ Payment methods habilitados
