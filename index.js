const express=require('express');
const app=express();
let { DataTypes, sequelize } = require('./lib/index');
const {Product}=require('./models/Products');
const {Category}=require('./models/category');
const {Supplier}=require('./models/supplier');
const ProductCategory = require('./models/productCategory');
const { where } = require('sequelize');
const PORT=3000;

app.use(express.json());

//Given Data 
const suppliersData = [
    { name: 'TechSupplies', contact: 'John Doe', email: 'contact@techsupplies.com', phone: '123-456-7890' },
    { name: 'HomeGoods Co.', contact: 'Jane Smith', email: 'contact@homegoodsco.com', phone: '987-654-3210' },
  ];
  
  const productsData = [
    { name: 'Laptop', description: 'High-performance laptop', quantityInStock: 50, price: 120099, supplierId: 1 },
    { name: 'Coffee Maker', description: '12-cup coffee maker', quantityInStock: 20, price: 45000, supplierId: 2 },
  ];
  
  const categoriesData = [
    { name: 'Electronics', description: 'Devices and gadgets' },
    { name: 'Kitchen Appliances', description: 'Essential home appliances for kitchen' },
  ];

app.get('/seed_db',async(req,res)=>{
    try{
        await sequelize.sync({force:true});
        await Supplier.bulkCreate(suppliersData);
        await Product.bulkCreate(productsData);
        await Category.bulkCreate(categoriesData);

        return res.status(200).json({message: "Database seeded successfully"});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
});

async function addNewSupplier(newSupplier){
    let result=await Supplier.create(newSupplier);
    return result;
} 

app.post('/suppliers/new',async(req,res)=>{
    try{
        const newSupplier = req.body;
        const result=await addNewSupplier(newSupplier);   
        return res.status(200).json({message:"new supplier added successfully",result});
    }catch(error){
         return res.status(500).json({error:error.message});
    }
});

async function addNewProduct(newProduct){
    let result=await Product.create(newProduct);
    return result;
}

app.post('/products/new',async(req,res)=>{
    try{
      const newProduct=req.body;
      const result=await addNewProduct(newProduct);
      return res.status(200).json({message:"new product added successfully",result});
    
    }catch(error){
        return res.status(500).json({error:error.message});
    }
});

async function addNewCategory(newCategory){
    let result=await Category.create(newCategory);
    return result;
}

app.post('/categories/new',async(req,res)=>{
    try{
      const newCategory=req.body;
      const result=await addNewCategory(newCategory);
      return res.status(200).json({message:"new category added successfully",result});
    
    }catch(error){
        return res.status(500).json({error:error.message});
    }
});

async function assignProductToCategory(productId,categoryId){
     const result=await ProductCategory.create({productId,categoryId});
     return result;
}

app.post('/products/:productId/assignCategory/:categoryId',async(req,res)=>{
    try{
       let productId=req.params.productId;
       let categoryId=req.params.categoryId;
       let result=await assignProductToCategory(productId,categoryId); 
       return res.status(200).json({message:"new ProductCategory added successfully",result});

    }catch(error){
        return res.status(500).json({error:error.message});
    }
});

app.get('/categories/:id/products',async(req,res)=>{
    try{
        const id=req.params.id;
        const productsIds=await ProductCategory.findAll({where:{categoryId:id}});
        const result=[];
        for(const id of productsIds){
            result.push(await Product.findOne({where:{id:id}}));
        }
        return res.status(200).json({products:result});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
    
});

app.post('/suppliers/:id/update',async(req,res)=>{
    try{
       const id=req.params.id;
       const updateSupplier=req.body.updateSupplier;
       await Supplier.update(
        updateSupplier,
        {
        where:{
            id:id,
        
       }});
       const result=await Supplier.findOne({where:{id:id}});
       return res.status(200).json({message:"supplier updated successfully",result});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
});

app.post('/suppliers/delete/:supplierId',async(req,res)=>{
    try{
    const supplierId=parseInt(supplierId);
    const supllierRow=await Supplier.destroy({
        where:{id:supplierId}
    });
    const productRow=await Product.destroy({
        where:{id:supplierId}
    });
    if(supllierRow===0)
        return res.json({message:"supplier not found in this id"});
    if(productRow===0)
        return res.json({message:"products not foud in this supplier id"});
    res.status(200).json({message:"supplier and product deleted successfully"});
    }catch(error){
        return res.status(500).json({error:error.message});
    }
});



app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));