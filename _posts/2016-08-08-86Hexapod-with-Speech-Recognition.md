---
toc: true
---
之前看到 ASUS Zenbo 的語音操控，覺得是應該找時間來熟悉語音辨識這一塊，而很恰巧的，最近正好有人透過 github 來詢問我 rosserial86 的詳細用法，打算要做聲控方面的專案，正好是個機會讓我多了解語音辨識的工具 XD

## Speech Recognition by ROS pocketsphinx package
這次我使用的 package 為 pocketsphinx，首先我們要把這個 package 裝在 ROS-side PC or laptop，讓電腦能夠完成語音辨識，並把結果透過字串傳給小六足，小六足再藉由此字串決定要做甚麼樣的動作。小弟的筆電安裝的為 ROS hydro，以下為安裝 pocketsphinx 的步驟：

```bash
sudo apt-get install gstreamer0.10-pocketsphinx
sudo apt-get install ros-hydro-pocketsphinx
sudo apt-get install ros-hydro-audio-common
sudo apt-get install libasound2
```

除了 pocketsphinx 本身之外，還有一些相依的涵式庫與套件，千萬別忽略囉。安裝完之後就完成 87% 了，pocketsphinx package 中含有一個 node **recognizer.py**，可以處理音訊接收與辨識，並把辨識到的結果以 **std_msgs/String** 發布到 **/recognizer/output** 這個 topic。安裝完畢之後就先來做個簡單的測試，把電腦接上麥克風之後，執行：

```bash
roslaunch pocketsphinx robocup.launch
```

接著嘗試說一些 robocup 中設定的字詞，例如 **bring me the glass, go to the kitchen, come with me** 等等，順利的話就能在視窗中看到結果了。

## Creating a Vocabulary
因為 recognizer.py 是把音訊分析之後的結果拿去與一個字庫做比對，然後從字庫裡選出一個最接近的結果當作辨識結果，例如上面的例子，用到的字即是別人為了 robocup 設計的。所以自定義字庫是非常必要的，畢竟如果只需要幾條簡單的命令，用太大範圍的字庫反而會降低辨識的成功率，依照自己的需求來制定字庫才能達到最佳的效果。製作方式非常簡單，先新增一個文字檔，例如 `hexapod_command.txt`，產生之後輸入自己需要的字詞，例如：

```
stop
move forward
move backward
move left
move right
half speed
full speed
```

完成之後要使用 [online CMU language model(lm) tool](http://www.speech.cs.cmu.edu/tools/lmtool-new.html) 來將 `hexapod_command.txt` 轉成 .dic 與 .lm 檔，以提供給 recognizer.py 當作參數使用。下載網頁產生出來的檔案之後，放到一個自己心儀的資料夾裡，接著在 **pocketsphinx** package 裡面新增一個 launch file：

```html
<launch>
  <node name="recognizer" pkg="pocketsphinx" type="recognizer.py" output="screen">
    <param name="lm" value="PATH OF HEXAPOD_COMMAND/hexapod_command.lm"/>
    <param name="idct" value="PATH OF HEXAPOD_COMMAND/hexapod_command.dic"/>
  </node>
</launch>
```

之後執行這個 launch file，recognizer 就可以運用 hexapod_command.txt 的內容來辨識囉！

## Control 86Hexapod
跟[之前的文章](http://sayter99.github.io/2015/10/30/86Hexapod-with-ROS/)中的配置一樣，這次硬體方面依然是 86Hexapod + ESP8266，並透過 [Rosserial86](https://github.com/Sayter99/rosserial) 來與 ROS 連線，控制程式是由 [86ME](https://github.com/Sayter99/86ME) 產生出來的小六足控制程式下去修改的，利用一個 callback function 把 **/recognizer/output** 中的字串接出來，然後讓程式判斷要觸發哪個動作，這樣就完成聲控小六足了，來個[範例程式傳送門](https://gist.github.com/Sayter99/3525c7b0b5a9c055bdccb6fc71d930fc)，記得 `setup()` 中 wifi 的相關設定要自行修改才能用唷。

{% include video id="mpei7aNira8" provider="youtube" %}

## Reference
* R. Patrick Goebel. *ROS By Example*, vol. 1, ch. 9.