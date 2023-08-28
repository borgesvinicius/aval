import express from "express";
import { v4 as uuidv4, v5 as uuidv5, NIL as uuidNil } from "uuid";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());
const users = [];
const messages = [];

app.post("/signup", async (request, response) => {
  const { nome, email, senha } = request.body;
  const validation = users.find((user) => user.email === email);
  if (validation) {
    return;
    response.status(400).json({
      message: "Esse email já foi cadastrado !",
    });
  }
  const hashedPassword = await bcrypt.hash(senha, 10);
  const user = {
    id: uuidv4(),
    id,
    nome,
    email,
    senha: hashedPassword,
  };
  users.push(user);

  return;
  response.status(201).json({
    message: "Foi criado o usuário !",
    usuario: user,
  });
});
app.post("/login", async (request, response) => {
  const { email, senha } = request.body;
  const user = users.find((user) => user.email === email);
  const senhaCombinada = await bcrypt.compare(senha, user.senha);
  if (!senhaCombinada) {
    return response.status(400).json({
      message: "Credenciais inválidas.",
    });
  }
  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado.",
    });
  }
  response.status(200).json({
    message: "Login bem-sucedido!",
    userId: user.id,
  });

  app.post("/messages", (request, response) => {
    const { titulo, descricao, userId } = request.body;
    const user = users.find((user) => user.id === userId);
  });
  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado.",
    });
  }
  const novaMessage = {
    id: uuidv4(),
    titulo,
    descricao,
    userId,
  };
  messages.push(novaMessage);
  response.status(201).json({
    message: "Recado criado com sucesso.",
    novaMessage,
  });
});
app.get("/messages/:userId", (resquest, response) => {
  const { userId } = resquest.params;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado.",
    });
  }

  const userMessages = messages.filter((message) => message.userId === userId);

  response.status(200).json(userMessages);
});
app.put("/messages/:messageId", (request, response) => {
  const { messageId } = request.params;
  const { titulo, descricao } = request.body;

  const messageIndex = messages.findIndex(
    (message) => message.id === messageId
  );

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado.",
    });
  }

  messages[messageIndex].titulo = titulo;
  messages[messageIndex].descricao = descricao;

  response.status(200).json({
    message: "Recado atualizado com sucesso.",
  });
});
app.delete("/messages/:messageId", (request, response) => {
  const { messageId } = request.params;

  const messageIndex = messages.findIndex(
    (message) => message.id === messageId
  );

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado.",
    });
  }

  const deletedMessage = messages.splice(messageIndex, 1);

  response.status(200).json({
    message: "Recado excluído com sucesso.",
    deletedMessage,
  });
});

app.listen(8080, () => console.log("server nice on g"));
