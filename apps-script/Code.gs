const OPENAI_API_KEY = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY') || ''
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID') || ''
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('API_TOKEN') || ''

const SHEETS = {
  users: 'Usuarios',
  income: 'Ingresos',
  expenses: 'Gastos',
  budgets: 'Presupuestos',
  goals: 'Metas',
  debts: 'Deudas',
  settings: 'Configuracion',
  aiLogs: 'LogsIA',
}

function doPost(e) {
  try {
    const body = e?.postData?.contents ? JSON.parse(e.postData.contents) : {}
    const route = normalizeRoute(e?.parameter?.route || body.route || e?.pathInfo)
    const apiKey = body.apiKey || e?.parameter?.apiKey

    if (!isAuthorized(apiKey)) {
      return respond({ ok: false, error: 'Unauthorized' }, 401)
    }

    switch (route) {
      case 'login':
        return respond(handleLogin(body))
      case 'register':
        return respond(handleRegister(body))
      case 'listIncome':
        return respond(handleListIncome(body))
      case 'createIncome':
        return respond(handleCreateIncome(body))
      case 'listExpenses':
        return respond(handleListExpenses(body))
      case 'createExpense':
        return respond(handleCreateExpense(body))
      case 'listBudgets':
        return respond(handleListBudgets(body))
      case 'createBudget':
        return respond(handleCreateBudget(body))
      case 'listGoals':
        return respond(handleListGoals(body))
      case 'createGoal':
        return respond(handleCreateGoal(body))
      case 'listDebts':
        return respond(handleListDebts(body))
      case 'createDebt':
        return respond(handleCreateDebt(body))
      case 'uploadReceipt':
        return respond(handleUploadReceipt(body))
      case 'analyzeReceipt':
        return respond(handleAnalyzeReceipt(body))
      case 'saveExpense':
        return respond(handleSaveExpense(body))
      default:
        return respond({ ok: false, error: 'Unknown route' }, 404)
    }
  } catch (error) {
    return respond({ ok: false, error: error.message }, 500)
  }
}

function normalizeRoute(value) {
  if (!value) return ''
  return String(value).replace(/^\/+/, '')
}

function isAuthorized(token) {
  if (!API_TOKEN) return true
  return token === API_TOKEN
}

function handleLogin(body) {
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const sheet = getSheet(SHEETS.users)
  const rows = sheet.getDataRange().getValues()
  const headers = rows.shift()

  const emailIndex = headers.indexOf('email')
  const passwordIndex = headers.indexOf('password')
  const nameIndex = headers.indexOf('nombre')
  const roleIndex = headers.indexOf('rol')

  if (emailIndex === -1 || passwordIndex === -1) {
    return { ok: false, error: 'Headers requeridos: email, password' }
  }

  const match = rows.find((row) => {
    return (
      String(row[emailIndex]).toLowerCase() === email &&
      String(row[passwordIndex]) === password
    )
  })

  if (!match) {
    return { ok: false, error: 'Credenciales invalidas' }
  }

  return {
    ok: true,
    user: {
      email,
      name: match[nameIndex] || 'Usuario',
      role: match[roleIndex] || 'Usuario',
    },
  }
}

function handleRegister(body) {
  const nombre = String(body.nombre || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return { ok: false, error: 'Email y password requeridos' }
  }

  const sheet = getSheet(SHEETS.users)
  const rows = sheet.getDataRange().getValues()
  const headers = rows.shift()

  const emailIndex = headers.indexOf('email')
  const passwordIndex = headers.indexOf('password')
  const nameIndex = headers.indexOf('nombre')
  const roleIndex = headers.indexOf('rol')
  const idIndex = headers.indexOf('id')

  if (emailIndex === -1 || passwordIndex === -1) {
    return { ok: false, error: 'Headers requeridos: email, password' }
  }

  const exists = rows.some((row) => String(row[emailIndex]).toLowerCase() === email)
  if (exists) {
    return { ok: false, error: 'Email ya registrado' }
  }

  const row = headers.map((header, index) => {
    if (index === idIndex) return Utilities.getUuid()
    if (index === nameIndex) return nombre || 'Usuario'
    if (index === emailIndex) return email
    if (index === passwordIndex) return password
    if (index === roleIndex) return 'Usuario'
    return ''
  })

  sheet.appendRow(row)
  return { ok: true }
}

