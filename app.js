const express = require('express')
const {connectToDb , getDb} = require('./db');


const cors = require('cors');
const { ObjectId } = require('mongodb');


const app = express();
app.use([express.json(),cors()])

const PORT = 5000;
// db connection
let db;
connectToDb((err)=>{
    if(!err){
        app.listen(PORT , ()=>{
            console.log(`Port is listening ${PORT}`)
        })
        db = getDb();
    }

})

app.get('/products', (req,res)=>{
const page = req.query.page || 0;
const ProductPerPage = 10


    let products = []

    db.collection('Products').find().sort({id:1}).skip(page*ProductPerPage).limit(ProductPerPage).forEach(product=> {
       products.push(product)
    }).then(()=>{
        res.status(200).json(products);
    }).catch(()=>{
        res.status(500).json({error:"could not fetch document"})
    })
  
})
app.get('/products/:id', (req,res)=>{
    
    const {id } = req.params;
    db.collection('Products').findOne({id: Number(id)})
    .then(doc=>{
        res.status(200).json(doc)
    }).catch(err=>{
        res.status(500).json({err:"could'n fetch  the document"})
    })
  
})
app.post('/products' , (req,res)=>{
        const book = req.body;
        db.collection('Products').insertOne(book)
        .then(result=>{
            res.status(201).json(result);
        })
        .catch(err=>{
            res.status(500).json({mgs:"products can't be added"})
        })
})
app.delete('/products/:id' , (req , res)=>{
        const {id} = req.params
        db.collection('Products').deleteOne({id:Number(id)}).then(result=>{
            res.status(201).json(result)
        }).
        catch(err=>{
            res.status(500).json({msg:`can't delete product with id ${id}`})
        })
})
app.get('/products/count' , (req, res)=>{

    db.collection('Products').find().then(result=>{
        res.status(201).json(result.count)
    }).
    catch(err=>{
        res.status(500).json({msg:`can't delete product with id ${id}`})
    })


})
app.patch('/products/:id', (req, res)=>{
    const body = req.body;
    if(ObjectId.isValid(req.params.id)){
    db.collection('Products').updateOne({_id: newObjectId(req.params.id)} , {$set: body})
    .then(result =>{
        res.status(200).json(result)

    }).catch(err=>{
        res.status(500).json({success:true ,msg:"this id can;t be updated"})
    })
}
else{
    res.status(500).json({error:"not a valid doc id"})
}
})