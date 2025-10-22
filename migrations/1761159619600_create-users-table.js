/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    email: {
      type: "varchar(100)",
      notNull: true,
      unique: true, // No se pueden tener dos cuentas con el mismo correo
    },
    password: {
      type: "varchar(255)", // Suficiente espacio para el hash de bcrypt
      notNull: true,
    },
    // CLAVE FORÁNEA: role_id
    role_id: {
      type: "integer",
      notNull: true,
      references: "roles", // Referencia el ID de la tabla 'roles'
      onDelete: "RESTRICT", // No permite borrar un rol si hay usuarios asignados
      default: 2, // Asignamos 2 ('Analista') como rol por defecto
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("users");
};
