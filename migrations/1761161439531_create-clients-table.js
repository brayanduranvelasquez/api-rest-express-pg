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
  pgm.createTable("clients", {
    id: "id",
    first_name: { type: "varchar(100)", notNull: true },
    last_name: { type: "varchar(100)", notNull: true },
    phone: { type: "varchar(20)" },
    creator_id: { type: "integer", notNull: true, references: "users", onDelete: "RESTRICT" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("clients");
};
