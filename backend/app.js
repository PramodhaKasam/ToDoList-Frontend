const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Chore = require('./models/Chores');
const DailyChore = require('./models/DailyChores');

var app = express();
app.use(cors());
app.use(express.json());
var url = "mongodb+srv://clpro_123:Pramodha123@cluster0.k9kjmxq.mongodb.net/";
mongoose.connect(url)
.then((res)=> console.log('Connected to db'))
.catch((err) => console.log(err));

// Get Chores
app.get('/api/chores', async (req, res) =>{
   try{
    const chores = await Chore.find();
    res.json(chores);
   }
   catch(err)
   {
    res.status(500).json({ message: err.message });
   }
   
});

// Post Chores
app.post('/api/chores', async (req, res) =>{
    const chore = new Chore({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time
    })
    try {
        const newChore = await chore.save();
        res.status(201).json(newChore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//  Delete chores
app.delete('/api/chores/:id', async (req, res)=>{
    try{
        const result = await Chore.findByIdAndDelete(req.params.id);
        if(result) res.status(200).json({message: "Chore deleted"});
        else res.status(404).json({message: "Chore not found"});
    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
})

// Edit Chores
app.put('/api/chores/:id', async (req, res)=>{
    try {
        const updatedChore = await Chore.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        if (updatedChore) {
            res.json(updatedChore);
        } else {
            res.status(404).json({ message: 'Chore not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//Get DailyChores
app.get('/api/dailychores', async (req, res)=>{
    try{
        const response = await DailyChore.find();
        res.json(response);
    }
    catch(err){
        res.status(500).json({err: err.message});
    } 
})

//Post DailyChores
app.post('/api/dailychores', async (req, res)=>{
    const NewDailyChore = new DailyChore({
        title: req.body.title
    });

    try{
        const newDaily = await NewDailyChore.save();
        res.status(201).json(newDaily);
    }
    catch(err)
    {
        res.status(400).json({err: err.message});
    }
});

//Delete DailyChores
app.delete('/api/dailychores/:id', async (req, res)=>{
    try{
        const result = await DailyChore.findByIdAndDelete(req.params.id);
        if(result) res.status(200).json(result);
        else res.status(404).json('Daily Chore Not Found');
    }
    catch(err)
    {
        res.status(500).json({err: err.message});
    }  
});

//Edit DailyChores
app.put('/api/dailychores/:id', async (req, res)=>{
    try{
        const dailychore = await DailyChore.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if(dailychore)res.json(dailychore);
        else res.status(404).json('Daily Chore not Found');
    }
    catch(err)
    {
        res.status(500).json({err: err.message});
    }
});

app.listen(5000, ()=>{
    console.log("Listening to 5000")
}); 


