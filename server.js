const express = require('express');
const dotenv = require('dotenv');
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./utils/errorHandler');
const { authenticateToken } = require('./middlewares/authMiddleware');
const swagger = require('./docs/swagger.js');
const cookieParser = require('cookie-parser');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/casos", authenticateToken, casosRoutes);
app.use("/agentes", authenticateToken, agentesRoutes);
app.use("/auth", authRoutes);
app.use(cookieParser());

swagger(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em http://localhost/:${PORT}`);
});
