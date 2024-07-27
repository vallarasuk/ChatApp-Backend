/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
      .createTable("age_category", function (table) {
        table.increments("id").primary(); // Auto-incrementing primary key
        table.string("object_name").notNullable(); // Object name
        table.integer("object_id").notNullable().unique(); // Object ID, must be unique
        table.timestamps(true, true); // Created_at and updated_at timestamps
      })
      .then(() => {
        // Insert initial data into the table
        return knex("age_category").insert([
          { object_name: "Under 18", object_id: 1 },
          { object_name: "18 - 25", object_id: 2 },
          { object_name: "26 - 32", object_id: 3 },
          { object_name: "32 - 40", object_id: 4 },
          { object_name: "Above 40", object_id: 5 },
        ]);
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable("age_category");
  };
  