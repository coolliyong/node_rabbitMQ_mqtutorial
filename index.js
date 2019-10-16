const simplest = require('./src/simplest/index.js')

// 简单队列

// 发送消息
simplest.send()

//接收消息
simplest.receive(1, 100)
// // 接受消息
simplest.receive(2, 5000)
