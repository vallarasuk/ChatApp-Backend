/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.string("session_token"); // Session token column
      table.timestamp("session_expires_at"); // Session expiration timestamp
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.dropColumn("session_token");
      table.dropColumn("session_expires_at");
    });
  };