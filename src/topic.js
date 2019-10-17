/*
 * @Author: liyonglong 
 * @Date: 2019-10-17 23:34:38 
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-18 00:10:52
 */
/*
 * @Author: liyonglong
 * @Date: 2019-10-17 22:31:47
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-17 23:09:15
 */
const amqp = require('amqplib/callback_api')

module.exports.send = () => {
  amqp.connect('amqp://106.54.31.73:5672', (err0, connection) => {
    if (err0) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }

      // 还是声明交换
      const exchange = 'shop'
      // 声明交换, topic , 不持续
      ch.assertExchange(exchange, 'topic', { autoDelete:true,durable: false })

    //   setInterval(()=>{

          ch.publish(exchange, 'goods.add', Buffer.from(`商品增加`))
          console.log(`[goods.add] msg 发送完毕`)
          
          ch.publish(exchange, 'goods.export.send', Buffer.from(`商品出货`))
          console.log(`[goods.export.send] msg 发送完毕`)

          ch.publish(exchange, 'goods.evaluate', Buffer.from(`商品评价`))
          console.log(`[goods.evaluate] msg 发送完毕`)
          
          ch.publish(exchange, 'goods.addCar', Buffer.from(`商品加购物车`))
          console.log(`[goods.addCar] msg 发送完毕`)

          ch.publish(exchange, 'goods.export.returned', Buffer.from(`商品退货`))
          console.log(`[goods.export.returned] msg 发送完毕`)

          ch.publish(exchange, 'goods.export.change', Buffer.from(`商品换货`))
          console.log(`[goods.export.change] msg 发送完毕`)
        // },1000)
    })
  })
}

module.exports.receive = () => {
  amqp.connect('amqp://106.54.31.73:5672', (err0, connection) => {
    if (err0) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }

      // 还是声明交换
      const exchange = 'shop'
      // 声明交换, topic , 不持续
      ch.assertExchange(exchange, 'topic', { autoDelete:true,durable: false })

      // 商品操作队列
      ch.assertQueue('', { autoDelete:true,durable: false }, (err2, q) => {
        if (err2) {
          throw err2
        }
        ch.bindQueue(q.queue,exchange,'goods.add')
        ch.bindQueue(q.queue,exchange,'goods.export.send')
        ch.bindQueue(q.queue,exchange,'goods.evaluate')
        ch.bindQueue(q.queue,exchange,'goods.addCar')
        ch.bindQueue(q.queue,exchange,'goods.add')
        
        ch.consume(q.queue,(msg)=>{
            console.log(`--> 商品收到${exchange} 交换机绑定的队列:${q.queue} 过来的消息:${msg.content.toString()}`)
        })
      },{noAck:true})

      // 商品售后队列
      ch.assertQueue('', { autoDelete:true,durable: false }, (err2, q) => {
        if (err2) {
          throw err2
        }
        ch.bindQueue(q.queue,exchange,'goods.export.returned')
        ch.bindQueue(q.queue,exchange,'goods.export.change')
        ch.consume(q.queue,(msg)=>{
            console.log(`--> 售后 收到${exchange} 交换机绑定的队列:${q.queue} 过来的消息:${msg.content.toString()}`)
        })
      },{noAck:true})

      // 商品进出货统计
      ch.assertQueue('', { autoDelete:true,durable: false }, (err2, q) => {
        if (err2) {
          throw err2
        }
        ch.bindQueue(q.queue,exchange,'goods.add')
        ch.bindQueue(q.queue,exchange,'goods.export.*')
        ch.consume(q.queue,(msg)=>{
            console.log(`--> 进出货统计 收到${exchange} 交换机绑定的队列:${q.queue} 过来的消息:${msg.content.toString()}`)
        })
      },{noAck:true})
    })
  })
}
