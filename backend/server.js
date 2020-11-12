import express from 'express';
import bodyParser from 'body-parser';
import { categoryInfo, getPost, newAnswer, newQuestion, updateQuestion, updateAnswer, deleteQuestion, deleteAnswer, getRegistration, getLogin, checkName, updateUser, updatePwd, deleteUser } from './db.js';

const port = 5000;
const app = express();

app.use(express.json()) // so that application can accept JSON
app.use(bodyParser.urlencoded({ extended: true })); //use body-parser as middleware to process form data sent in the body of a POST request

app.get('/category/:category', async (req, res) => {
    let data = await categoryInfo(req.params.category);
    res.send(data);
})

app.post('/question', async (req, res) => {
    let data = await newQuestion(req.body);
    if(data === 0) res.sendStatus(404);
    else console.log('Question submitted');
})

app.post('/answer', async (req, res) => {
    let data = await newAnswer(req.body);
    if(data === 1){
        console.log(`Answer submitted for question id: ${req.body.id}`);
        res.send('answer submitted');
    };
})

app.get('/post/:questionId', async (req, res) => {
    let data = await getPost(req.params.questionId);
    res.send(data)
})

app.put('/update/question/:questionId', async (req, res) => {
    let data = await updateQuestion(req.params.questionId, req.body)
    if(data === 1){
        console.log(`Question with id: ${req.params.questionId} updated`);
        res.send('question updated')
    }
})

app.put('/update/answer/:answerId', async (req, res) => {
    let data = await updateAnswer(req.params.answerId, req.body)
    if(data === 1){
        console.log(`Answer with id: ${req.params.answerId} updated`);
        res.send('answer updated');
    }
})

app.delete('/delete/question/:questionId', async (req, res) => {
    let data = await deleteQuestion(req.params.questionId)
    if(data === 1){
        console.log(`Question with id: ${req.params.questionId} deleted`);
        res.send('question deleted');
    }
})

app.delete('/delete/answer/:answerId', async (req, res) => {
    let data = await deleteAnswer(req.params.answerId)
    if(data === 1){
        console.log(`Answer with id: ${req.params.answerId} deleted`);
        res.send('answer deleted');
    }
})

app.post('/register', async (req, res) => {
    let data = await getRegistration(req.body);
    res.sendStatus(data);
});

app.post('/login', async (req, res) =>{
    let data = await getLogin(req.body)
    if(data === 400 || data === 404) res.sendStatus(data);
    else res.json({accessToken: data})
})

app.get('/check/:newName', async (req, res) => {
    let data = await checkName(req.params.newName);
    if(data === 'not available' || data === 'ok') res.send(data);
})

app.put('/update/user', async (req, res) => {
    let data = await updateUser(req.body);
    if(data === 1) console.log(`Username for ${req.body.old_name} has been updated to ${req.body.new_name}.`);
})

app.put('/update/password', async (req, res) => {
    let data = await updatePwd(req.body);
    if(data === 1) console.log(`Password for ${req.body.user} has been updated.`);
    else res.send('wrong password');
})

app.delete('/delete/:user', async (req, res) => {
    let data = await deleteUser(req.params.user);
    if(data === 1) console.log(`User account, ${req.params.user}, has been deleted`);
})

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
})