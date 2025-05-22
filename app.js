const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = "qwerasdfzxcv";

const users = [
    { id: '1', email: 'user1@gmail.com', password: 'senha1', cpf: 'xxx.xxx.xxx-xx' },
    { id: '2', email: 'user2@gmail.com', password: 'senha2', cpf: 'yxx.xxx.xxx-xx' },
    { id: '3', email: 'user3@gmail.com', password: 'senha3', cpf: 'kxx.xxx.xxx-xx' }
];


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ msg: "Credenciais inválidas" });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.json({ 
        token,
        user: { id: user.id, email: user.email } 
    });
});


app.get("/cpf", (req, res) => {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Formato de token inválido" });
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = users.find(u => u.id === decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        
        return res.json({ 
            cpf: user.cpf,
            email: user.email
        });
        
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
});

app.listen(3000, () => console.log("Server is up in 3000"));