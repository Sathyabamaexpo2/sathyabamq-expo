const mongoose=require('mongoose')
const Cartmodel=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    Patients:[
        {
            name: { type: String, required: true },
            age: { type: Number, required: true },
            gender: { type: String, required: true },
            bloodgroup: { type: String, required: true },
            height: { type: Number, required: true },
            weight: { type: Number, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            // image:{filename:String,path:String}
        }
    ]
})
const cart = mongoose.model("cart", Cartmodel);
module.exports=cart