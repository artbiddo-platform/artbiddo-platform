# 🔗 Configuración de Stripe Connect

## 📋 Para que los vendedores reciban dinero:

### 1. **Activar Stripe Connect**
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Connect** → **Settings**
3. **Activate Connect** si no está activado

### 2. **Configurar Cuenta Conectada**
1. **Connect** → **Settings** → **Account settings**
2. **Business type:** Individual
3. **Country:** Spain
4. **Currency:** EUR
5. **Payout schedule:** Manual o automático

### 3. **Configurar Transferencias**
1. **Connect** → **Settings** → **Transfers**
2. **Automatic transfers:** Enabled
3. **Transfer schedule:** Daily
4. **Minimum transfer amount:** €10

### 4. **Configurar Comisiones**
1. **Connect** → **Settings** → **Application fees**
2. **Application fee:** 5% (configurado en el código)
3. **Fee calculation:** Percentage

## 💰 Flujo de Dinero:
1. **Comprador paga €1000**
2. **Stripe retiene €50** (tu comisión)
3. **€950 se transfiere** al vendedor automáticamente

## 🔧 Para Vendedores:
Los vendedores necesitarán:
1. Crear cuenta Stripe Connect
2. Verificar identidad
3. Conectar cuenta bancaria
4. Completar onboarding

## ✅ Verificar:
- ✅ Connect activado
- ✅ Transferencias configuradas
- ✅ Comisiones establecidas
- ✅ Cuenta bancaria conectada
