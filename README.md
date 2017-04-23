# que-node
An interoperable Node.js port of the Ruby Que queuing library for PostgreSQL

## NOTICE

This is very much a work in progress and is used internally at Pento.

You cannot yet use this to run workers against a que table in a database, only to push jobs to a queue.

## Usage

There are docblocks in the code

### CLI
You can use the cli to quickly create a database table that is compatible with que-node if you don't already have one.
```bash
$ ./node_modules/.bin/que-node --host some-host --port 5432 --user root --password secret --database test
```

### API

Example:
```javascript
const quenode = require('que-node')

const que = quenode({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'secret',
  database: 'test'
})

que.enqueue(que.createJob(1, new Date(), 'intercomUpdate', {
    hello: 'world'
  }, 'queue'))
  .then((e) => console.log(e))
  .catch((e) => console.error(e))
```
