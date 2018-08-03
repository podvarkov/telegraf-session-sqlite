const {selectById, insert, defSession} = require('./helpers');

module.exports = function (opts) {
  opts = Object.assign({
    property: 'session',
    table_name: 'telegraf_session',
    getSessionKey: (ctx) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`
  }, opts);

  const store = new Map();

  return (ctx, next) => {
    const key = opts.getSessionKey(ctx);
    if (!key) {
      return next(ctx)
    }
    let {session} = store.get(key) || {};
    if (!session) {
      selectById(key, opts)
        .then(rows => {
          if (rows.length) {
            session = JSON.parse(rows[0].session);
            return defSession(ctx, next, session, opts, key, store)
          } else {
            session = {};
            insert(key, JSON.stringify(session), opts)
              .then(() => {
                return defSession(ctx, next, session, opts, key, store)
              })
          }
        })
    } else {
      return defSession(ctx, next, session, opts, key, store)
    }
  }
};
