# 📁  Estrutura dos Diretórios (pastas) 
```
📦 SEU-REPOSITÓRIO
│
├── package.json
├── server.js
├── .env
├── knexfile.js
├── INSTRUCTIONS.md

│
├── db/
│ ├── migrations/
│ ├── seeds/
│ └── db.js
│
├── routes/
│ ├── agentesRoutes.js
│ └── casosRoutes.js
│
├── controllers/
│ ├── agentesController.js
│ └── casosController.js
│
├── repositories/
│ ├── agentesRepository.js
│ └── casosRepository.js
│
├── utils/
│ └── errorHandler.js
│

  
```

### 1. Configurar o banco de dados PostgreSQL com Docker
- Crie um arquivo .env na raíz do projeto para armazenar as seguintes variáveis de ambiente do nosso banco de dados:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
```
**OBSERVAÇÃO: o uso de valores diferentes resultará em falhas nos testes**

- Crie um arquivo `docker-compose.yml` na raiz do projeto para subir um container do PostgreSQL com um **volume persistente**, utilizando as váriaveis de ambiente para inserir dados sensíveis. Tenha certeza de seu container está rodando quando for desenvolver sua aplicação

docker compose up -d 
  
### 2. Instalar o knex e criar o arquivo **`knexfile.js`**
- Primeiro instale o knex localmente com `npm install knex pg`
- Rode `npm install dotenv` para utilizarmos variáveis do arquivo .env
- Agora, na **raiz do projeto**, devemos criar o knexfile.js com o comando `npx knex init`. Ele cria um arquivo de configurações de conexão com o PostgreSQL para diversos ambientes. Criaremos uma configuração de desenvolvimento para nos conectarmos ao banco que criamos e adicionaremos caminhos para a criação de migrations e seeds, edite esse arquivo para deixá-lo assim:

```js
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
        directory: './db/migrations',
      },
    seeds: {
        directory: './db/seeds',
      },
  },
  ci: {
    client: 'pg',
    connection: {
      host: 'postgres', // Using the service name as the host
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  }

};

```

### 3. Criar a pasta `db/`
Dentro da pasta `db/`, você deve criar os seguinte arquivo:

#### **`db.js`**
Arquivo responsável por criar e exportar a instância do Knex:

```js
const config = require("../knexfile")
const knex = require("knex")

const db = knex(config.development)

module.exports = db
```

---

### 4. Criar as Migrations
- Use o Knex CLI para gerar as migrations com o seguinte nome (Tem certeza de que o diretório que você se encontra no terminal é a raiz do projeto, do contrário você terá uma pasta `db/` duplicada):

```bash
npx knex migrate:make solution_migrations

```

- As tabelas devem ter as seguintes colunas:
  - `agentes`: `id`, `nome (string)`, `dataDeIncorporacao (date)`, `cargo (string)`
  - `casos`: `id`, `titulo (string)`, `descricao (string)`, `status (aberto/solucionado)`, `agente_id` com **foreign key** para `agentes.id`.

**IMPORTANTE! Não utilizaremos mais o uuid, pois o PostgreSQL lida com a lógica de indexação e incrementa automaticamente. Jamais explicite o id dentro de um payload que será guardado no banco de dados, pois isso pode causar comportamento indesejado**
- Aplique as migrations com:
```bash
npx knex migrate:latest
```
---

### 5. Criar Seeds
- Crie seeds para popular as tabelas com pelo menos 2 agentes e 2 casos. Crie um arquivo para cada tabela e siga a nomeclatura que definimos abaixo. (Tem certeza de que o diretório que você se encontra no terminal é a raiz do projeto, do contrário você terá uma pasta `db/` duplicada):

```bash
npx knex seed:make agentes
npx knex seed:make casos


```
- Execute as seeds com:
```bash
npx knex seed:run