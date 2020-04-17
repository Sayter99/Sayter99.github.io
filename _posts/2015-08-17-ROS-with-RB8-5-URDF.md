---
toc: true
---
要在 ROS 中玩一隻自己的機器人，我認為自己編輯一個 [URDF（Unified Robot Description Format）](http://wiki.ros.org/urdf) 模型是非常必要的。

URDF 的內容是在描述機器人的機構，包含每個 link 的大小、形狀、重量、馬達的最大與最小速度、可以承受的力量為何等等，寫作方式可以參考 [URDF Tutorial](http://wiki.ros.org/urdf/Tutorials)。這邊大家也可以考慮使用 [xacro](http://wiki.ros.org/xacro)，一個可以轉換為 URDF 的檔案型別，因為加入了 macro 功能，可以寫出更加具有可讀性且較精簡的描述檔，我自己也是使用 xacro。

## 用途
說了那麼多，URDF 究竟有甚麼實際的用途呢！？

### 1. 將 Model 放入模擬器中
開啟 [robot_state_publisher](http://wiki.ros.org/robot_state_publisher) 與 [joint_state_publisher](http://wiki.ros.org/joint_state_publisher)，並將 robot_description 參數設為編輯好的 urdf 檔（xacro 檔可以用 xacro package 的 xacro.py 轉換成 urdf），就可以在 Rviz 中加入機器人模型，包含各個 link、joint　的 [tf](http://wiki.ros.org/tf) 與外觀，更可以藉由操作 joint_state_publisher 控制視窗來轉動關節，測試看看 urdf 的編寫是否正確。

### 2. 使用 MoveIt! 來控制機器人
[MoveIt!](http://moveit.ros.org/) 是一個結合路徑歸化、運動學、3D 感測的套件，通常用來控制機器手臂。只要擁有機器人的 urdf 檔，配合 [MoveIt! Setup Assistant](http://moveit.ros.org/wiki/MoveIt!_Setup_Assistant) 就可以產生出一個屬於自己機器人的 MoveIt! 套件，基本上是不需要自己去算運動學的，前提是要將自己的 urdf 檔案描述得到位。接著可以在產生出來的目錄找到 *demo.launch*，執行這個 launch file 就可以開始試試路徑規劃、障礙避碰等等功能。 3D 環境的產生則是需要額外設定，在 config 資料夾加入 *sensors_rgbd.yaml*，並設定 3D sensor 的相關資訊即可。都完成後，我會將 MoveIt! 在運動過程中產生的 `/move_group/display_planned_path` 傳到 RoBoard 上，讓馬達跟著算出來的結果一起移動。機器人基本上是應該要有反饋的，不過這邊就算是一個雛形，我沒有選擇本身能反饋訊息的馬達，也沒有利用其他的 sensor 來解決，且我的 urdf 基本上也是有點粗糙，要如何精進就看個人的發揮了！

下面的影片是示範一下 MoveIt! 的反運動學，接著我在模擬器中加入一個物件展示一下避碰，這邊不是用 Xtion 照的喔！因為我得手不夠長 XD，所以 Xtion 的 Demo 就先免了吧，以後有機會再拍拍加入 3D camera 之後環境會變得怎麼樣吧！

{% include video id="F78GE17FgEI" provider="youtube" %}

## xacro 編輯心得
說了那麼多還沒提到編寫 xacro XD，基本上我建議每個部位都寫一個 xacro，例如頭部、手部、基座等等，方便之後修改每個部位的規格。最後再寫一個檔案把所有部位整合起來就可以了，千萬不要把所有東西都寫進一個 xacro 檔裡，這樣會造成檔案超級長，不方便修改也難套用到其他專案去，只能說非常可惜 O_Q