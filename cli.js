#!/usr/bin/env node
const Knex = require('knex');
const program = require('commander');

program
  .version('0.0.1')
  .description('Calling this will add a que_jobs table to your database')
  .option('-o, --host <host>', 'Database host')
  .option('-r, --port <port>', 'Database port')
  .option('-u, --user <user>', 'Database user')
  .option('-p, --password <password>', 'Database password')
  .option('-d, --database <database>', 'The database to use')
  .parse(process.argv);

if (!program.host) {
  console.error('--host is required');
  process.exit(1);
}
if (!program.user) {
  console.error('--user is required');
  process.exit(1);
}
if (!program.password) {
  console.error('--password is required');
  process.exit(1);
}
if (!program.database) {
  console.error('--database is required');
  process.exit(1);
}

const config = {
  client: 'postgresql',
  connection: {
    host: program.host,
    port: program.port,
    user: program.user,
    password: program.password,
    database: program.database
  }
};

const knex = Knex(config);

knex.schema
  .createTable('que_jobs', function(table) {
    table.integer('priority').notNullable().defaultTo(1);
    table.timestamp('run_at').notNullable().defaultTo(knex.fn.now());
    table.bigIncrements('job_id').notNullable();
    table.text('job_class').notNullable();
    table.json('args').notNullable().defaultTo('[]');
    table.integer('error_count').notNullable().defaultTo(0);
    table.text('last_error');
    table.text('queue').notNullable();
    table.unique(['priority', 'run_at', 'job_id'], 'que_id');
  })
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch(err => {
    console.error('Got an error:' + err);
    process.exit(1);
  });
