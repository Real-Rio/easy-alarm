# Easyalarm



### 安装

```bash
npm install
npx expo run:ios
```



## 产品介绍

### 功能点

1. **快速闹钟：**支持点选闹钟在多长时间后触发，而无需计算闹钟触发的时间。类似计时器的功能，适用于一些持续时间确定的事件，比如：30分钟后起床，1小时后结束健身等

   <img src="https://cdn.jsdelivr.net/gh/Real-Rio/pictures/img/image-20231026103525296.png" alt="image-20231026103525296" style="zoom:15%;" />

2. **常规闹钟：**支持通过点选闹钟组件，快速选择要循环的日子，比如：每周三晚上10点背单词

<img src="https://cdn.jsdelivr.net/gh/Real-Rio/pictures/img/image-20231026103809123.png" alt="image-20231026103809123" style="zoom:15%;" />



### 程序设计

- 框架：react native+expo
- 持久化储存：react-native-async-storage
- ui及组件：react-native-paper、tailwindcss
- 消息推送服务：notifee



本app使用react native+expo开发，动机是从自身需求出发，开发一个简洁易用的闹钟app。因为大学生生活比较规律，各种提醒事项按照星期为周期进行循环，所以需要能够快速的选择、查看闹钟循环的日子。同时，生活中有许多类似定时器的闹钟需求，我只想睡40分钟，并不想计算40分钟后是几点，以及闹钟响铃的准确时间。因此，本app设计了快速闹钟模块，可以快速点选闹钟在多长时间后触发。 

第三方闹钟app并不像原生闹钟那样支持全屏触发闹钟，只能通过通知推送的方式触发，好在ios通知推送支持自定义30s以下音乐，从而与普通应用的通知进行区分。开发中遇到的问题是若要实现闹钟app清理后台后仍能按时推送，需要push notification，而这需要苹果开发者账户才能进行调试，因为财力有限，本app进行了阉割，只支持前台推送。但是前台推送和远程推送的基本逻辑是一样的，方便app后续进行功能迭代。

闹钟应该保存在本地，使得即使退出程序，添加的闹钟也能及时恢复，故使用react-native-async-storage进行持久化储存。



### 软件架构图

<img src="https://cdn.jsdelivr.net/gh/Real-Rio/pictures/img/image-20231026112315161.png" alt="image-20231026112315161" style="zoom:30%;" />



### 软件亮点

- ui设计美观
- 动画流畅
- 简单易用



