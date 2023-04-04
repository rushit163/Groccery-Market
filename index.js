const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/farmStand", { useNewUrlParser: true })
.then(()=>{
    console.log("Worked!!!!");
}).catch((err)=>{
    console.log("didn't work");
    console.log(err);
})




app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/products',async (req,res)=>{
    const products = await Product.find({});
    res.render('products/index',{products})
})
app.get('/products/new',(req,res)=>{
    res.render('products/new')
})
app.post('/products',async (req,res)=>{
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id',async (req,res)=>{
    const {id} = req.params;
    const foundProduct = await Product.findById(id)
    res.render('products/info',{foundProduct});
})

app.get('/products/:id/edit',async (req,res)=>{
    const {id} = req.params;
    const editProduct = await Product.findById(id)
    res.render('products/edit',{editProduct})
})

app.put('/products/:id',async (req,res)=>{
    const {id} = req.params;
    const editedProduct = await Product.findByIdAndUpdate(id,req.body);
    res.redirect(`/products/${editedProduct._id}`);
})

app.delete('/products/:id',async (req,res)=>{
    const {id} = req.params;
    const del = await Product.findByIdAndDelete(id);
    res.redirect('/products');
    console.log(del);
})


app.listen(3000,()=>{
    console.log('On port 3000')
})
