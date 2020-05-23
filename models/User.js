const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true, 'Please add a name']
    },
    email: {
        type: String,
        required:[true,'Please add a email'],
        unique:true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },

      role:{
          type: String,
          enum:['user','publisher'],
          default:'user'
      },
      password:{
          type:String,
          required:[true,'Please add a password'],
          minlength:6,
          select: false
      },

      resetPasswordToken:String,
      resetPasswordExpire: Date,
      createdAt:{
          type:Date,
          default: Date.now
      }
});

//Encryp password usinb brycri

UserSchema.pre('save', async function(next){
    
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

// Sing JWT and return

UserSchema.methods.getSinedJwToken = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Match password
    UserSchema.methods.matchPassword = async  function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    }
// Generate and has password token
UserSchema.methods.getResetPasswordToken = function () {
    //generate toke
    const resetTokem = crypto.randomBytes(20).toString('hex');

    //has token and set reset passo
    this.resetPasswordToken = crypto.createHash('sha256').update(resetTokem).digest('hex');

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetTokem;
}
module.exports = mongoose.model('User', UserSchema);