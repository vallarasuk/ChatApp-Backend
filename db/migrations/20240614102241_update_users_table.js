exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.timestamp("first_register_time").defaultTo(knex.fn.now()).nullable();
    table.timestamp("last_login_time").defaultTo(knex.fn.now()).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.dropColumn("first_register_time");
    table.dropColumn("last_login_time");
  });
};
