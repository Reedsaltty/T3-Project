import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({path: new URL('../../.env', import.meta.url)})

const pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
});

async function getAllEvents() {
    const [event] = await pool.query('SELECT * FROM events;')
    return event
}
const events = await getAllEvents() ;
console.log(events)
export default pool;

