const express = require('express');
const app = express();
const port = 4000;

const bodyParser = require('body-parser');

const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$afrodite@89',
    database: 'nodejs',
    multipleStatements: true
})

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

app.use(bodyParser.urlencoded({ extended: true })); //use body-parser as middleware to process form data sent in the body of a POST request

app.get('/', function(request, response){
    response.send('Hello, Shay!');
});

app.get('/user', function(request, response){
    response.json([
        {id: 1, username: 'someone'},
        {id: 2, username: 'someone_else'}
    ]);
});

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