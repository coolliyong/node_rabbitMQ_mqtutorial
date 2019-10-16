/*
 * @Author: liyonglong
 * @Date: 2019-10-16 23:41:36
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-17 00:06:55
 */

const amqp = require('amqplib/callback_api')
//  发布订阅
module.exports.send = function() {
  amqp.connect('amqp://106.54.31.73:5672', (err0, connection) => {
    if (err) {
      throw err
    }
    // 创建通道
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }
      // 声明队列
      const exchange_name = 'pb'
      // 创建临时交换机 关闭持久化，消费者断开会自动销毁
      ch.assertExchange(exchange_name, 'fanout', { durable: false })
      // 发布到交换机上
      // 参数1 交换机名字 参数2 指定队列 3 内容
      channel.publish(exchange_name, '', Buffer.from('Hello World!'))
    })
  })
}
