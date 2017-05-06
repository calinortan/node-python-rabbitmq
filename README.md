# node-python-rabbitmq
Example with node server communicating with python script via rabbitmq

Small nodejs server which executes a python script on demand.
Also, within the python script, a connection to mongodb is established.
RabbitmqResolver class communicates with the rabbitmq server and provides a promise alternative for this 

note: RabbitMq server must be running for this to work
