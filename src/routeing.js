/*
 * @Author: liyonglong
 * @Date: 2019-10-17 22:31:47
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-18 00:20:13
 */
const amqp = require('amqplib/callback_api')

module.exports.send = () => {
  amqp.connect('amqp://localhost:5672', (err0, connection) => {
    if (err0) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }

      // 还是声明交换
      const exchange = 'color'
      // 声明交换, direct , 不持续
      ch.assertExchange(exchange, 'direct', { durable: false })

      setInterval(()=>{

          ch.publish(exchange, 'red', Buffer.from(`red msg`))
          console.log(`[red] msg 发送完毕`)
          
          ch.publish(exchange, 'blue', Buffer.from(`blue msg`))
          console.log(`[blue] msg 发送完毕`)
          
          ch.publish(exchange, 'green', Buffer.from(`green msg`))
          console.log(`[green] msg 发送完毕`)
        },1000)
    })
  })
}

module.exports.receive = () => {
  amqp.connect('amqp://localhost:5672', (err0, connection) => {
    if (err0) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }

      // 还是声明交换
      const exchange = 'color'
      // 声明交换, direct , 不持续
      ch.assertExchange(exchange, 'direct', { durable: false })

      // 接收 direct 类型 下 blue 的消息
      ch.assertQueue('', { durable: false }, (err2, q) => {
        if (err2) {
          throw err2
        }
        ch.bindQueue(q.queue,exchange,'red')
        ch.bindQueue(q.queue,exchange,'blue')
        
        ch.consume(q.queue,(msg)=>{
            console.log(`--> red/blue收到${exchange} 交换机绑定的队列:${q.queue} 过来的消息:${msg.content.toString()}`)
        },{noAck: true})
      })
      // 接收 direct 类型 下 red 的消息
      ch.assertQueue('', { durable: false }, (err2, q) => {
        if (err2) {
          throw err2
        }
        ch.bindQueue(q.queue,exchange,'blue')
        ch.bindQueue(q.queue,exchange,'green')
        ch.consume(q.queue,(msg)=>{
            console.log(`--> blue/green 收到${exchange} 交换机绑定的队列:${q.queue} 过来的消息:${msg.content.toString()}`)
        },{noAck: true})
      })
    })
  })
}