function handleUploadReceipt(body) {
  const fileName = body.fileName || `receipt-${new Date().toISOString()}`
  const mimeType = body.imageMime || 'image/png'
  const base64 = body.imageBase64

  if (!base64) {
    return { ok: false, error: 'Missing image data' }
  }

  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName)
  const file = DriveApp.createFile(blob)
  return { ok: true, data: { fileId: file.getId(), fileUrl: file.getUrl() } }
}

function handleListIncome(body) {
  return listRecords(SHEETS.income, body?.usuario)
}

function handleCreateIncome(body) {
  const income = normalizeIncome(body.income || {})
  return appendRecord(SHEETS.income, income)
}

function handleListExpenses(body) {
  return listRecords(SHEETS.expenses, body?.usuario)
}

function handleCreateExpense(body) {
  return handleSaveExpense({ expense: body.expense })
}

function handleListBudgets(body) {
  return listRecords(SHEETS.budgets, body?.usuario)
}

function handleCreateBudget(body) {
  const budget = normalizeBudget(body.budget || {})
  return appendRecord(SHEETS.budgets, budget)
}

function handleListGoals(body) {
  return listRecords(SHEETS.goals, body?.usuario)
}

function handleCreateGoal(body) {
  const goal = normalizeGoal(body.goal || {})
  return appendRecord(SHEETS.goals, goal)
}

function handleListDebts(body) {
  return listRecords(SHEETS.debts, body?.usuario)
}

function handleCreateDebt(body) {
  const debt = normalizeDebt(body.debt || {})
  return appendRecord(SHEETS.debts, debt)
}

function handleAnalyzeReceipt(body) {
  const base64 = body.imageBase64
  const mimeType = body.imageMime || 'image/jpeg'

  if (!base64) {
    return { ok: false, error: 'Missing image data' }
  }

  const prompt =
    'Analiza esta factura y responde SOLO en JSON con: negocio, fecha, total, categoria, productos, metodo_pago. ' +
    'Categorias posibles: Alimentacion, Transporte, Salud, Entretenimiento, Servicios, Compras, Educacion, Hogar, Otros.'

  const payload = {
    model: 'gpt-4o',
    input: [
      {
        role: 'system',
        content: [{ type: 'text', text: 'Eres un analista de facturas.' }],
      },
      {
        role: 'user',
        content: [
          { type: 'input_text', text: prompt },
          {
            type: 'input_image',
            image_url: `data:${mimeType};base64,${base64}`,
          },
        ],
      },
    ],
  }

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/responses', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  })

  const raw = response.getContentText()
  const status = response.getResponseCode()
  if (status >= 400) {
    logAi(prompt, raw, status)
    return { ok: false, error: 'OpenAI request failed', raw }
  }

  const parsed = JSON.parse(raw)
  const outputText = extractOutputText(parsed)
  let data = {}

  try {
    data = JSON.parse(outputText)
  } catch (error) {
    data = { error: 'Invalid JSON from model', raw: outputText }
  }

  logAi(prompt, outputText, status)

  return { ok: true, data }
}

function extractOutputText(parsed) {
  const output = parsed.output || []
  for (var i = 0; i < output.length; i++) {
    const content = output[i].content || []
    for (var j = 0; j < content.length; j++) {
      if (content[j].type === 'output_text') {
        return content[j].text || ''
      }
    }
  }
  return parsed.output_text || ''
}

function handleSaveExpense(body) {
  const expense = normalizeExpense(body.expense || {})
  return appendRecord(SHEETS.expenses, expense)
}

function logAi(prompt, response, status) {
  const sheet = getSheet(SHEETS.aiLogs)
  sheet.appendRow([new Date().toISOString(), prompt, response, status])
}

