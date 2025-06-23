const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const {DBconnection} = require(path.join(__dirname , '..' , 'config' , 'MongoConn'));
app.use(express.static(path.join(__dirname , '..' , 'public')));
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine" , "ejs");
app.set('views' , path.join(__dirname , '../templates/views'))
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const resumeRoutes = require(path.join(__dirname , 'routes' , 'resumeRoutes'));
app.use('/uploads', express.static(path.join(__dirname , '..' ,  'uploads')));


app.get('/' , (req , res)=>{
    res.sendFile(path.join(__dirname , '..' , 'public' , 'form.html'));
});


app.use('/api', resumeRoutes);


app.get('/thankyou', (req, res) => {
  res.render('thankyou');
});



DBconnection().then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})



