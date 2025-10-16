# /data-producer/producer.py
import pika
import json
import time
import random
import uuid

# 1. Conecta ao servidor do RabbitMQ que está rodando no Docker
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# 2. Garante que a fila 'transactions' exista. Se não existir, ela será criada.
queue_name = 'transactions'
channel.queue_declare(queue=queue_name)

print(" [->] Produtor de transações iniciado. Pressione CTRL+C para sair.")

try:
    # 3. Loop infinito para gerar e publicar mensagens
    while True:
        # Monta uma transação de exemplo
        transaction = {
            'id': str(uuid.uuid4()),
            'amount': round(random.uniform(1.0, 500.0), 2),
            'currency': 'BRL',
            'card_brand': random.choice(['Visa', 'Mastercard', 'Elo']),
            'timestamp': time.time()
        }

        # Converte o dicionário Python para uma string JSON
        message = json.dumps(transaction)

        # 4. Publica a mensagem na fila 'transactions'
        channel.basic_publish(exchange='',
                              routing_key=queue_name,
                              body=message)

        print(f" [x] Enviado: {message}")

        # Espera 1 segundo antes de enviar a próxima
        time.sleep(1)

except KeyboardInterrupt:
    print("\n [<-] Produtor de transações finalizado.")
finally:
    # Fecha a conexão ao sair
    connection.close()