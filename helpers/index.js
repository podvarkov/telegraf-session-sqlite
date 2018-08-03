function selectById(id, opts) {
  return new Promise((res, rej) => {
    opts.db.all(`SELECT * from ${opts.table_name} WHERE id = $id`, {$id: id}, function (err, rows) {
      if (err) rej(err)
      res(rows)
    });
  })
}

function updateById(id, session, opts) {
  return new Promise((res, rej) => {
    opts.db.run(`UPDATE ${opts.table_name} SET SESSION = $session WHERE id = $id`,
      {$session: session, $id: id},
      function (err, rows) {
        if (err) rej(err)
        res(rows)
      });
  })
}

function insert(id ,session, opts) {
  return new Promise((res, rej) => {
    opts.db.run(`INSERT INTO ${opts.table_name} VALUES($id, $session)`,
      {$session: session, $id: id},
      function (err, rows) {
        if (err) rej(err)
        res(rows)
      });
  })
}

function defSession(ctx, next, session, opts, key, store) {
  Object.defineProperty(ctx, opts.property, {
    get: function () {
      return session
    }
  })
  return next(ctx).then(() => {
    updateById(key, JSON.stringify(session), opts)
      .then(_ => {
        store.set(key, {
          session,
        })
      })
  })
}

module.exports = {
  insert: insert,
  selectById: selectById,
  defSession: defSession
};