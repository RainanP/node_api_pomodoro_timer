# pomodoro-timer

Esta é a minha api em Node que conecta meu banco de dados MongoDB Atlas ao front-end React.

Eu usei hash de senhas para proteger os usuários, verificações com token JWT para autenticação e também faço validações no back-end para garantir que o timer não foi adulterado pelo cliente.

## O que essa API faz

- Cadastro de usuário
- Login com geração de token
- Proteção de rotas com JWT
- Armazena dados do timer no MongoDB
- Verifica no back-end se o tempo enviado pelo front não foi alterado

## Tecnologias usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Bcrypt

## Observações

As credenciais do banco de dados e o segredo do JWT são armazenados em variáveis de ambiente e não ficam expostos no código.
