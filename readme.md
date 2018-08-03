telegraf-session-sqlite 
`sqlite session middleware for telegraf framework`

Install with npm/yarn
```
npm install telegraf-session-sqlite
yarn add telegraf-session-sqlite
```
Create table in your database

```
create table 'your_table_name'
(
  id      varchar(255)
    primary key,
  session varchar(255)
);
```

Example:
```
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(PATH_TO_DATABASE);
const session = require('telegraf-session-sqlite');
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const options = {
    db: db, //your sqlite3 instance
    table_name: 'user_session', //database table name 
}
bot.use(session(options))
...
```

Options object description

| key        | description                                      | default            |
|------------|--------------------------------------------------|--------------------|
| db         | sqlite3 instance                                 | none               |
| table_name | database table name where session will be stored | 'telegraf_session' |

 