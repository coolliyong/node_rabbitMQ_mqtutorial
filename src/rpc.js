/*
 * @Author: liyonglong
 * @Date: 2019-10-18 14:19:13
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-18 15:23:51
 */

const amqp = require('amqplib/callback_api')

module.exports.service = async () => {
  /**
   * 1. 声明rpc 队列
   * 2. 关闭 ack 每次读取一个消息
   * 3. 拿到消息 调用 斐波那契 在发回队列
   * 4. 发送回执ack
   */
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      throw err
    }
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }
      const queue = 'rpc_queue'
      // 声明队列
      ch.assertQueue(queue, {
        derable: false
      })
      // 每次读取一个消息
      ch.prefetch(1)
      ch.consume(queue, function reply(msg) {
        const n = parseInt(msg.content.toString())
        console.log(`reply: n :: ${n}`)
        const r = fibonacci(n)
        ch.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        })
        ch.ack(msg)
      })
    })
  })
}

module.exports.client = async () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      throw err
    }
    connection.createChannel((err1, ch) => {
      if (err1) {
        throw err1
      }
      // 创建队列
      ch.assertQueue('',{derable: false},(err2, q) => {
          if (err2) {
            throw err2
          }
          const correlationId = generateUuid();
          const num = 5
          ch.consume(q.queue,(msg)=>{
              if(msg.properties.correlationId == correlationId){
                console.log(' [.] Got %s', msg.content.toString())
                setTimeout(()=>{
                    connection.close()
                    process.exit(0)
                },500)
              }
          })

          ch.sendToQueue('rpc_queue',Buffer.from(num.toString()),{
            correlationId: correlationId, 
            replyTo: q.queue
          })
          console.log(`调用完成`)

        }
      )
    })
  })
}
// 斐波那契
function fibonacci(n) {
  if (n == 0 || n == 1) {
    return n
  } else {
      console.log(`1--${n-1},2--${n-2}`)
    return fibonacci(n - 1) + fibonacci(n - 2)
  }
}

// 模拟uuid
function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  )
}
