/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user_category", function (table) {
      table.increments("id").primary();
      table.string("object_name").notNullable();
      table.integer("object_id").notNullable().unique();
      table.timestamps(true, true);
    })
    .then(() => {
      return knex("user_category").insert([
        { object_name: "Tech", object_id: 1 },
        { object_name: "Health", object_id: 2 },
        { object_name: "Education", object_id: 3 },
        { object_name: "Sports", object_id: 4 },
        { object_name: "Entertainment", object_id: 5 },
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_category");
};
