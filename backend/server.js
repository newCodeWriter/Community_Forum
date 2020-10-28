const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // to hash passwords
const jwt = require('jsonwebtoken');
require('dotenv').config()
const session = require('express-session');
const port = 4000;

app.use(session({
    secret: 'jdfd#lf3sdkrskww9#2hd%ew3s3ws285sewqr',
    resave: false, 
    saveUninitialized: true
}))

const bodyParser = require('body-parser');

const users = [{name: 'shay'}, {name: 'joe'}]

const mysql = require('mysql');     //create a separate file and hide this information
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$afrodite@89',
    database: 'nodejs',
    multipleStatements: true
})

// functions

// getUsers = (person) => {
//     const user_query = `SELECT username FROM Users`;
//     var user_list;
//     connection.query(user_query, (err, results) => {
//         // if(err) throw err
//         user_list = results
//         if(user_list.find(user => user.username === person)){
//             // res.status(201).send("we found the user")
//             return true
//         }
//         else{
//             return false
//         }
//     })
// }

// app.get('/cool', async (req, res) => {
//     let p = 'joseph'
//     getUsers(p)

// })

connection.connect(function(err){
    if(err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

// var sql = `SELECT * FROM contacts`;

// connection.query(sql, function(err, result){
//     if (err) throw err;
//     console.log(result)
// })

// connection.end()

app.use(express.json()) // so that application can accept JSON
app.use(bodyParser.urlencoded({ extended: true })); //use body-parser as middleware to process form data sent in the body of a POST request

app.get('/users', (req, res) => {
    res.json(users);
    console.log('it is done');
});

app.get('/mother', (req, res) => {
    res.redirect('/');
});

app.post('/register', async (req, res) => {
    try{
        const hashPwd = await bcrypt.hash(req.body.password, 10);
        let new_user = req.body.user.toLowerCase();
        let check_username = `SELECT * FROM Users WHERE username LIKE ?`;
        connection.query(check_username, [new_user], (err, rows) => {
            if(rows.length > 0){
                res.sendStatus(409);
            }
            else{
                let data = [new_user, hashPwd];
                let insert = `INSERT INTO Users (username, password) VALUES(?,?)`;    
                connection.query(insert, data, (err, row) => {
                    if(err){
                        return console.error(err.message);
                    }
                    res.sendStatus(201);
                    console.log('New user id: ' + row.insertId);
                })
            }
        })
    }
    catch{
        res.status(500).send()
    }
});

app.post('/login', async (req, res) =>{
    const user_query = `SELECT * FROM Users WHERE username LIKE ?`;
    connection.query(user_query, [req.body.username], (err, rows) => {
        if(err) throw err;
        else{
            if(rows.length == 0){
                res.sendStatus(400)
            }
            else{
                let username = rows[0].username;
                let pwd = rows[0].password;
                bcrypt.compare(req.body.password, pwd, (error, bool) => {
                    if(error) {throw new error('something went wrong.') }
                    else{
                        if(bool){
                            // create access token for user
                            const user = {name: username};
                            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 900 });
                            res.json({accessToken: accessToken});
                        }
                        else{
                            res.sendStatus(404)
                        }
                    }
                })
            }
        }
    })
})

const posties = [
    {username: "jasmine", title: "Post 1"},
    {username: "kimberly", title: "Post 2"}
]

// middleware to verify user's access token
authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

// endpoint where user can view all of their submitted posts
app.get('/post', authenticateToken, (req, res) => {
   res.json(posties.filter(post => post.username === req.user.name))
   
})

    // const query = `SELECT category, question, question_date FROM Questions WHERE user_id = ?`;
    // connection.query(query, [req.user_id], (err, rows) => {
    //     if(err) throw err;
    //     res.send('here are all your post.')
        // const posts = rows.filter(row => row.category)
    // })


// app.get('/quotes', function(req, res){
//     if(req.query.year){
//         res.send("Return a list of quotes from the year: " + req.query.year);
//       }
//     else{
//           res.json(quotes);
//       }
// });

// app.get('/quotes/:id', function(req, res){
//     console.log("return quote with the ID: " + req.params.id);
//     // res.send("Return quote with the ID: " + req.params.id);
//     var sql = `SELECT * FROM contacts WHERE id = ?`
//     connection.query(sql, [req.params.id], function(err, row){
//         if(err){
//             console.log(err.message);
//         }
//         else{
//             res.json(row);
//         }
//     });
// });

// app.post('/quotes', function(req, res){
//     console.log("Insert a new record for: " + req.body.fname);
//     connection.query(`INSERT INTO contacts (first_name, last_name, age) VALUES(?, ?, ?)`, [req.body.fname, req.body.lname, req.body.age], function(err, result){
//         if(err){
//             console.log(err.message);
//         }
//         else{
//             res.send('Inserted new record with id: ' + result.insertId);
//         }
//     })
// });

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});