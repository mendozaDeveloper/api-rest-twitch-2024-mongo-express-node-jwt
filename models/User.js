import mongoose from "mongoose";
import bcryptjs from "bcryptjs"

const {Schema, model} = mongoose;

const userSchema = new Schema({
    email: {
        type:String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    }
})

// Esto hashea la contraseña antes de guardarla con el metodo SAVE
userSchema.pre("save", async function(next){
    const user = this;

    if(!user.isModified("password")) return next()

    try {
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(user.password, salt)
        next()
    } catch (error) {
        console.log(error)
        throw new Error("Fallo el hash de la contraseña")
    }
})

//metodo para comparar la contraseña guardada en BD con la que manda el usuario al momento de logearse
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password)
}

export const User = model('user', userSchema)

