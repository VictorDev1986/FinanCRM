Backend Apps Script

1) Crea un proyecto en Google Apps Script y pega los archivos de la carpeta apps-script.
2) Configura SHEET_ID y OPENAI_API_KEY en Code.gs.
3) Publica como Web App (ejecutar como propietario, acceso a cualquiera).
4) Usa el URL del Web App en .env.

Rutas
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

Notas
- El token se envia como apiKey en el body.
- La hoja LogsIA guarda prompt y respuesta.
