const simplest = require('./src/simplest.js')
const workqueue = require('./src/workqueue.js')
const pubsub = require('./src/pubsub.js')
const routeing = require('./src/routeing.js')
const topic = require('./src/topic.js')

//  ------------ 简单队列 -------------

// 发送消息
// simplest.send()

// 发送消息
// simplest.receive()

//  ------------ 工作队列 -------------

// 发送消息
// workqueue.send()

// //接收消息
// workqueue.receive(1, 100)
// // // 接受消息
// workqueue.receive(2, 5000)




// 发布订阅模式

// 消费者监听消息中
// pubsub.receive()

// 生产者生产消息
// pubsub.send()



// routeing 模式
// routeing.receive()


// routeing.send()


// 主题模式


setTimeout(()=>{
    topic.send()
},5000)

topic.receive()