function getSheet(name) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  let sheet = spreadsheet.getSheetByName(name)
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name)
  }
  return sheet
}

function listRecords(sheetName, usuario) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  if (!values.length) {
    return { ok: true, data: [] }
  }

  const headers = values[0].map((header) => String(header || '').trim())
  if (headers.every((header) => !header)) {
    return { ok: true, data: [] }
  }

  const userFilter = usuario ? String(usuario).trim().toLowerCase() : ''
  const usuarioIndex = headers.indexOf('usuario')
  if (userFilter && usuarioIndex === -1) {
    return { ok: false, error: `Falta la columna usuario en la hoja ${sheetName}` }
  }
  const rows = values
    .slice(1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .filter((row) => {
      if (!userFilter || usuarioIndex === -1) return true
      return String(row[usuarioIndex] || '').trim().toLowerCase() === userFilter
    })
  const data = rows.map((row) => {
    const record = {}
    headers.forEach((header, index) => {
      if (!header) return
      record[header] = row[index]
    })
    return record
  })

  return { ok: true, data }
}

function appendRecord(sheetName, record) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  if (!values.length) {
    return { ok: false, error: 'Headers missing in sheet' }
  }

  const headers = values[0].map((header) => String(header || '').trim())
  if (headers.every((header) => !header)) {
    return { ok: false, error: 'Headers missing in sheet' }
  }

  const normalized = Object.assign({}, record)
  if (normalized.usuario && headers.indexOf('usuario') === -1) {
    return { ok: false, error: `Falta la columna usuario en la hoja ${sheetName}` }
  }
  if (headers.indexOf('id') !== -1 && !normalized.id) {
    normalized.id = Utilities.getUuid()
  }
  if (headers.indexOf('timestamp') !== -1 && !normalized.timestamp) {
    normalized.timestamp = new Date().toISOString()
  }

  const row = headers.map((header) => {
    if (!header) return ''
    const value = normalized[header]
    return value === undefined || value === null ? '' : value
  })

  sheet.appendRow(row)
  return { ok: true }
}

function normalizeIncome(data) {
  return {
    id: data.id,
    fecha: data.fecha || data.date || '',
    categoria: data.categoria || data.category || 'Otros',
    descripcion: data.descripcion || data.description || '',
    metodo_pago: data.metodo_pago || data.method || '',
    monto: data.monto || data.amount || '',
    usuario: data.usuario || '',
    timestamp: data.timestamp,
  }
}

function normalizeExpense(data) {
  return {
    id: data.id,
    fecha: data.fecha || data.date || '',
    categoria: data.categoria || data.category || 'Otros',
    descripcion: data.descripcion || data.description || data.negocio || '',
    metodo_pago: data.metodo_pago || data.method || data.metodo || '',
    monto: data.monto || data.total || data.amount || '',
    usuario: data.usuario || '',
    timestamp: data.timestamp,
  }
}

function normalizeBudget(data) {
  return {
    id: data.id,
    categoria: data.categoria || data.category || 'Otros',
    limite: data.limite || data.limit || '',
    mes: data.mes || data.month || '',
    usuario: data.usuario || '',
    timestamp: data.timestamp,
  }
}

function normalizeGoal(data) {
  return {
    id: data.id,
    nombre: data.nombre || data.name || '',
    objetivo: data.objetivo || data.target || '',
    actual: data.actual || data.saved || '',
    fecha_objetivo: data.fecha_objetivo || data.due || '',
    usuario: data.usuario || '',
    timestamp: data.timestamp,
  }
}

function normalizeDebt(data) {
  return {
    id: data.id,
    nombre: data.nombre || data.name || '',
    saldo: data.saldo || data.pending || '',
    interes: data.interes || data.rate || '',
    fecha_limite: data.fecha_limite || data.due || '',
    estado: data.estado || data.status || 'Activo',
    usuario: data.usuario || '',
    timestamp: data.timestamp,
  }
}

function respond(payload, code) {
  const output = ContentService.createTextOutput(JSON.stringify(payload))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
