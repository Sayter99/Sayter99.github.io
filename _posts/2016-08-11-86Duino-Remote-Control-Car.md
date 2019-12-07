---
toc: true
---
之前寫了一篇有關 [MRAA](http://sayter99.github.io/2016/02/18/Access%2086Duino%20Peripheral%20using%20MRAA/) 的文章，不過裡頭只有簡單的範例，藉由這一次實作遠端遙控車，希望能讓大家更瞭解 MRAA 能夠做些甚麼事情，說不定有些應用剛好很合適用 MRAA 來實作也不一定。

{% include video id="4G-8VedkQHc" provider="youtube" %}

本篇會著重在如何用 MRAA 打造出 web app，硬體部分可以依照自己的想法去改變，基本上你需要有：
* USB Camera 一個
* USB WiFi 網卡一個
* 馬達和輪子，想要如何設計都可以唷
* SD 卡一張，用來裝 L86duntu

後面我會先介紹 L86duntu 的一些功能，最後再把它們串起來，完成遠端遙控車。

## L86duntu 簡介
L86duntu 是專為 86Duino 打造的 Linux 作業系統，開發環境已經算建立得很完整了，除了基本的 GCC、JAVA、Python 還包含：
* [ROS](http://www.ros.org/) Hydro Medusa
* [Node.js](https://nodejs.org/) 0.10.42
* [Scratch](https://scratch.mit.edu/) 1.4.0.6
* [OpenCV](http://opencv.org/) 2.4.9

當然也有方便好用的應用程式，舉幾個我常用的：
* [VNC Server](https://www.realvnc.com/) 4.1.1：使用 RFB（Remote Framebuffer）協定的螢幕畫面分享及遠端操作軟體。
* [MJPG-streamer](https://github.com/codewithpassion/mjpg-streamer)：WebCam 即時影像串流程式。

除了提供工具以外，還有[詳細的圖文教學](http://www.86duino.com/index.php?p=12443&lang=TW)，對於想學習 Linux 系統的人來說應該也是個不錯的機會。

### 超頻 86Duino
使用 L86duntu 我個人建議超頻到 500MHz 的，使用上會比原本的 300MHz 順暢，首先要準備 [86Duino SysImage (參考 86Duino SysImage 工具程式部分)](http://www.86duino.com/?page_id=2844&lang=TW) 接著再[設定 CPU 時脈](http://www.86duino.com/?p=3245&lang=TW)裡用[隱藏指令](http://www.86duino.com/index.php?p=7780&lang=TW)超頻到 500MHz。超頻完成之後就把 SD 卡換成 L86duntu 開始使用囉！

### 操作 L86duntu
L86duntu 最簡易的操作方式是用 USB 虛擬網卡和 SSH 連線，檔案傳輸可以依靠 sftp 的協定來進行。
* [在 Windows 7 / Windows 8 上安裝 USB 網卡驅動程式](http://www.86duino.com/index.php?p=15607&lang=TW)
* [在 Windows 10上安裝 USB 網卡驅動程式](http://www.86duino.com/index.php?p=15623&lang=TW)

按照以上的方式安裝完虛擬網卡之後，可以利用 putty 或是 pietty 等程式連上 L86duntu，選擇 ssh 的方式，IP 設為 `10.0.1.1`，Port 為 `22` 即可。登入時帳號輸入 `dmp`，密碼輸入 `86duino`，等待一下就可以進入 L86duntu 了！

### mjpg-streamer
開進 L86duntu 之後先介紹大家如何使用 mjpg-streamer 這個套件，使用前要將 86Duino 接上一個 usb camera：

```bash
cd /home/dmp/mjpg-streamer/mjpg-streamer
export LD_LIBRARY_PATH="$(pwd)"
./mjpg_streamer -i "./input_uvc.so -y -r 320x240 -f 10" -o "./output_http.so -w ./www" &
```

前兩行是移動到 mjpg-streamer 資料夾並將需要用到的 Library 加入 LD_LIBRARY_PATH 中，這樣一來才能使用 mjpg-streamer 這個應用程式，參數的話 `-i` 表示 **input-plugin**，`-o` 表示 **output-plugin**，`-r` 和 `-f` 分別表示 **resolution** 和 **frame rate**，`-y` 表示使用 YUV 格式的 camera，一般預設是使用 JPG 格式，所以可以依照自己的 camera 決定要如何下參數。程式執行之後，要確認有沒有成功開始串流，可以用電腦的瀏覽器，連到 86Duino 所在的 IP，PORT 為 `8080` 的網頁，就可以看結果了，例如 86Duino IP 為 **192.168.1.70**，只要連上 **192.168.1.70:8080** 就能看到結果了。

### USB WiFi 設定
我選用的 USB WiFi 跟[教學](http://www.86duino.com/index.php?p=13305&lang=TW)中的一樣，所以照這個步驟做就完成了，要注意的地方是系統有時候會找不到 driver，所以使用前建議下 `modprobe rt2800usb` 這個指令。而如果是用不同的 USB 網卡，也可以參照教學，整個流程應該會是類似的。

## Web App
網頁是我們主要寫程式的部分，這邊我主要是使用 Express 3 來開發，後來一查才發現好像快出到 5 代了 XDD 有機會的話再改至較新的版本，請大家多多海涵。
先附上[原始碼](https://github.com/Sayter99/86Duino_Remote_Control_Car)，結構是很中規中矩的 Express 專案，重點部分在 `app.js` 和 `view/index.jade` 之中，我們先來看看 `app.js` 是如何使用 MRAA 的：

```js
var m = require('mraa');
      .
      .
      .
// 宣告四個用來控制輪子的 gpio 腳位，對應 86Duino 上的 10, 11, 31, 32
var gpio0 = new m.Gpio(10);
var gpio1 = new m.Gpio(11);
var gpio2 = new m.Gpio(31);
var gpio3 = new m.Gpio(32);

// 把四根 gpio 設定成輸出模式
gpio0.dir(m.DIR_OUT);
gpio1.dir(m.DIR_OUT);
gpio2.dir(m.DIR_OUT);
gpio3.dir(m.DIR_OUT);

// 利用 socket.io 與前端溝通，只要前端網頁用鍵盤或按鈕來
// 觸發相應事件(move)，後端再進一步看事件傳來的 cmd 為何，
// 就能依照 cmd 讓車子依照使用者的操作移動
// 0：停止，所有的腳位輸出 0(LOW)
// 1：往前，兩顆輪子皆正轉，腳位按順序是 0(LOW) 1(HIGH) 0(LOW) 1(HIGH)
// 2：往左，左邊的輪子往後，右邊的輪子往前
// 3：往右，右邊的輪子往後，左邊的輪子往前
// 4：往下，兩顆輪子皆反轉
serv_io.sockets.on('connection', function (socket) {
    socket.on('move', function (data) {
        if('0' == data.cmd) //stop
        {
            gpio0.write(0);
            gpio1.write(0);
            gpio2.write(0);
            gpio3.write(0);
        }
        else if('1' == data.cmd) //up
        {
            gpio0.write(0);
            gpio1.write(1);
            gpio2.write(0);
            gpio3.write(1);
        }
        else if('2' == data.cmd) //left
        {
            gpio0.write(0);
            gpio1.write(1);
            gpio2.write(1);
            gpio3.write(0);
        }
        else if('3' == data.cmd) //right
        {
            gpio0.write(1);
            gpio1.write(0);
            gpio2.write(0);
            gpio3.write(1);
        }
        else if('4' == data.cmd) //down
        {
            gpio0.write(1);
            gpio1.write(0);
            gpio2.write(1);
            gpio3.write(0);
        }
    });
});
```

接著來看看 `view/index.jade`：

```js
block content
  .jumbotron
    h1 86Duino Remote Control Car
    p
  .row
    .col-md-4
      h2 Control
      script(src='https://cdn.socket.io/socket.io-1.2.1.js')
      script(src='https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.4/keypress.min.js')
      .row.center.nopadding
        .col-md-6
          a.btn.btn-primary(onclick='move(1);') ↑
      .row.center.nopadding
        .col-md-6
          a.btn.btn-info(onclick='move(2);') ←
          a.btn.btn-danger(onclick='move(0);') ●
          a.btn.btn-info(onclick='move(3);') →
      .row.center.nopadding
        .col-md-6
          a.btn.btn-primary(onclick='move(4);') ↓
```

以上是寫大標題和畫出五顆按鈕，按鈕被按下去時(onclick)會去執行 `move(cmd)` 這個函式，並依照不同的按鈕傳送不同的參數，而 move 這個函數我寫在 `public/javascript/car.js` 裡面：

```js
function move(cmd) {
    socket.emit('move', { 'cmd': cmd });
};
```

單純的去處發 `move` 這個事件，並把 `cmd` 送出去。

```js
    script.
      var socket = io.connect();
    .col-md-6
      h2 Stream
      .row.center.nopadding
        .col-md-6
          img(id='stream')
    script.
      var imgsrc = 'http://' + location.hostname + ':8080/?action=stream';
      $(document).ready(function() {
        $('#stream').attr('src', imgsrc);
      });
```

這邊插了一段 js 程式碼來宣告 socket，讓 socket.io 能正常運作，接著把視訊影像所需要的 `img` 標籤寫出來，因為遙控車的 ip 可能會每次不同，所以這邊只先給 id，之後在用 `jquery` 操作給予它 `src` 的內容，如上面程式碼 `$('#stream').attr('src', imgsrc);`，而 `src` 即為上面用 `mjpg-streamer` 產生的影像來源。

```js
    var listener = new window.keypress.Listener();
      var socket = io.connect();
      listener.register_combo({
        "keys": "right",
        "on_keydown": function(){
          socket.emit('move', {'cmd': 3});
        },
        "on_keyup": function(){
          socket.emit('move', {'cmd': 0});
        },
        "prevent_repeat": true
      });
```

最後是類似的鍵盤事件註冊，就挑其中一個出來說明，為了讓 web app 也能接受用鍵盤操控小車，我採用 [keypress.js](https://dmauro.github.io/Keypress/) 來偵測鍵盤事件，宣告 `listener` 之後就可以開始註冊事件了，事件中要設定 `keys` 表示要用到的案件，`on_keydown` 和 `on_keyup` 則分別表示按鈕被按下與放開時所要執行的函數，`prevent_repeat` 是用來表示事件是否要防止事件被重複觸發。

至於其他小細節有興趣的可以參考原始碼唷～

# 整合
做完以上全部的步驟並且每個部份都能運作的時候，我們就要把所有東西都整合起來了，這邊我的作法是寫一個開機自動執行的 script 把所有東西整合在一起：

```shell
#! /bin/sh
# /etc/init.d/car
#

### BEGIN INIT INFO
# Provides:          car
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     1 2 3 4 5 6
# Default-Stop:      0
# Short-Description: Start daemon at boot time
# Description:       Enable service provided by daemon.
### END INIT INFO

# Some things that run always
touch /var/lock/car

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    export PATH=$PATH:/usr/local/bin
    echo "Starting 86Duino Remote Control Car"
    modprobe rt2800usb
    echo 148F 5370 | tee /sys/bus/usb/drivers/rt2800usb/new_id
    sleep 5
    ifconfig wlan2 up
    killall wpa_supplicant
    killall wpa_supplicant
    killall wpa_supplicant
    killall wpa_supplicant
    killall wpa_supplicant
    wpa_supplicant -i wlan2 -D nl80211 -c /etc/wpa_supplicant.conf -B
    udhcpc -i wlan2
    sleep 5
    cd /home/dmp/mjpg-streamer/mjpg-streamer
    export LD_LIBRARY_PATH="$(pwd)"
    ./mjpg_streamer -i "./input_uvc.so -y -r 320x240 -f 10" -o "./output_http.so -w ./www" &
    cd /home/dmp/86Duino_Remote_Control_Car
    node app.js
    ;;
  stop)
    echo "Stopping 86Duino Remote Control Car"
    ;;
  *)
    echo "Usage: /etc/init.d/car {start|stop}"
    exit 1
    ;;
esac

exit 0
```

把這支名為 `car` 的程式放進 `/etc/init.d/` 之中，並用指令 `update-rc.d car start 30 1 2 3 4 5 . stop 80 0 6 .` 來開啟這個服務，其中
* 0：關機 (Halt)
* 1：單一使用者模式 (single user mode)
* 2-5：多使用者模式 (multi user mode)
* 6：系統重啟 (reboot)

而若要關閉則使用 `update-rc.d -f car remove` 來關閉。要注意的是若使用不同的網卡要記得換成對應的指令唷！
最後最後，要連上遠端遙控車的網頁，還需要得到 86Duino 的 IP，這邊無論是要用 UDP Broadcast 還是車上裝小螢幕顯示出來都可以，我就不多加贅述了，希望大家能玩得開心 ^___^