function setupSheets() {
  const sheetDefinitions = {
    Usuarios: ['id', 'nombre', 'email', 'password', 'rol'],
    Ingresos: ['id', 'fecha', 'categoria', 'descripcion', 'metodo_pago', 'monto', 'usuario', 'timestamp'],
    Gastos: ['id', 'fecha', 'categoria', 'descripcion', 'metodo_pago', 'monto', 'usuario', 'timestamp'],
    Presupuestos: ['id', 'categoria', 'limite', 'mes', 'usuario', 'timestamp'],
    Metas: ['id', 'nombre', 'objetivo', 'actual', 'fecha_objetivo', 'usuario', 'timestamp'],
    Deudas: ['id', 'nombre', 'saldo', 'interes', 'fecha_limite', 'estado', 'usuario', 'timestamp'],
    Configuracion: ['clave', 'valor', 'usuario', 'timestamp'],
    LogsIA: ['timestamp', 'prompt', 'respuesta', 'status'],
  }

  const spreadsheet = SpreadsheetApp.openById(SHEET_ID)

  Object.keys(sheetDefinitions).forEach((name) => {
    let sheet = spreadsheet.getSheetByName(name)
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name)
    }

    const headers = sheetDefinitions[name]
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    const existing = headerRange.getValues()[0]
    const isEmpty = existing.every((value) => String(value || '').trim() === '')
    if (isEmpty) {
      headerRange.setValues([headers])
    }
  })
}
