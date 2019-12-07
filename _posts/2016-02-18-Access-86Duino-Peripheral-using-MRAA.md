---
toc: true
---
最近移植了 [MRAA](https://github.com/intel-iot-devkit/mraa) 到 86Duino 上。MRAA 提供了可以將 C/C++ 函式轉為 Java, JavaScript, Python 的介面，因此有了 MRAA 之後，我們就能使用其他語言來操作 I/O 了！

## Install MRAA
官方版本的 MRAA 尚未支援 86Duino，所以之後會將支援 86Duino 的 MRAA 加入 L86duntu 之中。而若是要對 MRAA 進行升級或是修改，就要將 [MRAA for 86Duino](https://github.com/Sayter99/mraa) 的源碼載下來，修改並重新編譯後再安裝，編譯源碼的相關資訊可以參考 [Intel 的網頁說明](http://iotdk.intel.com/docs/master/mraa/building.html)。

## Examples
基本上各個語言寫起來差異不大，因此範例的部分我僅寫 Node.js，其他語言可以參考專案裡的 Example 資料夾。

### Analog Read (aio)
讀取 A0 腳的值：

```javascript
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var analogPin0 = new m.Aio(0); //setup access analog inpuput pin 0
var analogValue = analogPin0.read(); //read the value of the analog pin
var analogValueFloat = analogPin0.readFloat(); //read the pin value as a float
console.log(analogValue); //write the value of the analog pin to the console
console.log(analogValueFloat.toFixed(5)); //write the value in the float format
```

### Blink (gpio)
經典範例，閃爍 pin 13 的 LED 燈。

```javascript
var m = require('mraa');

console.log('MRAA Version: ' + m.getVersion());

var myLed = new m.Gpio(13);
myLed.dir(m.DIR_OUT);
var ledState = true;

function periodicActivity()
{
  myLed.write(ledState?1:0); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
  ledState = !ledState; //invert the ledState
  setTimeout(periodicActivity,1000); //call the indicated function after 1 second (1000 milliseconds)
}

periodicActivity();
```

### RM-G144 (i2c)
此範例會讀取 RM-G144 sensor 中 compass HCM5843 的數值，在移動晶片時數值會跟著變化。

```javascript
var m = require('mraa');
x = new m.I2c(0);
x.address(0x1E);
x.writeReg(0x02, 0x00);

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    } while(curDate-date < millis);
}

function periodicActivity()
{
    var d = x.readBytesReg(0x03, 6);
    console.log('X axis: ', ((d[0] & 0x80) != 0) ? (((~0)>>16)<<16) | ((d[0]<<8)+d[1]): (d[0]<<8)+d[1]);
    console.log('Y axis: ', ((d[2] & 0x80) != 0) ? (((~0)>>16)<<16) | ((d[2]<<8)+d[3]): (d[2]<<8)+d[3]);
    console.log('Z axis: ', ((d[4] & 0x80) != 0) ? (((~0)>>16)<<16) | ((d[4]<<8)+d[5]): (d[4]<<8)+d[5]);
    setTimeout(periodicActivity,100);
}

pausecomp(60);
periodicActivity();
```

### Manipulate SG-90 (pwm)
PWM 能在有硬體 PWM 的腳位上輸出，此範例我選擇 86Duino One 中的 pin 29，讓馬達 SG-90 不斷旋轉。

```javascript
var m = require('mraa')

x = new m.Pwm(29)
x.period_ms(20)
x.enable(true)
value = 0.03

function periodicActivity()
{
	x.write(value)
	value = value + 0.001
	if(value >= 0.1)
	{
		value = 0.03
	}
	setTimeout(periodicActivity, 100)
}

periodicActivity()
```

### MAX7219 (spi)
透過 spi 來操作 LED 陣列 MAX7219。

```javascript
var m = require('mraa');

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    } while(curDate-date < millis);
}

x = new m.Spi(0)
x.bitPerWord(16)

x.write_word(0x0900)
x.write_word(0x0a05)
x.write_word(0x0b07)
x.write_word(0x0c01)
x.write_word(0x0f00)

x.write_word(0x01aa)
x.write_word(0x0255)
x.write_word(0x03aa)
x.write_word(0x0455)
x.write_word(0x05aa)
x.write_word(0x0655)
x.write_word(0x07aa)
x.write_word(0x0855)

pausecomp(2000);

x.write_word(0x0155)
x.write_word(0x02aa)
x.write_word(0x0355)
x.write_word(0x04aa)
x.write_word(0x0555)
x.write_word(0x06aa)
x.write_word(0x0755)
x.write_word(0x08aa)

pausecomp(2000);

x.write_word(0x0100)
x.write_word(0x0200)
x.write_word(0x0300)
x.write_word(0x0400)
x.write_word(0x0500)
x.write_word(0x0600)
x.write_word(0x0700)
x.write_word(0x0800)
```

### Serial1 (uart)
此程式使用 Serial1 來與電腦的 COM port 溝通，我是使用 TTL 轉 USB 線，電腦使用 putty，Baudrate 為 115200。執行後會先輸出 `test`，接著可以輸入要傳給 Serial1 的訊息，然後會進入第二次類似的流程，先出現 `2nd test`，接著可以寫訊息給 Serial1。

```javascript
var m = require('mraa');
console.log('MRAA Version: ' + m.getVersion());
u = new m.Uart(0)

console.log("Note: connect Rx and Tx of UART with a wire before use");

function sleep(delay) {
  delay += new Date().getTime();
  while (new Date() < delay) { }
}

console.log("Set UART parameters");

u.setBaudRate(115200);
u.setMode(8, 0, 1);
u.setFlowcontrol(false, false);
sleep(200);

console.log("First write-read circle:");

u.writeStr("test\n");
sleep(200);
console.log(u.readStr(6));
sleep(200);

console.log("Second write-read circle:");

u.writeStr("2nd test\n");
sleep(200);
console.log(u.readStr(10));
```

## Execution
有了 MRAA 之後，我們就可以充分利用不同語言的特性來實做更多有趣的 86Duino 應用了！那趕快來執行看看吧！

### C/C++
有使用 MRAA 函式庫的程式完成後，編譯時 link MRAA library 即可。
`gcc/g++ source.c/source.cpp -lmraa -o output`

### Python
將 MRAA package 所安裝的路徑加入 PYTHONPATH 之中，以 L86duntu 為例：
`export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python2.7/site-packages`
之後以 `python source.py` 來執行程式即可。

### JavaScript
只要將 MRAA module 加入 Node.js 專案中的 node_modules 即可。一樣以 L86duntu 為例：
`cd <PATH OF node_modules>`
`cp -R /usr/local/lib/node_modules/mraa .`
這樣一來，就能以 `node source.js` 來執行程式了。

### Java
一樣以 L86duntu 為例：
編譯： `javac -cp /usr/local/lib/java/mraa.jar:. Source.java`
執行： `java -cp /usr/local/lib/java/mraa.jar:. Source`

## Limitation
目前的版本還有些東西尚未支援：
* gpio：目前不支援中斷功能
* uart：高於標準 115200 的 baudrate 尚不支援

## UPM (Useful Packages & Modules) Sensor/Actuator repository for MRAA
[UPM](https://github.com/intel-iot-devkit/upm) 是以 MRAA 為基礎撰寫的專案，包含了感測器的使用、馬達的操作等等，許多常見的硬體都有支援，而 L86duntu 當然也裝好了，但因為不是每個硬體都有的關係，沒有完整測試所有的 package/module，不過小弟認為大部分的 package/module 都沒問題，除了少部分有用到 gpio isr 的不能跑之外，應該都能夠正常的使用唷！

### Use UPM
使用上這邊僅提一下 Node.js（**好偏心** <font color="#FF3333">>___<</font>），一樣把需要用到的 module 放入 node_modules 資料夾即可，以 ds1307 為例：
`cd <PATH OF node_modules>`
`cp -R /usr/local/lib/node_modules/jsupm_ds1307 .`

**範例程式：**

```javascript
// Load RTC Clock module for Grove - RTC clock
var ds1307 = require('jsupm_ds1307');
// load this on i2c bus 0
var myRTCClockObj = new ds1307.DS1307(0);

// always do this first
console.log("Loading the current time... ");

var result = myRTCClockObj.loadTime();
if (!result)
{
	console.log("myRTCClockObj.loadTime() failed.");
	process.exit(1);
}

printTime(myRTCClockObj);

// set the year as an example
console.log("setting the year to 50");
myRTCClockObj.year = 50;
myRTCClockObj.setTime();

// reload the time and print it
myRTCClockObj.loadTime();
printTime(myRTCClockObj);

function printTime(RTCObj)
{
	var timeStr = "The time is: " + 
        RTCObj.month + "/" + RTCObj.dayOfMonth + "/" + RTCObj.year + " " +
        RTCObj.hours + ":" + RTCObj.minutes + ":" + RTCObj.seconds;

	if (RTCObj.amPmMode)
		timeStr += (RTCObj.pm ? " PM " : " AM ");

	console.log(timeStr);

	console.log("Clock is in " + 
                (RTCObj.amPmMode ? "AM/PM mode" : "24hr mode"));
}
```

## Reference
* [https://github.com/intel-iot-devkit/mraa](https://github.com/intel-iot-devkit/mraa)
* [http://iotdk.intel.com/docs/master/mraa/building.html](http://iotdk.intel.com/docs/master/mraa/building.html)
* [https://github.com/intel-iot-devkit/upm](https://github.com/intel-iot-devkit/upm)
