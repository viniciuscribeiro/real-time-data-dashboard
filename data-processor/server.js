// /data-processor/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const amqp = require('amqplib');
const { MongoClient } = require('mongodb');

// --- Configurações ---
const PORT = 4000;
const rabbitMqUrl = 'amqp://localhost';
const queueName = 'transactions';
const mongoUrl = 'mongodb://admin:password@localhost:27017';
const dbName = 'realtime_analytics';
const collectionName = 'transactions';

// --- Inicialização do Servidor Web e Socket.IO ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, restrinja para o domínio do seu frontend
        methods: ["GET", "POST"]
    }
});

async function main() {
    console.log("Iniciando processador...");

    const mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    console.log("Conectado ao MongoDB!");
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    console.log(`[*] Aguardando mensagens na fila: ${queueName}.`);

    // --- Lógica de Consumo do RabbitMQ ---
    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            try {
                const transaction = JSON.parse(msg.content.toString());
                console.log(`[x] Recebido: ${JSON.stringify(transaction)}`);

                // Salva a transação no MongoDB
                await collection.insertOne(transaction);

                // **NOVO:** Envia a transação para todos os clientes conectados via WebSocket
                io.emit('new-transaction', transaction);

                channel.ack(msg);
            } catch (error) {
                console.error("Erro ao processar mensagem:", error);
                channel.nack(msg);
            }
        }
    });

    // --- Endpoint da API REST ---
    app.get('/api/transactions', async (req, res) => {
        // Busca as últimas 50 transações do banco, ordenadas pela mais recente
        const latestTransactions = await collection.find().sort({ timestamp: -1 }).limit(50).toArray();
        res.json(latestTransactions);
    });

    // --- Inicia o servidor ---
    server.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

main().catch(console.error);