const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:'); // In-memory database for testing

// Create a simple table
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);");
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'password');");
    db.run("INSERT INTO users (username, password) VALUES ('user', 'secure_pass');");

});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Vulnerable SQL query construction
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (row) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Login failed.');
        }
    });
});

app.get('/', (req, res) => {
    res.send(`
    <form method="POST" action="/login">
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username"><br>
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password"><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// Example of a malicious payload:
// username: 'admin' --
// password: 'anything'

// Or to get all users:
// username: 'admin' OR '1'='1'
// password: 'anything'

//Or to get the admin password:
// username: 'admin' --
// password:'anything' UNION SELECT null, password, null from users where username = 'admin'
