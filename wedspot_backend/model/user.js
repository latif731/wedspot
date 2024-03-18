import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minLength:[5, "Password should be grater than 4 character"],
        select: false,
    },
    phoneNumber:{
        type:Number,
    },
    birthday:{
        type:String
    },
    addresses:[
        {
            country:{
                type:String,
            },
            city:{
                type:String
            },
            address1:{
                type:String
            },
            address2:{
                type:String
            },
            zipCode:{
                type:Number
            },
            addressType:{
                type:String
            },
        }
    ],
    role:{
        type: String,
        default: "user"
    },
    avatar:{
        // type: String,
        // required: true
        public_id:{
            type: String,
            // required: true,
        },
        url:{
            type: String,
            // required: true
        }
    },
    createdAt:{
        type: String,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
    refreshToken:{
        type: String,
        default: null
    }
})


// userSchema.methods.generateRefreshToken = function () {
//     // Generate a refresh token
//     const refreshToken = jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET)
//     // user.refreshToken = refreshToken
//     // user.save()
//     this.refreshToken = refreshToken;
//     this.save();

//     return refreshToken;
// }

userSchema.methods.generateRefreshToken = async function () {
    return new Promise((resolve, reject) => {
      try {
        // Generate a refresh token
        const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET);
  
        // Save the refresh token to the user document
        this.refreshToken = refreshToken;
        this.save();
  
        resolve(refreshToken);
      } catch (error) {
        reject(error);
      }
    });
  };
  



userSchema.pre("save", async function (next){   
    if(!this.isModified("password")){
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  


// jwt token
userSchema.methods.getJwtToken =  function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

  
  // compare password
  userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log("Entered Password", enteredPassword)
    console.log("Stored Hashed Password", this.password)
    return await bcrypt.compare(enteredPassword, this.password);
  };

  export default mongoose.model("User", userSchema);