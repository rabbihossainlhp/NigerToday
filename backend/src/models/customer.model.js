const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, "Fullname is required"], 
      minlength: 10, 
      maxlength: 2000
    },
    
    phone:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required:true,
    },

    startDate:{
        type: Date,
        required:false,
        default:null,
    },

    durationMonths:{
        type:Number,
        required:false,
        default:null,
    },

    expiresAt:{
        type:Date,
        required:false,
        default:null,
    },


  },
  { 
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Customers", customerSchema);
