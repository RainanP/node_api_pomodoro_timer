import express from "express";
import cors from "cors";
import User from "./user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const server = express();

server.use(express.json());
server.use(cors()); // Se eu não usar esse cors, ele bloqueia o acesso do meu site, e aí não consigo conectar os dois, isso desbloqueia

server.get("/", async (req, res) => {
  res.status(200).json({ status: "ok" })
})

server.post("/registro", async (req, res) => {
  const hashedpassword = await bcrypt.hash(req.body.password, 10); // Cria um hash da senha que venho na request
  try {
    const user = await User.create({
      email: req.body.email,
      password: hashedpassword,
      timeXP: 0,
      timeFull: 0,
      xp: 0,
    }); // Cria o usuário no meu banco de dados com o mongoose Schema

    const userLogged = await User.findOne({ email: user.email });
    const tokenNum = jwt.sign(
      { id: userLogged.id, email: userLogged.email },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );
    res.status(201).json({
      token: tokenNum,
      mensagem: "Registrado com sucesso!",
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(401).json({
        mensagem: `Usuário já cadastrado`,
      });
    } else {
      res.status(401).json({
        mensagem: `Erro: ${error}`,
      });
    }
  }
});

server.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ mensagem: "Usuário não encontrado." });
  }

  if (user) {
    const senha_hash = user.password;
    const verificacao = await bcrypt.compare(req.body.password, senha_hash);
    if (!verificacao) {
      return res.status(401).json({ mensagem: "Senha inválida." });
    }
    if (verificacao) {
      const tokenNum = jwt.sign(
        { id: user.id, email: user.email },
        // eslint-disable-next-line no-undef
        process.env.JWT_SECRET,
        { expiresIn: "12h" },
      );
      res.status(200).json({
        token: tokenNum,
        xp: user.xp,
        mensagem: "Logado",
      });
    } else if (!verificacao) {
      res.json({
        mensagem: "Senha incorreta",
      });
    }
  }
});

server.post("/datatime", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const cronometro = req.body.cronometro;
    if (!user) {
      return res
        .status(401)
        .json({ mensagem: "Token inválido", aprovado: false });
    }
    if (user) {
      if (cronometro >= 5 * 60 * 1000 && cronometro <= 120 * 60 * 1000) {
        const timeCronometro = req.body.cronometro + Date.now();
        const updateXP = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              timeXP: cronometro,
              timeFull: timeCronometro,
            },
          },
          { new: true },
        );
        res.json({
          aprovado: true,
          mensagem: "Aprovado",
        });
      } else if (cronometro < 5 * 60 * 1000 || cronometro > 120 * 60 * 1000) {
        res.json({
          aprovado: false,
          mensagem: "Valor inválido de tempo",
        });
      }
    }
  } catch {
    res.json({
      aprovado: false,
      mensagem: "Token inválido ou expirado",
    });
  }
});

server.post("/verifycronos", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ mensagem: "Token inválido", aprovado: false });
    }
    if (user) {
      if (user.timeFull > Date.now()) {
        res.json({
          aprovado: false,
          mensagem: "Tempo insuficiente",
        });
      } else if (user.timeFull <= Date.now()) {
        let xpNew = user.timeXP / 1000;
        xpNew = xpNew + user.xp;
        const updateXP = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              xp: xpNew,
              timeXP: 0,
              timeFull: 0,
            },
          },
          { new: true },
        );
        let level = 0;
        let x = false;
        while (x == false) {
          if (xpNew >= 500 + 100 * level) {
            xpNew = xpNew - (500 + 100 * level);
            level = level + 1;
          } else if (xpNew < 500 + 100 * level) {
            const barraLevelFrontEnd = (xpNew * 100) / (500 + 100 * level);
            res.json({
              aprovado: true,
              lvl: level,
              barra: barraLevelFrontEnd,
            });
            x = true;
          }
        }
      }
    }
  } catch {
    res.json({
      mensagem: "Token expirado, ou inválido, faça o login novamente.",
      aprovado: false,
    });
  }
});

server.post("/level", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    let xp = user.xp;
    let level = 0
    let x = true;
    while (x == true) {
      if (xp >= 500 + 100 * level) {
        xp = xp - (500 + 100 * level);
        level = level + 1;
      } else if (xp < 500 + 100 * level) {
        const barraLevelFrontEnd = (xp * 100) / (500 + 100 * level);
        res.json({
          aprovado: true,
          lvl: level,
          barra: barraLevelFrontEnd,
        });
        x = false;
      }
    }
  } catch {
    res.json({
      aprovado: false,
      mensagem: "Erro ao consultar token",
    });
  }
});

export default server;
