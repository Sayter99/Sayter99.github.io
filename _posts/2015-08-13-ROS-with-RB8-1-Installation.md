---
toc: true
---
本篇是要將 RoBoard 與 86Duino 裝上 Lubuntu 10.04 + ROS。

## Lubuntu 10.04 Image
準備一張 SD 卡，建議至少 8GB 以上。

### RoBoard
* [Lubuntu 10.04 Demo Image for RoBoard](https://drive.google.com/file/d/0B57_bLQ4_10UMmxUYW9NNDdXb1k/edit?usp=sharing)
	* [詳細設定說明](http://www.roboard.com/Files/RB-050/Lubuntu_RoBoard_Demo_v11.pdf)

### 86Duino
* 官方 Image 尚未釋出，可以持續關注[官方網站](http://www.86duino.com)，後面安裝的流程跟 RoBoard 相同，請放心服用

## Install ROS Fuerte
參照 [ROS 官方的安裝流程](http://wiki.ros.org/fuerte/Installation/Ubuntu)。

### 1. 設定 sources.list
首先要將 *packages.ros.org* 加入 **sources.list** 之中。

```bash
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu lucid main" > /etc/apt/sources.list.d/ros-latest.list'
```

### 2. 設置金鑰 
```bash
wget http://packages.ros.org/ros.key -O - | sudo apt-key add -
```

### 3. 安裝 ROS
先更新套件清單
 
```bash
sudo apt-get update
```

接著，官網中提供了`Desktop-full、Desktop、ROS-Comm`這三種成套的選擇，但若要自己選擇所需的 stack 來安裝也是可以的。先來看看三種版本的差異：

* Desktop-full：除了 ROS 核心之外還包含 2D/3D 的模擬器、巡航套件和一些常用的套件，非常完整，也是官方建議的選擇，但空間需求大，安裝好之後加上系統原來的檔案，一張 8G SD 卡可能就少了一半，因此我建議有 16GB 以上的 SD 卡再安裝此項。

```bash
sudo apt-get install ros-fuerte-desktop-full
```

* Desktop：除核心外還安裝有 RViz（ROS 中的一個模擬器）和一些機器人常用套件。

```bash
sudo apt-get install ros-fuerte-desktop
```

* ROS-Comm：ROS 建置與溝通的核心函式與套件，不包含 GUI 工具。

```bash
sudo apt-get install ros-fuerte-ros-comm
```

小弟認為 RoBoard 擁有 1GHz 的時脈、256MB 的記憶體，可以選擇 `Desktop` 版本。86Duino 則因為記憶體僅有 128MB，要跑起圖形化介面有點太繁重，所以建議安裝 `ROS-Comm` ，若有其他需要在另行補上。

### 4. 環境設置
為求方便起見，將 ROS 的環境變數加入家目錄底下的 `.bashrc` 檔案中。

```bash
echo "source /opt/ros/fuerte/setup.bash" >> ~/.bashrc
. ~/.bashrc
```

### 5. 安裝 rosinstall、rosdep 工具

```bash
sudo apt-get install python-rosinstall python-rosdep
```

## 創建 ROS Workspace 與 ROS Package
完成安裝之後馬上來試試看 ROS 是否能正確執行吧！**Fuerte 是以 rosbuild 的方式建置的，而非較新的 catkin，這點要特別注意！**

### 1. 建立 workspace
參考：[Installing and Configuring Your ROS Environment](http://wiki.ros.org/ROS/Tutorials/InstallingandConfiguringROSEnvironment)
在家目錄建立 `fuerte_workspace` 資料夾，並將 /opt/ros/fuerte 裡的套件延伸至此資料夾。

```bash
mkdir ~/fuerte_workspace
rosws init ~/fuerte_workspace /opt/ros/fuerte
```

接著在 `fuerte_workspace` 裡頭建立資料夾 `sandbox`，並將 `sandbox` 設定為 ROS Workspace

```bash
mkdir ~/fuerte_workspace/sandbox
rosws set ~/fuerte_workspace/sandbox
```

與安裝 ROS 時的環境設置一樣，我習慣會把 `source ~/fuerte_workspace/setup.bash` 這行加入 `~/.bashrc` 的底部，這樣就不用每次開啟終端機都要重新輸入指令。最後可以輸入 `echo $ROS_PACKAGE_PATH` 來確認是否設定完成，如果完成的話輸出應該會是 `/home/your_user_name/fuerte_workspace/sandbox:/opt/ros/fuerte/share:/opt/ros/fuerte/stacks`

### 2. 建立 ROS Package
參考：[Creating a ROS Package](http://wiki.ros.org/ROS/Tutorials/CreatingPackage)

先切換到 `sandbox` 資料夾中，再利用 `roscreate-pkg` 指令創建一個 ROS Package

```bash
cd ~/fuerte_workspace/sandbox
roscreate-pkg beginner_tutorials std_msgs rospy roscpp
```

第二行所代表的意思可以這樣理解 `roscreate_pkg [package_name] [depend1] [depend2] [depend3]`，也就是 *beginner_tutorial* 為所創建套件的名字， *std_msgs、rospy、roscpp* 則是相依的套件。建立成功後，可以在 **beginner_tutorial/manifest.xml** 此檔案中看到相依的套件像這樣被加入：

```xml
<package>

...

  <depend package="std_msgs"/>
  <depend package="rospy"/>
  <depend package="roscpp"/>

</package>
```

### 3. Publisher & Subscriber
參考：[Writing a Simple Publisher and Subscriber (C++)](http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28c%2B%2B%29)、[Writing a Simple Publisher and Subscriber (Python)](http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28python%29)。這邊可以照著教程寫出 ROS 經典的 publisher 和 subscriber。因為官網解說甚是詳盡，我僅說明一下常用的 package 建立方式。

* **C++**：創建一資料夾 `src` 在 package 目錄底下，並將程式撰寫在此資料夾下，接著修改 `CMakeLists.txt` 這個檔案，若是要用程式 A.cpp 編出 A 這個可執行檔，可藉由在最底下加入 `rosbuild_add_executable(A src/A.cpp)` 來告訴編譯器該怎麼編譯。若是有要連結的函式庫，則是藉由 `target_link_libraries(A ${PROJECT_NAME})` 來加入。
* **Python**：創建資料夾，常見的名稱有 `script` 和 `node`，在裡頭寫好 Python 程式即可。

### 4. 建置 ROS Package
參考：[Building a ROS Package](http://wiki.ros.org/ROS/Tutorials/BuildingPackages)

移動至 package 的目錄下，使用 `rosmake` 建置。建置完成後 `rosrun PACKAGE_NAME EXECUTABLE_NAME` 就可以執行程式了，這樣的程式稱為 ROS node。執行時特別注意 ROS node 通常都需要先另外開一個終端機跑 `roscore`，一個控制各個 node 的 master node，之後才能正確的讓 node 與 node 間做訊息的交換。