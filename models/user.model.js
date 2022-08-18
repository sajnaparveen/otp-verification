const mongoose=require('mongoose')
const crypto=require('crypto')

const userschema = new mongoose.Schema({
    uuid : {type: String, required : false},
    username:{type:String,required:true},
    email:{type:String,required:true,trim:true,unique:true},
    mobilenumber:{type:String,required:true},
    password:{type:String,required:true},
    verifyed: { type: Boolean, required: false, default: false },
    
},{
    timestamps:true
})

userschema.pre('save',function(next){
    this.uuid='USER-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase()
    next()
})

module.exports = mongoose.model('user',userschema,'user');