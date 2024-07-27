/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string('category').nullable(); // Adding a new column 'category' which is nullable
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("category"); // Dropping the 'category' column if we roll back
  });
};
