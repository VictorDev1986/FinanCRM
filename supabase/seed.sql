-- ============================================================
-- Datos de ejemplo para FinanCRM
-- Ejecutar DESPUES de crear un usuario en Supabase Auth
-- Reemplaza 'TU_USER_UUID' con el id del usuario creado
-- ============================================================

-- Ingresos de ejemplo
insert into public.ingresos (usuario_id, fecha, categoria, descripcion, metodo_pago, monto) values
  ('TU_USER_UUID', '2026-06-01', 'Salario', 'Salario mensual', 'Transferencia', 4500.00),
  ('TU_USER_UUID', '2026-06-05', 'Freelance', 'Proyecto web', 'Transferencia', 1200.00),
  ('TU_USER_UUID', '2026-06-10', 'Ventas', 'Venta de producto digital', 'Tarjeta', 350.00),
  ('TU_USER_UUID', '2026-05-01', 'Salario', 'Salario mensual', 'Transferencia', 4500.00),
  ('TU_USER_UUID', '2026-05-15', 'Inversiones', 'Dividendos', 'Transferencia', 200.00),
  ('TU_USER_UUID', '2026-04-01', 'Salario', 'Salario mensual', 'Transferencia', 4500.00);

-- Gastos de ejemplo
insert into public.gastos (usuario_id, fecha, categoria, descripcion, metodo_pago, monto) values
  ('TU_USER_UUID', '2026-06-02', 'Alimentacion', 'Supermercado', 'Tarjeta', 250.00),
  ('TU_USER_UUID', '2026-06-03', 'Transporte', 'Gasolina', 'Tarjeta', 80.00),
  ('TU_USER_UUID', '2026-06-04', 'Hogar', 'Renta', 'Transferencia', 1200.00),
  ('TU_USER_UUID', '2026-06-05', 'Servicios', 'Electricidad', 'Transferencia', 95.00),
  ('TU_USER_UUID', '2026-06-06', 'Entretenimiento', 'Streaming', 'Tarjeta', 25.00),
  ('TU_USER_UUID', '2026-06-07', 'Salud', 'Consulta medica', 'Efectivo', 150.00),
  ('TU_USER_UUID', '2026-05-02', 'Alimentacion', 'Supermercado', 'Tarjeta', 230.00),
  ('TU_USER_UUID', '2026-05-03', 'Transporte', 'Gasolina', 'Tarjeta', 75.00),
  ('TU_USER_UUID', '2026-05-04', 'Hogar', 'Renta', 'Transferencia', 1200.00),
  ('TU_USER_UUID', '2026-05-10', 'Compras', 'Ropa', 'Tarjeta', 180.00);

-- Presupuestos de ejemplo
insert into public.presupuestos (usuario_id, categoria, limite, mes) values
  ('TU_USER_UUID', 'Alimentacion', 400.00, '2026-06'),
  ('TU_USER_UUID', 'Transporte', 150.00, '2026-06'),
  ('TU_USER_UUID', 'Entretenimiento', 100.00, '2026-06'),
  ('TU_USER_UUID', 'Salud', 200.00, '2026-06');

-- Metas de ejemplo
insert into public.metas (usuario_id, nombre, objetivo, actual, fecha_objetivo) values
  ('TU_USER_UUID', 'Fondo de emergencia', 10000.00, 3500.00, '2026-12-31'),
  ('TU_USER_UUID', 'Viaje a Japon', 5000.00, 1200.00, '2027-06-30'),
  ('TU_USER_UUID', 'Curso online', 500.00, 500.00, '2026-07-15');

-- Deudas de ejemplo
insert into public.deudas (usuario_id, nombre, saldo, interes, fecha_limite, estado) values
  ('TU_USER_UUID', 'Tarjeta de credito', 1500.00, 24.5, '2026-07-15', 'Activo'),
  ('TU_USER_UUID', 'Prestamo personal', 5000.00, 12.0, '2027-01-10', 'Activo');

-- Configuracion de ejemplo
insert into public.configuracion (usuario_id, clave, valor) values
  ('TU_USER_UUID', 'theme', 'dark'),
  ('TU_USER_UUID', 'currency', 'USD'),
  ('TU_USER_UUID', 'aiModel', 'gpt-4o');
