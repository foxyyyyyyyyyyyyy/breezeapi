export default function (client: any, message: any) {
    console.log("Hit Message Create")  
  if (message.content === 'ping') {
    message.reply('Pong!');
  }
} 