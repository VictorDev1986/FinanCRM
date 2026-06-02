# FinanCRM

Sistema CRM para finanzas personales con React + Vite, Google Apps Script y Google Sheets.

## Requisitos
- Node.js 18+
- Cuenta de Google con acceso a Apps Script y Sheets

## Instalacion
1) Copia .env.example a .env y completa:
	- VITE_APPS_SCRIPT_URL
	- VITE_API_KEY
2) Instala dependencias:
	- npm install
3) Inicia el frontend:
	- npm run dev

## Backend Apps Script
Los archivos estan en apps-script.

Pasos rapidos:
1) Crea un proyecto de Apps Script y pega los archivos de apps-script.
2) Configura en Code.gs:
	- SHEET_ID
	- OPENAI_API_KEY
	- API_TOKEN
3) Publica como Web App (ejecutar como propietario, acceso a cualquiera).
4) Usa el URL en VITE_APPS_SCRIPT_URL.

Rutas esperadas:
- POST ?route=login
- POST ?route=listIncome
- POST ?route=createIncome
- POST ?route=listExpenses
- POST ?route=createExpense
- POST ?route=listBudgets
- POST ?route=createBudget
- POST ?route=listGoals
- POST ?route=createGoal
- POST ?route=listDebts
- POST ?route=createDebt
- POST ?route=uploadReceipt
- POST ?route=analyzeReceipt
- POST ?route=saveExpense

## Estructura Google Sheets
Hojas requeridas:
- Usuarios: id, nombre, email, password, rol
- Ingresos: id, fecha, categoria, descripcion, metodo_pago, monto, usuario, timestamp
- Gastos: id, fecha, categoria, descripcion, metodo_pago, monto, usuario, timestamp
- Presupuestos: id, categoria, limite, mes, usuario, timestamp
- Metas: id, nombre, objetivo, actual, fecha_objetivo, usuario, timestamp
- Deudas: id, nombre, saldo, interes, fecha_limite, estado, usuario, timestamp
- Configuracion: clave, valor, usuario, timestamp
- LogsIA: timestamp, prompt, respuesta, status

## Modulos principales
- Autenticacion y rutas protegidas
- Dashboard con KPIs y graficas
- Ingresos y gastos con filtros
- Presupuestos, metas y deudas
- Reportes con PDF y Excel
- Configuracion de tema y moneda
- IA para facturas con preview y confirmacion

## Notas
- No expongas OPENAI_API_KEY en el frontend.
- Para CORS, usa Apps Script como Web App publico.
