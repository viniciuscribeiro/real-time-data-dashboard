// /dashboard-frontend/src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define a "forma" de uma transação
interface Transaction {
    id: string;
    amount: number;
    timestamp: number;
}

// Conecta ao nosso backend que está na porta 4000
const socket = io("http://localhost:4000");

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // 1. Busca os dados iniciais via API REST
        const fetchInitialData = async () => {
            const response = await axios.get<Transaction[]>("http://localhost:4000/api/transactions");
            // Invertemos os dados para o gráfico ficar da esquerda para a direita (do mais antigo para o mais novo)
            setTransactions(response.data.reverse());
        };
        fetchInitialData();

        // 2. Ouve por novas transações via WebSocket
        socket.on('new-transaction', (newTransaction: Transaction) => {
            console.log("Nova transação recebida:", newTransaction);
            // Adiciona a nova transação à lista existente
            // Mantemos apenas as últimas 50 transações na tela para o gráfico não ficar sobrecarregado
            setTransactions(currentTransactions => [...currentTransactions, newTransaction].slice(-50));
        });

        // Limpa o listener quando o componente é desmontado
        return () => {
            socket.off('new-transaction');
        };
    }, []);

    return (
        <Box bg="gray.900" minH="100vh" color="white" py={10}>
            <Container maxW="container.lg">
                <VStack spacing={4} mb={8}>
                    <Heading>Dashboard de Transações em Tempo Real</Heading>
                    <Text color="gray.400">Visualizando as últimas 50 transações recebidas.</Text>
                </VStack>
                <Box height="500px">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={transactions}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis 
                                dataKey="timestamp" 
                                stroke="#A0AEC0"
                                tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
                            />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} 
                            />
                            <Legend />
                            <Line type="monotone" dataKey="amount" name="Valor da Transação (BRL)" stroke="#8884d8" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Container>
        </Box>
    );
}

export default App;