import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { generateToken, generateRefreshToken } from '../utils/tokenManager.js'

export const register = async (req, res) => {
    const { email, password } = req.body

    try {
        // Alternativa buscando por email
        let user = await User.findOne({email})
        if (user) throw {code: 11000}


        user = new User({ email, password})
        await user.save()

        //Generar el token con JWT
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return resstatus(201).json({ token, expiresIn });  
    } catch (error) {
        console.log(error);

        //Alternativa por defecto mongoose
        if(error.code == 11000){
            return res.status(400).json({error: "Ya existe el usuario"})
        }
        return res.status(500).json({error: "Error de servidor"})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        let user = await User.findOne({email})
        if(!user) return res.status(403).json({error: "No existe el usuario"})

        const respuestaPassword = await user.comparePassword(password)
        if(!respuestaPassword) return res.status(403).json({error: "Contraseña incorrecta"}) 

        const {token, expiresIn } = generateToken(user.id)
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn })
    } catch (error) {
        console.log(error);

        return res.status(500).json({error: "Error de servidor"})
    }
}

export const infoUser = async(req, res) => {
    try {
        const user = await User.findById(req.uid)
        return res.json({user})
    } catch (error) {
        return res.status(500).json({ error: "Error del servidor"})
    }
}

export const refreshToken = (req, res) => {
    try {
        const {token, expiresIn} = generateToken(req.uid)

        return res.json({token, expiresIn})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error del servidor"})
    }
}

export const logout = (req, res) => {
    res.clearCookie("refreshToken")
    res.json({ok:true})
}

