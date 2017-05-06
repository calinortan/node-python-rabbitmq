const EventEmitter = require('events').EventEmitter;
const amqp = require('amqplib/callback_api');
const exec = require('child_process').exec;

class RabbitmqResolver extends EventEmitter {
  constructor(...channels) {
    super();
    this.establishConnection(channels);
    this.queueMessages = {};
  }

  getEventFromQueue(queueName) {
    return `${queueName}_MESSAGE_EVENT`
  }

  handleMessage(queue, message) {
    this.queueMessages[queue] = message;
    this.emit(this.getEventFromQueue(queue))
  }

  getMessage(queueName) {
    const eventName = this.getEventFromQueue(queueName)
    const eventCb = (resolve) => {
      this.removeAllListeners(this.getEventFromQueue(eventName));
      resolve(this.queueMessages[queueName]);
    };
    return new Promise((resolve) => {
      this.on(eventName, eventCb.bind(this, resolve));
      this.triggerPythonScript()
    });
  }

  triggerPythonScript() {
    exec('python ./scripts/send-users.py', (error, stdout, stderr) => {
      if (error != null) {
        throw (error);
      }
      console.log(stdout);
    });
  }

  establishConnection(channels) {
    amqp.connect('amqp://localhost', (err, conn) => {
      conn.createChannel((err, ch) => {
        console.log('Rabbitmq resolver is waiting for messages...');
        channels.forEach((key) => {
          ch.assertQueue(key, {durable: false});
          ch.consume(key, (msg) => {
            const message = JSON.parse(msg.content.toString());
            this.handleMessage(key, message);
          }, { noAck: true });
        });
      });
    });
  }
}

module.exports = RabbitmqResolver;