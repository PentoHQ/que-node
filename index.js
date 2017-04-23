const Knex = require('knex');

/**
 * Creates a job object the is compatible with the que and que-go workers
 * and can be put into the job queue
 * 
 * @param {Object} options
 * @param {int} [options.priority = 100] The priority of the job. Lower is more important. Default is 100.
 * @param {Date} [options.run_at = new Date] When the job should be run. Default is now.
 * @param {String} [options.job_class = ''] The class or func to call. Default is ''.
 * @param {Object} options.args The arguments for the job call. Will be JSON serialized.
 * @param {String} [options.queue = '']The queue to push this job to. Default is ''.
 *
 * @returns {Object} A job ready to be enqueued.
 */
function createJob({
  priority = 100,
  run_at = new Date(),
  job_class = '',
  args,
  queue = ''
}) {
  return {
    priority,
    run_at,
    job_class,
    args: JSON.stringify(args),
    queue
  };
}


/**
 * Creates a new instance of que-node to be used to
 * Push jobs to the queue.
 * 
 * @param {String} opts.host The database host
 * @param {Number} opts.port The database port
 * @param {String} opts.user The database user
 * @param {String} opts.password The database password
 * @param {String} opts.database The database name
 *
 * @returns {Object} Ready to use que-node
 */
module.exports = function factory(opts) {
  const knex = Knex({
    client: 'postgresql',
    connection: opts
  });


  /**
   * 
   * 
   * @param {Object} job A job created by createJob 
   * @returns 
   */
  function enqueue(job) {
    return knex('que_jobs').insert(job);
  }

  return {
    createJob,
    enqueue
  };
};