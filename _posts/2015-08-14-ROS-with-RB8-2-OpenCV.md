---
toc: true
---
OpenCV 是一個開源的電腦視覺函式庫，功能包山包海，現今在開發機器人上應該可以說是不可或缺的，要在 RoBoard/86Duino 上裝 OpenCV 不像是在一般電腦上一樣容易，應該可以算是個大工程XD，所以就寫一些小撇步跟大家分享囉！

## 下載 OpenCV
先到 [OpenCV 官方網站](http://opencv.org/downloads.html)下載 **OpenCV for Linux/Mac**。建議下載 **VERSION 2.X.X**，第三代應該無法在 RoBoard/86Duino 上順利執行，我之前使用的是 **2.4.9**，確定沒問題。下載後解壓縮得到 `opencv-2.X.X`，接著開啟終端機並移動到此資料夾底下。

## 編譯 OpenCV
首先要創建一料夾 `build` 並進入其中，這裡是用來放待會 CMake 後所產生的檔案：

```bash
mkdir build
cd build
```

接著要先講講 RoBoard/86Duino CPU 的特殊性，可能有的人有嘗試過在 RoBoard 或 86Duino 上執行 OpenCV 程式，但卻發現無法正確執行，這是因為 CPU 並不支援 SSE 這項技術，所以說在 CMake 時要把 SSE 與需要 SSE 的 FFMPEG 關掉：

```bash
cmake -DCMAKE_BUILD_TYPE=Release -DWITH_FFMPEG=OFF \
      -DENABLE_SSE=OFF \
      -DENABLE_SSE2=OFF \
      -DENABLE_SSE3=OFF \
      -DENABLE_SSSE3=OFF ..
```

結束後，我建議把 `opencv-2.X.X` 整個資料夾搬到一般的電腦去編譯，因為這邊如果要直接在 RoBoard/86Duino 上編譯會花非常久的一段時間。編譯的指令非常簡單，到 `opencv-2.X.X/build/` 底下執行 `make` 就可以了。完成後可以找到 `bin`、`lib`，這些就是編譯好的執行檔和函式庫了，至於 `header` 檔則是放在 `opencv-2.X.X/include` 裡面。

## OpenCV 和 ROS 的糾葛
在 ROS Fuerte 中許多的 package 都會用到 OpenCV，當安裝了 `vision-opencv` 或 image 相關的套件後，就可以發現 ROS 裡頭多了 OpenCV 這個東東，不過很可惜因為 SSE 的關係這份 OpenCV 是不能用的。所以要將我們自行編譯好的 OpenCV 覆蓋掉自動安裝好的。

### bin
移動到自己所產生的 bin 資料夾：

```bash
sudo cp * /opt/ros/fuerte/bin/
```

### lib
移動到自己所產生的 lib 資料夾：

```bash
sudo cp -av libopencv_* /opt/ros/fuerte/lib/
```

**cp 指令的 -av 是為了能將 symbolic link 也複製過去，複製完成後記得檢查 .so 檔是否都正確的連結**

### python
把自己編好的 `lib/python2.X/site-packages/cv2.so` 覆蓋掉 `/opt/ros/fuerte/lib/python2.6/dist-packages/cv2.so`，完成後打開 python 並輸入

```python
import cv2
cv2.__version__
```

看看是否能正確載入 OpenCV，沒問題的話就算OK了

### 修改設定檔
修要修改 `/opt/ros/fuerte/lib/pkgconfig/opencv.pc`、`/opt/ros/fuerte/share/OpenCV/OpenCV*`，主要是把版本修正，有出現 2.4.2 的地方都改成 2.4.X（自己編的版本），如果有出現自己沒編出來的函式庫可以先住解掉。**如果出現編出 .a 檔的問題，可以利用下面的 script 把 .a 檔轉換為 .so 檔，依然要注意函式庫繫結的問題！**

```bash
#!/bin/bash
tmp=`echo $RANDOM$RANDOM$RANDOM`
current_dir=`pwd`
args0="$1"
args1="$2"

helpmeplease()
{
  echo "a2so <a> <so>"
}

if [ -z $args0 ]; then
#    echo "good" > /dev/null
#else
    helpmeplease
    exit 1
fi

if [ -z $args1 ]; then
#    echo "goodette" > /dev/null
#else
    helpmeplease
    exit 1
fi

mkdir -p /tmp/$tmp
cp -R ${args0} /tmp/$tmp/$tmp
cd /tmp/$tmp
ar -x $tmp
gcc -shared *.o -o $tmp.so
cd $current_dir
cp -R /tmp/$tmp/$tmp.so $args1
rm -R /tmp/$tmp
```

* [Reference](http://ubuntuforums.org/showthread.php?t=1954793)

或是利用 gcc/g++ 來轉換，不過我也只有查到，沒有實際用過，夥伴們可以自行探索。

## 寫個傳輸影像 node 吧！
首先一樣先移動 `cd ~/fuerte_workspace/sandbox`，再利用 `roscreate-pkg opencvXXX_test roscpp cv_bridge sensor_msgs image_transport` 建立新的 package，名字可以自己換，我是取 opencv249_test。接著在資料夾裡面建立資料夾 `src`，並在裡頭加入 `sub.cpp` 和 `pub.cpp` 兩個檔案，顧名思義一個是 publish 影像的 node，一個則是 subscribe 影像的 node。

### 修改 CMakeList.txt
對 ROS 比較不熟悉的朋友可能會不太知道 CMakeList.txt 的參數要怎麼寫，其實主要就是參考 **3-4** 裡頭的一些設定檔，那麼還是直接附上範例吧！

```cmake
cmake_minimum_required(VERSION 2.4.6)
include($ENV{ROS_ROOT}/core/rosbuild/rosbuild.cmake)
find_package(OpenCV REQUIRED)
include_directories( ${OpenCV_INCLUDE_DIRS} )

rosbuild_init()

set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)
set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)

rosbuild_add_executable(sub src/sub.cpp)
target_link_libraries(sub ${OpenCV_LIBS})
rosbuild_add_executable(pub src/pub.cpp)
target_link_libraries(pub ${OpenCV_LIBS})
```

### src/pub.cpp
pub 會透過抓取 webcam 的影像，把影像存為 `sensor_msgs::Image` 類別，再上傳到 **Topic: image_out**。

```cpp
#include <ros/ros.h>
#include <iostream>
#include <sstream>
#include <image_transport/image_transport.h>
#include <cv_bridge/cv_bridge.h>
#include <sensor_msgs/image_encodings.h>
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <sensor_msgs/Image.h>

using namespace std;
using namespace cv;

int main( int argc, char** argv)
{
  ros::init(argc, argv, "pub");
  ros::NodeHandle nh;
  ros::Publisher out_img_pub = 
    nh.advertise<sensor_msgs::Image>("image_out", 2, false);

  Mat frame;
  VideoCapture cap(0);
  if(!cap.isOpened())
  {
    ROS_ERROR("fail to open!");
    return -1;
  }
  cap.set(CV_CAP_PROP_FRAME_HEIGHT,192); // 高
  cap.set(CV_CAP_PROP_FRAME_WIDTH, 256); // 寬
  cap.set(CV_CAP_PROP_FPS, 10); // 影片 FPS
  ros::Rate loop_rate(10);
  cv_bridge::CvImage cv_img;
  stringstream ss;

  for(int i=0; ros::ok(); i++)
  {
    cap.read(frame);
    cvtColor( frame, frame, CV_BGR2GRAY);
    ss << "frame " << i;
    cv_img.encoding = "mono8"; // 若是要彩色圖片可以換成 rgb8、 bgr8 等等
    cv_img.header.stamp = ros::Time::now();
    cv_img.header.frame_id = ss.str();
    cv_img.image = frame;
    out_img_pub.publish( cv_img.toImageMsg() );
    //ROS_INFO("Publish Frame %d !", i);
    ros::spinOnce();
    loop_rate.sleep();
  }
  return 0;
}
```

### src/pub.cpp
pub 會不斷聽取 **image_out** 裡面是不是有新東西，有新東西的話就利用 `imageCallback` 這個 callback 函式抓圖片來顯示。

```cpp
#include <ros/ros.h>
#include <iostream>
#include <sstream>
#include <image_transport/image_transport.h>
#include <cv_bridge/cv_bridge.h>
#include <sensor_msgs/image_encodings.h>
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <sensor_msgs/Image.h>

using namespace std;
using namespace cv;

int fcount = 0;

void imageCallback(const sensor_msgs::ImageConstPtr& color_img)
{
  cv_bridge::CvImagePtr cv_img;
  cv::Mat frame;
  try
  {
      cv_img = cv_bridge::toCvCopy(color_img,
      sensor_msgs::image_encodings::BGR8);
      frame = cv_img->image;
  }
  catch (cv_bridge::Exception& e)
  {
      ROS_ERROR("cv_bridge exception: \%s", e.what());
      return ;
  }
  //ROS_INFO("Cap Frame %d Sucess!", fcount++);
  cv::imshow("cap", frame);
  cv::waitKey(1);
}

int main( int argc, char** argv)
{
  ros::init(argc, argv, "sub");
  ros::NodeHandle nh;
  ros::Subscriber sub = nh.subscribe("image_out", 10, &imageCallback);
  ros::spin();
  return 0;
}
```

### 完成
到 package 的根目錄下 `rosmake` 編譯，完成後就可以試試看是否可以傳圖片囉！