/*
 * @Author: liyonglong
 * @Date: 2019-10-16 23:41:36
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-17 22:31:49
 */

const amqp = require('amqplib/callback_api')
//  发布订阅
module.exports.send = function() {
  amqp.connect('amqp://106.54.31.73:5672', (err0, connection) => {
    if (err0) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }

      // 声明交换机
      const exchange_name = 'pb1'


      // 创建临时交换机 关闭持久化
      ch.assertExchange(exchange_name, 'fanout', { durable: false })
      // 发布到交换机上
      // 参数1 交换机名字 参数2 指定队列 3 内容
      let msgCount = 1
      const timer = setInterval(() => {
        if(msgCount<=10){
          ch.publish(exchange_name, '', Buffer.from(`发布订阅模式消息${msgCount}`))
          msgCount++
        }else{
          clearInterval(timer)
        }
      }, 1500)
      console.log(`发送 消息到交换机 ${exchange_name}`)
    })
  })
}

module.exports.receive = function() {
  /**
   * 1. 。。。创建通道
   * 2. 声明交换机
   */
  amqp.connect('amqp://106.54.31.73:5672', (err0, connect) => {
    if (err0) {
      throw err0
    }
    connect.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }
      // 声明交换机
      const exchange_name = 'pb1'
      // 通道和交换机 交互
      ch.assertExchange(exchange_name, 'fanout', { durable: false })

      // 通道和队列 参数1 队列 参数2 交换类型，
      ch.assertQueue('', 'fanout', (err2, q) => {
        if (err2) {
          throw err2
        }

        // 绑定队列,参数1队列，参数2 路由 参数3 routeing key
        ch.bindQueue(q.queue, exchange_name, '')
        console.log(`绑定成功调用send方法`)
        // module.exports.send()
        let i = 1;
        ch.consume(q.queue, msg => {
          i++
          console.log(`通过交换器找到的队列取出消息：${msg.content.toString()}`)
          if(i >= 10){
            ch.close()
          }
        },{
          noAck: true
        })
      })
    })
  })
}
