import pika
import pymongo
from config import mongodb_url
from bson.json_util import dumps


def get_mongo_connection(url, dbName):
    return pymongo.MongoClient(url)[dbName]


def get_users(db):
    user_model = db['users']
    cursor = user_model.find()
    users_list = []
    for u in cursor:
        users_list.append(u)
    return users_list

db_conn = get_mongo_connection(mongodb_url, 'calinortandb')
users = get_users(db_conn)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='USERS')
channel.basic_publish(exchange='',
                      routing_key='USERS',
                      body=dumps(users))
print("[x] Sent users from python script")
connection.close()

