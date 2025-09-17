const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const moment = require('moment');
const PORT = 8000;

require('dotenv').config()

const db = process.env.MONGO_URI
mongoose.connect(db).then(() => {
    console.log('DB Connected!');
}).catch((err) => {
    console.log(err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

const taskSchema = new mongoose.Schema({
    title: String,
    isDone: Boolean,
    time: {
        type: Date,
        def: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
    Task.find().then((tasks) => {
        res.render('index.ejs', { tasks, moment })
    })
})

app.get('/add', (req, res) => {
    res.render('add_task.ejs')
})

app.post('/add', (req, res) => {
    Task.create({ title: req.body.title }).then(() => {
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        res.render('edit_task.ejs', { task })
    })
})

app.post('/edit/:id', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { title: req.body.title }).then(() => {
        res.redirect('/')
    })
})

app.post('/delete/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id).then(() => {
        res.redirect('/')
    })
})

app.post('/status/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        task.isDone = !task.isDone
        return task.save()
    }).then(() => {
        res.redirect('/')
    })
})


app.listen(PORT, (err) => {
    if (err != undefined) {
        console.log(err);
    }
    else {
        console.log('Run success!');
    }
})