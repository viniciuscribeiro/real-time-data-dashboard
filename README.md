

# Painel de Análise de Dados em Tempo Real 📊📈

<br>

> <img width="1084" height="707" alt="image" src="https://github.com/user-attachments/assets/80803953-5dad-43e5-b5ef-158f5a17548d" />

-----

## 📑 Índice

  - [Sobre o Projeto](https://www.google.com/search?q=%23-sobre-o-projeto)
  - [Principais Funcionalidades](https://www.google.com/search?q=%23-principais-funcionalidades)
  - [Arquitetura do Sistema](https://www.google.com/search?q=%23-arquitetura-do-sistema)
  - [Tecnologias Utilizadas](https://www.google.com/search?q=%23-tecnologias-utilizadas)
  - [Como Executar o Projeto](https://www.google.com/search?q=%23-como-executar-o-projeto)
  - [Contato](https://www.google.com/search?q=%23-contato)

-----

## 📖 Sobre o Projeto

Este é um sistema completo de **pipeline de dados em tempo real**, construído para simular o processamento e a visualização de um fluxo contínuo de transações financeiras. O projeto demonstra uma arquitetura robusta e orientada a eventos, onde múltiplos serviços independentes colaboram de forma assíncrona.

Pense no sistema como uma "fábrica" de dados:

1.  Um **Produtor** em Python gera dados incessantemente.
2.  Uma **Fila de Mensagens** (RabbitMQ) atua como uma esteira, transportando esses dados de forma segura.
3.  Um **Consumidor** em Node.js pega os dados da esteira, os processa, salva em um banco de dados (MongoDB) e notifica a interface.
4.  Um **Dashboard** em React exibe os dados em um gráfico que se atualiza ao vivo, sem a necessidade de recarregar a página.

Este projeto vai além de uma aplicação CRUD tradicional, focando em conceitos de engenharia de dados e sistemas distribuídos.

-----

## ✨ Principais Funcionalidades

  - **Streaming de Dados:** Um script Python gera e publica eventos de transação a cada segundo.
  - **Processamento Assíncrono:** Uso do RabbitMQ para desacoplar o produtor do consumidor, garantindo que nenhuma mensagem seja perdida.
  - **Visualização em Tempo Real:** O dashboard se conecta ao backend via **WebSockets** (Socket.IO) e atualiza o gráfico instantaneamente a cada nova transação recebida.
  - **Persistência de Dados:** As transações processadas são armazenadas em um banco de dados NoSQL (MongoDB) para futuras consultas.
  - **API REST:** Um endpoint fornece o histórico de transações para popular o dashboard no carregamento inicial.
  - **Containerização:** Os serviços de infraestrutura (RabbitMQ e MongoDB) são gerenciados com **Docker**, garantindo um ambiente de desenvolvimento limpo e replicável.

-----

## 🏗️ Arquitetura do Sistema

A arquitetura orientada a eventos é o coração deste projeto, permitindo que os serviços operem de forma independente e escalável.

**Fluxo de Dados:**

```
┌───────────┐      ┌───────────┐      ┌──────────────────┐      ┌───────────┐
│           │      │           │      │                  │      │           │
│  Produtor │────▶ │ RabbitMQ  │────▶ │  Processador     │────▶ │ MongoDB │
│ (Python)  │      │  (Fila)   │      │ (Node.js)        │      │           │
│           │      │           │      │                  │      │           │
└───────────┘      └───────────┘      └───────┬──────────┘      └───────────┘
                                             │ (WebSocket)
                                             │
                                             ▼
                                     ┌───────────────┐
                                     │               │
                                     │   Dashboard   │
                                     │    (React)    │
                                     │               │
                                     └───────────────┘
```

-----

## 🚀 Tecnologias Utilizadas

**Infraestrutura e DevOps:**

  - **Docker**
  - **RabbitMQ** (Message Broker)

**Backend:**

  - **Produtor de Dados:**
      - **Python**
      - **Pika** (Cliente RabbitMQ)
  - **Processador de Dados / API:**
      - **Node.js**
      - **Express.js**
      - **Socket.IO** (WebSockets)
      - **amqplib** (Cliente RabbitMQ)

**Banco de Dados:**

  - **MongoDB** (com driver `mongodb`)

**Frontend:**

  - **React** com **Vite**
  - **TypeScript**
  - **Chakra UI** (Componentes Visuais)
  - **Recharts** (Biblioteca de Gráficos)
  - **Socket.IO Client**

-----

## ⚙️ Como Executar o Projeto

**Pré-requisitos:**

  - [Node.js](https://nodejs.org/en/) (v18 ou superior)
  - [Python](https://www.python.org/downloads/) (v3.8 ou superior)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**1. Clone o repositório:**

```bash
git clone https://github.com/viniciuscribeiro/projeto-analise-tempo-real.git # Substitua pela URL correta
cd projeto-analise-tempo-real
```

**2. Inicie os serviços de infraestrutura (Docker):**

```bash
# Inicie o RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Inicie o MongoDB
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

**3. Inicie o Produtor de Dados (Python):**

```bash
# Abra um novo terminal
cd data-producer
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1 | Linux/macOS: source venv/bin/activate
pip install pika
python producer.py
```

**4. Inicie o Processador de Dados (Node.js):**

```bash
# Abra um terceiro terminal
cd data-processor
npm install
node server.js
```

**5. Inicie o Dashboard (React):**

```bash
# Abra um quarto terminal
cd dashboard-frontend
npm install
npm run dev
```

Acesse **http://localhost:5173** (ou a porta indicada pelo Vite) no seu navegador.

-----

## 📞 Contato

**Vinicius Cordeiro Ribeiro**

  - **Email:** viniciuscordeiroribeiro@gmail.com
  - **LinkedIn:** [https://www.linkedin.com/in/viniciuscordeiroribeiro/](https://www.linkedin.com/in/viniciuscordeiroribeiro/)
  - **GitHub:** [https://github.com/viniciuscribeiro](https://github.com/viniciuscribeiro)
