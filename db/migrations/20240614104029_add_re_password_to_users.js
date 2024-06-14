/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.string("re_password").notNullable(); // Add re_password column
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.dropColumn("re_password"); // Drop re_password column if rolling back
    });
  };
