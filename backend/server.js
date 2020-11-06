const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // to hash passwords
const jwt = require('jsonwebtoken');
const config = require('./config.js')
const port = 4000;
const bodyParser = require('body-parser');
require('dotenv').config()

const mysql = require('mysql');  
const connection = mysql.createConnection(config)
connection.connect(function(err){
    if(err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

app.use(express.json()) // so that application can accept JSON
app.use(bodyParser.urlencoded({ extended: true })); //use body-parser as middleware to process form data sent in the body of a POST request

const subjects = ['algebra', 'arithmetic', 'calculus', 'differential', 'discrete', 'geometry', 'logic', 'number', 'statistics', 'trigonometry']

app.get('/category/:category', async (req, res) => {
    const sql = `SELECT username, question_id, new_question, answers, DATE_FORMAT(question_date, "%b %e '%y at %l:%i %p") AS date FROM (SELECT question AS new_question, COUNT(response) AS answers FROM Questions LEFT JOIN Responses USING (question_id) WHERE category= ? GROUP BY question) dream INNER JOIN Questions ON dream.new_question = Questions.question INNER JOIN Users USING (user_id)`;
    if(subjects.includes(req.params.category)){
        connection.query(sql, [req.params.category], (err, rows) => {
            if(err) throw err;
            else{
                res.send(rows)
            }
        })
    }
    else{
        res.sendStatus(400)
    }
});

app.put('/question', async (req, res) => {
    const sql = `INSERT INTO Questions(user_id, category, question) VALUES(?, ?, ?)`;
    const que = `SELECT user_id FROM Users WHERE username = ?`
    // first, get user id
    connection.query(que, [req.body.user], (err, rows) => {
        if(err) throw err;
        else{
            const user_id = rows[0].user_id;
            const values = [user_id, req.body.category, req.body.question];
            if(subjects.includes(req.body.category)){
                connection.query(sql, values, (err, rows) => {
                    if(err) throw err;
                    else{
                        res.send('Your question has been submitted.')
                        console.log('Question submitted.')
                    }
                })
            }
            else{
                res.sendStatus(400)
            }
        }
    })
});

app.post('/answer', async (req, res) => {
    const get_user_id = `SELECT user_id FROM Users WHERE username = ?`;
    const add_answer = `INSERT INTO Responses(user_id, question_id, response) VALUES(?, ?, ?) ` 
    connection.query(get_user_id, [req.body.user], (err, row) => {
        if(err) throw err; 
        else{
            const userId = row[0].user_id;
            const values = [userId, req.body.id, req.body.answer]
            connection.query(add_answer, values, (err, row) => {
                if(err) throw err; 
                else{
                    res.send('answer submitted.')
                    console.log('Answer submitted.')
                }
            })
            
        }
    })
})

app.get('/post/:questionId', async (req, res) => {
    const sql = `SELECT submit_user, question_id, question, question_date, answer_user, response_id, response, response_date FROM (SELECT question_id, username AS submit_user, question, DATE_FORMAT(question_date,"%b %e '%y at %l:%i %p") AS question_date FROM Questions INNER JOIN Users USING (user_id) WHERE question_id = ?) AS user_question INNER JOIN (SELECT question_id, username AS answer_user, id AS response_id, response, DATE_FORMAT(response_date, "%b %e '%y at %l:%i %p") AS response_date FROM Responses INNER JOIN Users USING (user_id) WHERE question_id = ?) AS answers USING (question_id);`
    // const sql = `SELECT username AS answer_user, response, DATE_FORMAT(response_date, "%b %e '%y at %l:%i %p") AS response_date FROM Responses INNER JOIN Users USING (user_id) WHERE question_id = ?`
    connection.query(sql, [req.params.questionId, req.params.questionId], (err, rows) => {
        if(err) throw err; 
        else{
            const no_answer = `SELECT username as submit_user, question_id, question, DATE_FORMAT(question_date,"%b %e '%y at %l:%i %p") AS question_date FROM Questions INNER JOIN Users USING (user_id) WHERE question_id = ?`
            if(rows.length === 0){
                connection.query(no_answer, [req.params.questionId], (err, row) => {
                    if(err) throw err; 
                    else{
                        res.send(row)
                    }
                })
            }
            else{
                res.send(rows)
            }
        }
    })
})

app.put('/update/question/:questionId', async (req, res) => {
    const sql = `UPDATE Questions SET question = ? WHERE question_id = ?`;
    const { update } = req.body;
    connection.query(sql, [update, req.params.questionId], (err, result) => {
        if(err) throw err; 
        else{
            res.send('It is a success')
        }
    })
})

app.put('/update/answer/:answerId', async (req, res) => {
    const { update } = req.body;
    const sql = `UPDATE Responses SET response = ? WHERE id = ?`;
    connection.query(sql, [update, req.params.answerId], (err, result) => {
        if(err) throw err;
        else{
            res.send('It is a success')
        }
    })
})

app.delete('/delete/question/:questionId', (req, res) => {
    const sql = `DELETE FROM Questions WHERE question_id = ?`;
    connection.query(sql, [req.params.questionId],(err, result) => {
        if(err) throw err; 
        else{
            res.send('Your delete request has been processed.')
            console.log('Deleted Row(s):', result.affectedRows)
        }
    })
})

app.delete('/delete/answer/:answerId', (req, res) => {
    const sql = `DELETE FROM Responses WHERE id = ?`;
    connection.query(sql, [req.params.answerId],(err, result) => {
        if(err) throw err; 
        else{
            res.send('Your delete request has been processed.')
            console.log('Deleted Row(s):', result.affectedRows)
        }
    })
})

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
            if(rows.length === 0){
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
                            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1500 });
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

app.get('/check/:newName', async (req, res) => {
    const sql = `SELECT username FROM Users WHERE username LIKE ?`
    connection.query(sql, [req.params.newName], (err, result) => {
        if(err) throw err; 
        else{
            if(result.length === 1){
                res.send('not available')
            }
            else{
                res.send('ok')
            }
        }
    })
})

app.put('/update/user', async (req, res) => {
    const { new_name, old_name } = req.body;
    const sql = `UPDATE Users SET username = ? WHERE username = ?`;
    connection.query(sql, [new_name, old_name], (err, result) => {
        if(err) throw err; 
        else{
            console.log(`Username for ${old_name} has been updated to ${new_name}.`)
        }
    })
})

app.put('/update/password', async (req, res) => {
    try{
        const { old_pwd, new_pwd, user } = req.body;
        const pwd_query = `SELECT password FROM Users WHERE username = ?`;
        const update = `UPDATE Users SET password = ? WHERE username = ?`;
        const new_hashPwd = await bcrypt.hash(new_pwd, 10);
    
        connection.query(pwd_query, [user], (err, row) => {
            const pwd = row[0].password;
            if(err) throw err; 
            else{
                bcrypt.compare(old_pwd, pwd, (error, bool) => {
                    if(error) throw error; 
                    else{
                        if(bool){
                            connection.query(update, [new_hashPwd, user], (err, result) => {
                                if(err) throw err ; 
                                else{
                                    res.send('Your password has been updated.');
                                    console.log(`Password for ${user} has been updated.`)
                                }
                            })
                        }
                        else{
                            res.send('wrong password')
                        }
                    }
                })
            }
        })
    }
    catch{
        res.status(500).send()
    }
})

app.delete('/delete/:user', (req, res) => {
    const sql = `DELETE FROM Users WHERE username = ?`;
    connection.query(sql, [req.params.user],(err, result) => {
        if(err) throw err; 
        else{
            res.send('Your account has been deleted.')
            console.log('Deleted Row(s):', result.affectedRows)
        }
    })
})

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

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});