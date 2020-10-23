var store = [{
        "title": "About This Blog",
        "excerpt":"自從一年前離開校園，也跟著離開陪伴多年的 bbs，只能說這一 PO 百感交集…   在剛把 86ME 改到一個段落之後出現了一些小空檔，恰巧在思考著怎麼把 86ME 跨平台的我，創了這個 blog，希望能將一些心得或是成果跟大家分享囉！  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/About-this-blog/",
        "teaser":null},{
        "title": "Ros With Rb8 0",
        "excerpt":"最近要幫忙 86Duino 製作 Lubuntu 10.04 的 Image，之前在用 RoBoard 玩 ROS(Robot Operating System) 時就有做一些簡易的筆記，恰巧能派上用場，所以想藉由這次機會好好整理之前的一些心得讓之後想使用 RoBoard/86Duino 來玩 ROS 的玩家可以更輕易的上手。 甚麼是 ROS？ 那麼我們先來介紹一下 ROS，Robot Operating System 這名字可能會讓人覺得是一套 OS，不過 ROS 實際上更像是一個框架，包含許多方便開發機器人軟體的工具、函式庫和現成的套件。而我認為最重要的是 ROS 擁有龐大的社群，許多人使用 ROS] 並且會將自己的套件、專案開源，造就了如今的榮景，至於更多詳細的資訊可以上 ROS 的官方網站去看。 當 ROS 遇上 RoBoard/86Duino RoBoard 是一款專為控制機器人設計的開發板，而 86Duino 是一個與 Arduino 相容的板子，其中 86Duino One 小弟認為也是很適合拿來控制伺服馬達的。為了避免內容過於發散，RoBoard 與 86Duino 的詳細介紹就請大家去官網看了。 ROS...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-0/",
        "teaser":null},{
        "title": "Ros With Rb8 1 Installation",
        "excerpt":"本篇是要將 RoBoard 與 86Duino 裝上 Lubuntu 10.04 + ROS。 Lubuntu 10.04 Image 準備一張 SD 卡，建議至少 8GB 以上。 RoBoard Lubuntu 10.04 Demo Image for RoBoard 詳細設定說明 86Duino 官方 Image 尚未釋出，可以持續關注官方網站，後面安裝的流程跟 RoBoard 相同，請放心服用 Install ROS Fuerte 參照 ROS 官方的安裝流程。 1. 設定 sources.list 首先要將 packages.ros.org 加入 sources.list 之中。 sudo sh -c 'echo \"deb...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-1-Installation/",
        "teaser":null},{
        "title": "Ros With Rb8 2 Opencv",
        "excerpt":"OpenCV 是一個開源的電腦視覺函式庫，功能包山包海，現今在開發機器人上應該可以說是不可或缺的，要在 RoBoard/86Duino 上裝 OpenCV 不像是在一般電腦上一樣容易，應該可以算是個大工程XD，所以就寫一些小撇步跟大家分享囉！ 下載 OpenCV 先到 OpenCV 官方網站下載 OpenCV for Linux/Mac。建議下載 VERSION 2.X.X，第三代應該無法在 RoBoard/86Duino 上順利執行，我之前使用的是 2.4.9，確定沒問題。下載後解壓縮得到 opencv-2.X.X，接著開啟終端機並移動到此資料夾底下。 編譯 OpenCV 首先要創建一料夾 build 並進入其中，這裡是用來放待會 CMake 後所產生的檔案： mkdir build cd build 接著要先講講 RoBoard/86Duino CPU 的特殊性，可能有的人有嘗試過在 RoBoard 或 86Duino 上執行 OpenCV 程式，但卻發現無法正確執行，這是因為 CPU 並不支援 SSE 這項技術，所以說在 CMake 時要把 SSE 與需要 SSE...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-2-OpenCV/",
        "teaser":null},{
        "title": "Ros With Rb8 3 Partner",
        "excerpt":"共遊機器人世界當然要找個機器人結伴啦，一起來看看我的這台機器人吧！ My Partner! 這隻機器人是我去年的聖誕禮物，當時 ROS Indigo 出了一段時間，不過因為 ROS Hydro 上面的文章還是比較豐富一些，我就以下面這樣的架構開始來嘗試一些 ROS 套件。 我是拿一台筆電來當作 Master node，負責蒐集機器人身上傳感器的資訊加以運用，也可以利用這些資訊來決定機器人接下來要做哪些事情；而 eBox 則是透過 wifi 網路與 laptop 溝通，一方面可以收取 laptop 的控制命令傳給 RoBoard 執行，一方面可以幫 RoBoard 負載平衡，把一些需要計算或較耗 CPU 資源的工作吃下來；而 RoBoard 搭配 RoBoIO 控制伺服馬達很方便，所以就拿來接收控制方面的指令來控制機器人。接著我們也來看一下這台機器人的其他裝備： Servo：機器人的雙手是四軸的手臂，伺服馬達是 RS-1270，手掌還有一顆伺服馬達可以控制手的開合。腰部、頭部也都有馬達控制，而輪子則是由兩顆 AX-12 來控制。 Sensor：頭部搭載 Asus Xtion PRO LIVE。身體前方還有一台 Hokuyo URG-04LX。 Battery：前輩幫我在露天買的兩顆鋰電池，是模型玩具在用的那種，因為我也看不出廠牌就沒寫上來 &gt;__&lt;。一顆是給 eBox，一顆是給 RoBoard。 接下來談談 ROS...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-3-Partner/",
        "teaser":null},{
        "title": "Ros With Rb8 4 Rosserial",
        "excerpt":"拿到機器人後就先來測試馬達的運作吧！目前機器人身上裝載的為 RoBoard，因此我是採用 Rosserail + RoBoIo Lib，如果之後有玩到 86Duino 為控制核心的機器人我會直接使用 86ME XD，關於 86ME，之後應該會寫一篇非此系列的文章來介紹唷！ Rosserial_86Duino 那麼言歸正傳，今天主要重點會放更多在 Rosserial 上面，RoBoIo 的詳細用法若是 RoBoard 玩家的話可以參考上面我給的連結。其實 Rosserial_86Duino 是個充滿特異功能的非官方套件，Rosserial_86Duino 可以在 86Duino/DOS/Windows/Linux 上編譯並順利執行（方法各有不同）： 86Duino：與官方的 Rosserial_Arduino 用法相同。目前的 Coding 210 版本都已經內建，所以不必特別安裝，也有範例可以參考。 DOS：要使用 DJGPP，我這邊是在 Windows 裡頭用 DJGPP 編譯出 DOS 可跑的程式，再將程式放入 RoBoard 讓其執行。這邊就附上我的 Makefile，裡頭有包含 RoBoIo Lib，所以我是有自己再修改一些 IO Lib 的，但若不用使用 RoBoIo Lib，可以把相關的部分刪去（包含引入的部分和 一些 .o 檔的部分）。...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-4-Rosserial/",
        "teaser":null},{
        "title": "Ros With Rb8 5 Urdf",
        "excerpt":"要在 ROS 中玩一隻自己的機器人，我認為自己編輯一個 URDF（Unified Robot Description Format） 模型是非常必要的。 URDF 的內容是在描述機器人的機構，包含每個 link 的大小、形狀、重量、馬達的最大與最小速度、可以承受的力量為何等等，寫作方式可以參考 URDF Tutorial。這邊大家也可以考慮使用 xacro，一個可以轉換為 URDF 的檔案型別，因為加入了 macro 功能，可以寫出更加具有可讀性且較精簡的描述檔，我自己也是使用 xacro。 用途 說了那麼多，URDF 究竟有甚麼實際的用途呢！？ 1. 將 Model 放入模擬器中 開啟 robot_state_publisher 與 joint_state_publisher，並將 robot_description 參數設為編輯好的 urdf 檔（xacro 檔可以用 xacro package 的 xacro.py 轉換成 urdf），就可以在 Rviz 中加入機器人模型，包含各個 link、joint　的 tf 與外觀，更可以藉由操作 joint_state_publisher 控制視窗來轉動關節，測試看看 urdf...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-5-URDF/",
        "teaser":null},{
        "title": "86me And 86hexapod",
        "excerpt":"86ME 為 86Duino Motion Editor 的縮寫，顧名思義就是一個透過 86Duino 來編輯動作的機器人動作編輯器。而 86Hexapod 則是結合 86Duino Enjoy 和 86ME 的可愛六足機器人 &gt;///&lt;。   86ME  86ME 是一個開源的機器人動作編輯器，對於要快速讓機器人動起來的朋友是非常方便的，支援即時的調整動作，不用像以往要將程式寫好燒進板子才能知道結果。並且 86ME 可以配合一些不同的遙控方式來產生 86Duino 動作程式，讓使用者可以不必再費心寫程式，詳細的說明網頁。   86Hexapod            86Hexapod 是一隻 3D-printable 並且完全開源的六足機器人。玩家可以下載 3D 模型圖並在家組出一台屬於自己的六足機器人，接著開始擴充自己想要的功能，享受動手做的樂趣 XD   Why 86ME &amp; 86Hexapod?  86ME 和 86Hexapod 都是完全開源的專案，且製造過程也有詳細的教學，希望能帶給使用者親民的自造體驗，讓人人都能夠享受動手做的樂趣，大家快一起來打造屬於自己的機器人吧！  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86ME-and-86Hexapod/",
        "teaser":null},{
        "title": "Ros With Rb8 6 Slam",
        "excerpt":"除了運動學外，ROS 上的 SLAM 套件也是非常兇猛的。這邊會簡介幾個不同種類的 SLAM，並說說我那快樂夥伴的 2D SLAM 唷！ 3D SLAM 我個人有用過的有 RTAB-Map 和 Rgbdslam。如果要應用在機器人身上，建議選擇適當的解析度（例如 QVGA、QQVGA ）傳深度圖與彩色圖回到桌電或筆電上，再利用 depth_image_proc 把深度圖轉為點雲圖再開始做 3D SLAM。 Graphic SLAM 僅用過 ORB-SLAM，是只需要一個 camera 就可以完成的 SLAM，我個人認為是不錯的室外 SLAM 解法。因為紅外線不適合在室外使用，所以利用圖像特徵點與圖型理論結合真的是很棒的想法！ 2D SLAM 因為小弟的快樂夥伴沒裝 encoder 在輪子上，所以就沒有使用 gmapping，而是使用 hector_mapping。但我個人是建議大家將輪子裝上 encoder 並且嘗試 gmapping 看看，效果應該是很不錯的，印象中使用 Kinect 來當作 Laser Scanner 就能有不錯的效果，而且機器人還是必須要有反饋才方便進行 debug 等工作。 言歸正傳，我仰賴著高精度的 Hokuyo URG_04LX...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/ROS-with-RB8-6-SLaM/",
        "teaser":null},{
        "title": "86hexapod With Ros",
        "excerpt":"好久不見！最近忙著改版 86ME 和嘗試 86Duino + ESP8266 + Rosserial86 的組合，來達成控制多台 86Hexapod 的目標，今天也來和大家分享吧！ ESP8266 ESP8266 是一塊小巧便宜的電路板，也因此成為 Arduino 社群製作 Wifi 相關專案時經常採用的選擇。除了能讓 Arduino 連上無線網路，ESP8266 本身也能作為 AP，功能可以說是非常強大。關於 ESP8266 的相關教學已經有許多大大寫了，所以這邊就不提了。要拿 ESP8266 與 86Duino 連接的話，我是用這款 ESP8266，將 TX/RX 與 Serial1 的 RX/TX 接上，並且接上地與電（我選擇 3.3V）就算完成硬體部分。軟體的話要注意的是這款 bb-8266 預設的 baudrate 為 115200，請記得要設定正確。86Duino Libraray 的部分我是使用 WeeESP8266。在使用 Rosserial86 之前建議先用 AT Command 確認 ESP8266...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86Hexapod-with-ROS/",
        "teaser":null},{
        "title": "Study Of Edison Ethernet Library",
        "excerpt":"不知不覺又過了一個月，最近小弟正在開發 86Duino Linux SDK，而剛好有負責到 Ethernet lib 的部分，老實說…之前上學不認真，這塊從沒好好學過 Orz。只好先偷偷惡補再上工啦XD Linux Socket Programming 因為 Edison 的 Ethernet library 是用 Linux Socket Programming 完成的，因此這也是惡補的第一步啦！ The client server model 許多行程間通訊都是採用這個架構。其中一個行程為 Client，可連上 Server 來交換資訊。其中 client 要知道 server 的位址，但 server 則不必知道 client 的位置。當連線建立時，雙方都能夠收送訊息。雖然建立 client 與 server 的系統指令不同，但都需要透過 socket 來建構。Socket 為一端的接口，server 與 client 都需要建立自己的 socket。 建立 client...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/Study-of-Edison-Ethernet-Library/",
        "teaser":null},{
        "title": "Access 86duino Peripheral Using Mraa",
        "excerpt":"最近移植了 MRAA 到 86Duino 上。MRAA 提供了可以將 C/C++ 函式轉為 Java, JavaScript, Python 的介面，因此有了 MRAA 之後，我們就能使用其他語言來操作 I/O 了！ Install MRAA 官方版本的 MRAA 尚未支援 86Duino，所以之後會將支援 86Duino 的 MRAA 加入 L86duntu 之中。而若是要對 MRAA 進行升級或是修改，就要將 MRAA for 86Duino 的源碼載下來，修改並重新編譯後再安裝，編譯源碼的相關資訊可以參考 Intel 的網頁說明。 Examples 基本上各個語言寫起來差異不大，因此範例的部分我僅寫 Node.js，其他語言可以參考專案裡的 Example 資料夾。 Analog Read (aio) 讀取 A0 腳的值： var m =...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/Access-86Duino-Peripheral-using-MRAA/",
        "teaser":null},{
        "title": "86me V1.7",
        "excerpt":"新版的 86ME v1.7 之中加入了一個新的概念，稱為 Motion Layer。   Motion Layer  這個概念源自於電腦動畫、電腦遊戲等領域。使用者可以將動作分層，使不同層的動作得以同時觸發（若有用到相同的伺服機，會優先處理層級較高的動作），藉此編輯機器人動作就變得更加有彈性了！舉例來說，我們可編輯一個層級 0（較低）的動作，此動作為機器人走路，然後再編輯一個層級 1（較高）的動作，為機器人揮拳。如此一來，就可以讓機器人邊走邊揮拳了 XD   DEMO            不知不覺改到 1.7 版了，一路上修修改改，也加上了一些大大小小的功能，像是支援多國語言，使用狀態機來更新動作，加入動作層級等等。讓我有機會更瞭解機器人，也瞭解自己的程式還有很多要改進的地方 O___Q~… 總之呢，之後會繼續努力的！  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86ME-v1.7/",
        "teaser":null},{
        "title": "86me V1.8",
        "excerpt":"86ME v1.8 算是改動蠻大的一個版本，加入了支援 Inertial Measurement Unit(IMU) 的兩個功能，一為加速度事件觸發，另一為 Gyro 補償。Action List 部分也新增了 Comput、If、Release 三個新指令。另外也有新增一些讓編輯動作更方便的 UI 唷！ Compute &amp; If 這個功能是用來在 Action List 中實做出一些邏輯運算，供使用者自由運用的變數有 50 （v0~v49）個，而系統變數包含亂數（R0）、目前時間（T0）、加速度計之數值（AccX, AccY, AccZ）和陀螺儀的 pitch 與 roll。而 Compute 就是可以利用這些變數做運算，來計算自己所需的數值，唯要注意的點是不同的動作最好使用不同的變數（v 系列），若兩個動作中使用了相同的變數，又被同時被觸發時，可能會產生同步問題。而 If 指令可以說是 Compute 的好兄弟，他可以判斷兩變數之間的關係（大於、等於之類的），若成立則會跳轉到指定的 Flag 去，藉此可讓 86ME 編輯出更複雜的功能。 以下就是以這個新功能打造的 DEMO，在一些電動遊戲中，角色閒置一段時間後會自己做一些動作來活動筋骨，此 DEMO 就是讓機器人待機時也有這樣的功能。 Gyro Compensation 陀螺儀的補償可以說是這版本最煞費苦心的了，從要設計新的 UI 進來就覺得蠻苦手的，後來把 IMU...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86ME-v1.8/",
        "teaser":null},{
        "title": "86me V1.9",
        "excerpt":"86ME v1.9 在馬不停蹄地趕工下接近尾聲了，這次的改版也加入了不少東西，第一點是支援以 Cubic Spline/Constrained Cubic Spline 方式來控制馬達的選項，讓使用者可以不只有走直線一種選擇，不過目前僅支援只含有 Frame 的動作，這點務必注意。第二點為支援兩個來源的 IMU 補償，例如可以利用 y 軸的旋轉角度與角速度來搭配服用，使用上可以說是頗具彈性，不過參數調整就會變得更加複雜就是了 O_Q Cubic Spline 在馬達的控制上，以往 86ME 所產生的程式是在指定時間內以直直的路線走到目標點，這樣的作法會讓機器人動作看起來很僵硬，實際上也會造成比較多的震動，因為通常在 Frame 與 Frame 之間的轉折處會有速度上的轉變，此時會瞬間產生一個加速度（可以把加速度想做力 —&gt; F = ma），只要這個加速度較大，就會讓機器人震震的。為了解決這個問題，我們採用了 Cubic Spline 來作為控制馬達的軌跡，這個方法能讓馬達在通過每個 Frame 時的速度和加速度更為平順，詳細的作法可以參考這篇教學。然而事情總是不會這麼容易的 XD 在做出新功能後正興高采烈測試時，發現了 Cubic Spline 會因為某些 Frame 與 Frame 之間速度太大（位移/時間）而導致整個曲線出現劇烈的 overshooting。可以利用這個網站更深入了解這個問題。 平均速度變化較平坦的資料（x軸時間，y軸為目標位置） 0 1310 1000 1840 1500 1840...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86ME-v1.9/",
        "teaser":null},{
        "title": "86hexapod With Speech Recognition",
        "excerpt":"之前看到 ASUS Zenbo 的語音操控，覺得是應該找時間來熟悉語音辨識這一塊，而很恰巧的，最近正好有人透過 github 來詢問我 rosserial86 的詳細用法，打算要做聲控方面的專案，正好是個機會讓我多了解語音辨識的工具 XD Speech Recognition by ROS pocketsphinx package 這次我使用的 package 為 pocketsphinx，首先我們要把這個 package 裝在 ROS-side PC or laptop，讓電腦能夠完成語音辨識，並把結果透過字串傳給小六足，小六足再藉由此字串決定要做甚麼樣的動作。小弟的筆電安裝的為 ROS hydro，以下為安裝 pocketsphinx 的步驟： sudo apt-get install gstreamer0.10-pocketsphinx sudo apt-get install ros-hydro-pocketsphinx sudo apt-get install ros-hydro-audio-common sudo apt-get install libasound2 除了 pocketsphinx 本身之外，還有一些相依的涵式庫與套件，千萬別忽略囉。安裝完之後就完成 87% 了，pocketsphinx...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86Hexapod-with-Speech-Recognition/",
        "teaser":null},{
        "title": "86duino Remote Control Car",
        "excerpt":"之前寫了一篇有關 MRAA 的文章，不過裡頭只有簡單的範例，藉由這一次實作遠端遙控車，希望能讓大家更瞭解 MRAA 能夠做些甚麼事情，說不定有些應用剛好很合適用 MRAA 來實作也不一定。 本篇會著重在如何用 MRAA 打造出 web app，硬體部分可以依照自己的想法去改變，基本上你需要有： USB Camera 一個 USB WiFi 網卡一個 馬達和輪子，想要如何設計都可以唷 SD 卡一張，用來裝 L86duntu 後面我會先介紹 L86duntu 的一些功能，最後再把它們串起來，完成遠端遙控車。 L86duntu 簡介 L86duntu 是專為 86Duino 打造的 Linux 作業系統，開發環境已經算建立得很完整了，除了基本的 GCC、JAVA、Python 還包含： ROS Hydro Medusa Node.js 0.10.42 Scratch 1.4.0.6 OpenCV 2.4.9 當然也有方便好用的應用程式，舉幾個我常用的： VNC Server 4.1.1：使用 RFB（Remote Framebuffer）協定的螢幕畫面分享及遠端操作軟體。...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86Duino-Remote-Control-Car/",
        "teaser":null},{
        "title": "Aiservo86 Library",
        "excerpt":"86Duino IDE 在下次更新中預計新增一個 AIServo86 涵式庫，此涵式庫可以說是 Servo86 的 AI 伺服機版本。 原來的 Servo86 專注在 RC 伺服機控制上，而 AIServo86 則是專注在 AI 伺服機上（目前主要支援 Robotis Dynamixel 廠牌之伺服機，包含 AX-12、RX-28、MX-28、XL-320）。 程式架構 實際使用上可以參考 AIServo86 涵式庫說明，且還有範例可供參考，這邊主要是分享此涵式庫的架構。在設計階段，為了要保留日後加入更多不同廠牌、型號的伺服機的彈性，使用了分層的方式進行抽象化，提出伺服機的核心功能進而實作出 AIServo86，具體架構如下圖： 如同 Servo86，AIServo86 中最核心的部分就是 AIServo 和 AIServoFrame 這兩個物件，AIServo 供使用者設定目標位置、運動時間、運動速度等特性，也提供了暫停、停止、釋放伺服機等命令讓機器人控制更加有彈性，而 AIServoFrame，則是導入 Frame 的概念，同時控制多顆伺服機來呈現機器人動作更加方便，除了這些以外還有較進階的 Cubic Spline 路徑規劃、Realtime Mixing 補償功能，這些功能也都已經加入了，有興趣的朋友可以看前兩篇 [1, 2] 相關的的文章。拉回程式架構身上，要讓 AIServo 和 AIServoFrame 可以正確支援多種不同控制方式的伺服機（可能有傳輸方式的不同，如...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/AIServo86-Library/",
        "teaser":null},{
        "title": "86humanoid Rider",
        "excerpt":"繼 2015 發表 86Hexapod 之後，隔了一年多終於迎來了另外一隻 3D 列印的機器人！這次的主角是一隻小型的兩足機器人，身高大約 25cm，機構全由 3D 列印件完成。   The Birth of 86Humanoid Rider  Rider 誕生在一個月黑風高的夜晚（疑？）咳，其實看著 Plen2 和 miniplan 機器人的好成果，讓我們也燃起了製作 3D-printable Humanoid 的決心，順便測試我們的工具鏈是不是足夠拿來開發兩足機器人。因此便開始著手研究兩足機器人，請我們厲害的機構工程師們絞盡腦汁設計出 21 軸的小人形。在這次商討的過程中，有幾次我沒把詳細的規格想得徹底，造成大家的修改真是抱歉 O__Q..，總而言之，言而總之，Rider 的機構還是順利的產出了！   Software Development  來到軟體層面，這次開發兩足機器人不像上次的六足機器人，六足的步態編輯較容易，而兩足因為平衡較困難，步態的編輯也相對困難許多，向小弟這樣對機器人學不太熟悉的工程師實在苦手。因此這次的開發過程還需要請到高人幫忙 XD 先將 Rider 在他編寫的模擬環境下建立模型，接著再進一步生成步態，產生步態之後再匯入 86ME 進行其他動作的編輯，在這個過程中需要商討檔案格式，也一邊要向巨巨們請益關於步行調整的方式，可以說是獲益良多！我想沒有她的幫忙，Rider 是走不到這一步的。總體而言，Rider 的難點依然跟許多兩足一樣在於步行，要能穩定的展現步態實屬不易，要注意電壓、IMU 補償的調整與零點校正，缺一不可，且小型人型的體積受限，很難塞進大號的電池，選用的小馬達出力也要非常的注意。然而這一切的困難，也更加深我去研究動態調整步伐的想法，小弟認為缺乏這樣的演算法，很難做出適應性強的兩足，（迷：不過眼下似乎還有更重要的事情要去做 O__Q..   Demo            Why 86Humanoid  在我心裡的答案依然，想要藉由開源的方式讓更多人可以玩到機器人，提供完整的工具、好取得的零件、低廉的成本，讓各種機器人的入門門檻降低。目前軟體部分除了可生成步態的模擬環境外都會開源，而機構則是不確定，希望 Rider 能夠開源呀（吶喊）～  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/86Humanoid-Rider/",
        "teaser":null},{
        "title": "飛禽島的不敗少年",
        "excerpt":"昨天晚上，看著小李下完退役賽的倒數第二盤，突然有感而發。回憶起來，自己會來到美國也跟小李與 AlphaGo 的對局有點關聯，對於棋魂中所表達的傳承，似乎又有了新的體會。趁著這次紀錄一下這幾年小李與 AI 帶給我的轉折。   李世石  體制  韓國的誑妄少年李世石，又稱是飛禽島的不敗少年，相信不少棋迷對他是又愛又恨。還記得當年大李李昌鎬稱霸國際棋壇時，小李還這麼說過：我的對手只有李昌鎬歐爸，實力我領先。當時實在是是覺得又帥又敗人品 XD 也有這麼一說是，誑妄的高永夏的參考原型是小李，真假這就不得而知了。而如今小李都要退役了，時間流逝的速度真的快到難以想像。他不僅僅對自己的實力展現高度的自信，同時也非常有想法，不參加常規賽，退出韓國棋院等等衝撞體制的行為，當時深受儒家思想影響的我，實在很難細細的思考跟體會他的想法。從李大師身上，只能說我學習到對於自己生活的這個世界，要更有勇氣去題出問題，去改變一些不合理的事情。當如今沒有什麼職業棋手願意與 AI 對戰的同時，他卻又挺身而出與 AI 下讓子棋作為退役賽，職業九段被讓兩子的比賽，以往絕對是難以想像。這一次又一次不同的想法，讓我愈來愈有勇氣去思考不同的可能，或許世俗的價值觀也是一種枷鎖吧。   重來一次  小李在一次訪談中談到重來一次的話，還會不會選擇圍棋人生。他回答說：我已經體驗了圍棋人生，就想過別的人生。圍棋人生呀，輸棋的時候實在太痛苦了。雖然我的棋力並不強，但對於這句話也是有深深的體會，用盡全力輸了棋，對自己的否定感非常的強烈，連帶下一次遇到勁敵，都會產生怯戰的想法，導致自己慢慢的害怕挑戰。只能說小李嘴上這麼說，無論面對 AlphaGo 的頑強應戰還是選擇與 AI 完成自己的退役戰，都完美的展現出自己對壓力、對戰強敵時的勇氣與氣魄，能做到這種程度，真的非常值得學習。面對壓力的方式有無數種，或許李大師骨子裡把他看做是一種樂趣也不一定 XD   AI  我還記得第一次人機大戰，2016年3月12號，李大師連輸兩盤，我在公司看著直播思考，究竟發生了什麼事情。許多年前我在大學的時候，總是跟人家說電腦離職業還差得遠，連我都下不過。直到老闆跑到我的座位旁邊跟我說，別想了，人贏不了機器的。還安慰我他們用了多少 GPU 才贏什麼的..但說真的我難以從複雜的心情裡走出來，一來是老闆居然上班也在看？喔不我是說，我有點生氣為何自己的刻板印象限制了自己的想像力，就像一道雷打在自己身上一樣，我決心開始要更認真的去理解這個世界，對那個時候的我來說，倒不是想去學 Deep Learning 什麼的，而是我開始覺得，這個世界有更多更多，多到難以想像有趣的事情，其實一直以來都是我自己不夠用心去體會而已，我非常明白自己需要轉變，或許出國留學能想清楚些什麼吧，所以我就到美國了。到美國後這也繼續影響著我，對我學習的態度、對一門學問的看法都有深遠的影響，也希望我對探索的熱情繼續這樣的維持下去。   傳承  進藤光最後回答自己為什麼下棋，為了連接遙遠的過去與遙遠的未來。這世界上的人事物，無形之中或許都影響著彼此，帶著某些啟發，某些人的信念，某些事情給你的動力、熱情，我們一直都傳承著些什麼，未來，我也會繼續把自己覺得有價值的經驗、想法分享出去。謝謝你們，一直在圍棋界努力的棋士、棋迷還有科學家們 ：）  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/%E9%A3%9B%E7%A6%BD%E5%B3%B6%E7%9A%84%E4%B8%8D%E6%95%97%E5%B0%91%E5%B9%B4/",
        "teaser":null},{
        "title": "Boulder Go Resources",
        "excerpt":"因為之前一直忙於找工作，沒能仔細研究 Boulder 的圍棋活動，這次就來介紹一下 Boulder 可以下棋的去處。   Boulder GO Club  這是一個在 CU Boulder UMC 每周三的聚會，時間從晚上六點到晚上十點結束，人數大概五六個人，實力分布挺廣的，級位段位都有，地點也非常方便就在學校裡面，算是一個不錯的去處。   Go Club for Kids &amp; Teens  這是在 Boulder Public Libaray 每個禮拜天下午兩點到下午六點的活動，有人會熱心的推廣圍棋教小朋友下棋，想對弈的話也有厲害的人可以互相下，圖書館環境也非常好，是假日休閒下期的好選擇‧。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/Boulder-GO-Resources/",
        "teaser":null},{
        "title": "Ultra Light Affect Recognition",
        "excerpt":"For aHRI class, we developed our face and emotion recognition ROS package based on pretrained models: Face detection: Ultra-light face detector Face recognition: MobileFaceNet Emotion recognition: Arch: VGG networks4 Dataset: facial expression dataset (FER13 dataset) Accuracy: 65.93% We implemented two nodes for face recognition and emotion recognition. The face recognition...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/Ultra-Light-Affect-Recognition/",
        "teaser":null},{
        "title": "Life At Cu Boulder",
        "excerpt":"轉眼間來美國讀書已經過了3個學期，這段時間真的學習到很多東西，但之前實在太忙碌了沒辦法一一紀錄，今天就來寫一篇在 CU Boulder 讀 CS Master 的心得吧！ 生活 小弟大部份時間都在宅或是跑到Lab假用功，所以就不著墨太多在生活上，有興趣的朋友可以參靠 Chih-Wei 大大的文章。 修課 CU 的 CS 課感覺上不像其他學校那麼多，系也不是特別重點的感覺，基本上 CU 比較強的領域是航太跟物理，有興趣的話也是可以去修修這兩個系的課程。我自己的話選課通常是選水課或機器人方向的課程，這樣的選課策略主要是按照我的興趣跟時間分配，值不值得參考就按大家自己的狀況去考量囉。 Data Mining：這門課主要教一些 data mining 基本的技術，包含前處理、推論、還有一些分析資料的方法。作業的話程式用 Python，還有一些手算的題目，例如 Bayes Classifier, Decision Tree 等等，不是特別難，只有一次期末考也跟作業出的差不多，基本上把投影片看熟，不太懂的名詞去查一查課本就能拿高分。還有一個佔分很重的 final project。我個人覺得需要學分的話是可以考慮這門課的，loading 重的地方只有 project，考試不失常的話不難拿到 A，缺點是教得東西比較入門，但其實我認為這樣的課非常有彈性，因為這樣一來就不必花太多時間在作業，且想要學得深入一點可以做一個比較有挑戰性的 project，並且有問題的話老師也非常厲害，所以不必擔心。但這學期我都在寫 leetcode，沒有把 project 做得很好。連結給大家參考，個人會推薦給想選涼課又不排斥資料科學的人。 User-Centered Design：也是一門涼課，每個禮拜會做一次作業、quiz和閱讀，教得東西在概念上，並不會帶大家做真正的作品。大概是講怎麼 brainstorming、設計 prototype、怎麼做問卷、怎麼樣去觀察使用習慣等等。期末 project 是用 Figma 做一個 prototype，包含讓同學試用做 iteratively improvement。對 UI/UX...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/Life-at-CU-Boulder/",
        "teaser":null}]
