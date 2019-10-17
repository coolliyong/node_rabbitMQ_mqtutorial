/*
 * @Author: liyonglong
 * @Date: 2019-10-16 20:59:54
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-18 00:20:59
 */

// 工作队列，任务
const amqp = require('amqplib/callback_api')

// 发送消息
module.exports.send = async function() {
  /**
   * 1.连接mq
   * 2.创建通道
   * 3.声明队列
   * 4.创建消息
   * 5.发送消息
   */
  // 1.
  amqp.connect('amqp://106.54.31.73:5672', function(error0, connection) {
    if (error0) {
      throw error0
    }
    // 2
    connection.createChannel(async function(error1, channel) {
      if (error1) {
        throw error1
      }
      // 3.
      const queue = 'workqueue'
      //   // 4.
      //   const msg = 'Hello world'

      channel.assertQueue(queue, {
        durable: false
      })
      // 5.
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            channel.sendToQueue(queue, Buffer.from(`生产消息:${i}`))
            console.log(`[p]<-- 生产消息:${i}`)
            resolve()
          }, 2000)
        })
      }
    })
  })
}

// 接收消息
module.exports.receive = async function(flag, time) {
  /**
   * 1.连接mq
   * 2.创建通道
   * 3.声明队列
   * 4.创建回调函数，等待消息
   */
  // 1.
  amqp.connect('amqp://106.54.31.73:5672', function(error0, connection) {
    if (error0) {
      throw error0
    }
    // 2
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1
      }
      var queue = 'workqueue'

      channel.assertQueue(queue, {
        durable: false
      })

      // 关闭自动回执
      const opt = {
        noAck: false
      }
      // 每次消费一个消息
      channel.prefetch(1)
      // 消费消息
      channel.consume(
        queue,
        msg => {
          const msgText = msg.content.toString()
          console.log(`[c${flag}]--> 接收到消息:${msgText}`)
          setTimeout(() => {
            // 手动发送回执
            channel.ack(msg)
            console.log(`[c${flag}] <--发送回执`)
          }, time)
        },
        opt
      )
    })
  })
}
