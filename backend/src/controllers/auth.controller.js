import jwt from 'jsonwebtoken'
import { users } from "../data/store.js"

export async function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({message: 'Correo y contraseña requeridos'})

    const user = users.find(u=> u.email === email)
    if(!user || user.password !== password) {
        return res.status(401).json({message: 'Datos incorrectos'})
    }

    const token = jwt.sign({ id: user.id, emial: user.email }, process.env.JWT_SECRET, { expiresIn: '4h'})
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
}