---
toc: true
---
拿到機器人後就先來測試馬達的運作吧！目前機器人身上裝載的為 *RoBoard*，因此我是採用 Rosserail + [RoBoIo Lib](http://www.roboard.com/Files/Code/RoBoard_Training_SW_v18b.pdf)，如果之後有玩到 86Duino 為控制核心的機器人我會直接使用 [86ME](https://github.com/Sayter99/86ME) XD，關於 86ME，之後應該會寫一篇非此系列的文章來介紹唷！

# Rosserial_86Duino
那麼言歸正傳，今天主要重點會放更多在 Rosserial 上面，RoBoIo 的詳細用法若是 RoBoard 玩家的話可以參考上面我給的連結。其實 [Rosserial_86Duino](https://github.com/Sayter99/rosserial) 是個充滿特異功能的非官方套件，Rosserial_86Duino 可以在 86Duino/DOS/Windows/Linux 上編譯並順利執行（方法各有不同）：

* **86Duino**：與官方的 Rosserial_Arduino 用法相同。目前的 Coding 210 版本都已經內建，所以不必特別安裝，也有範例可以參考。
* **DOS**：要使用 [DJGPP](https://github.com/andrewwutw/build-djgpp)，我這邊是在 Windows 裡頭用 DJGPP 編譯出 DOS 可跑的程式，再將程式放入 RoBoard 讓其執行。這邊就附上我的 Makefile，裡頭有包含 RoBoIo Lib，所以我是有自己再修改一些 IO Lib 的，但若不用使用 RoBoIo Lib，可以把相關的部分刪去（包含引入的部分和 一些 .o 檔的部分）。

```makefile
IFLAGS    = -I./ros_lib -I./ros_lib/vortex86/utilities -I./RoBoIO/libsrc
OBJFILES  = HelloROS.o 86DuinoHardware.o time.o duration.o
OBJFILES += io.o irq.o err.o uart.o vortex86.o com.o queue.o usb.o usb_desc.o can.o
OBJFILES += common.o pwm.o pwmdx.o rcservo.o spi.o spidx.o ad79x8.o i2c.o i2cdx.o
EXEFILES  = HelloROS.exe
LIBFILES  = -L./ros_lib/vortex86/utilities -lswsk
OPTIONS   = -Wall -Wno-write-strings -trigraphs

.PHONY : everything all clean

everything : $(OBJFILES) $(EXEFILES)

all : clean everything

clean :
	-rm -f $(EXEFILES) $(OBJFILES)

%.o: %.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

%.o: ./ros_lib/%.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

%.o: ./ros_lib/vortex86/utilities/%.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

%.o: ./RoBoIO/libsrc/%.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

HelloROS.exe : $(OBJFILES)
	$(CXX) -o $@ $(OBJFILES) $(LIBFILES) $(OPTIONS)
```

* **Windows**：我是採用 VS2013 社群版來編譯，將 ros_lib 與 ros_lib/vortex86/ 裡面兩個資料的 header file 夾都引入專案，而連結方面需要連結以下函式庫：`WinIo.lib`、`kernel32.lib`、`user32.lib`、`gdi32.lib`、`winspool.lib`、`comdlg32.lib`、`advapi32.lib`、`shell32.lib`、`ole32.lib`、`oleaut32.lib`、`uuid.lib`、`odbc32.lib`、`odbccp32.lib`。
* **Linux**：與 DOS 較為類似，不過 compiler 為 GCC。一樣附上 Makefile：

```makefile
IFLAGS    = -I./ros_lib -I./ros_lib/vortex86/utilities
OBJFILES  = HelloROS.o 86DuinoHardware.o time.o duration.o io.o irq.o err.o vortex86.o
OBJFILES += 
EXEFILES  = HelloROS.exe
LIBFILES  = -lrt
OPTIONS   = 
# GNU Make will set CXX to correct C++ compiler if it is not set.
# You can use other compiler from command line of make, ex:
# make CXX=gcc
#CXX       = gcc

.PHONY : everything all clean

everything : $(OBJFILES) $(EXEFILES)

all : clean everything

clean :
	-rm -f $(EXEFILES) $(OBJFILES)

%.o: %.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

%.o: ./ros_lib/%.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

%.o: ./ros_lib/vortex86/utilities/%.cpp
	$(CXX) -c $< $(IFLAGS) $(OPTIONS)

HelloROS.exe : $(OBJFILES)
	$(CXX) -o $@ $(OBJFILES) $(LIBFILES) $(OPTIONS)
```
除此之外，還在 DOS 平台提供**網路連線**的連線方式，用法會與 Linux/Windows 上用網路有些差別，一般的網路連接是在 `init NodeHandle` 時給 server 的 ip 當作參數，而 DOS　下則是要先用 `NodeHandleX.getHardware()->setEthernet(ip)` 來設定自己的 IP，再用 `NodeHandleX.initNode(srvIp)` 來初始化。

程式的部分，**86Duino** 裡頭有 *Rosserial86* 範例可參考；**DOS**、**Windows**、**Linux** 基本上程式可以是同一份，並不需要修改，我就在此附上我用 RoBoIo 來控制 AX-12 馬達的程式，這支程式會去聽取 chatter 話題，並且依據收到的訊息來決定要怎麼讓輪子移動：

```cpp
#include <ros.h>
#include <std_msgs/String.h>
#include <std_msgs/Float64MultiArray.h>
#include <geometry_msgs/Twist.h>
#include <stdio.h>
#include <stdlib.h>
#include <roboard.h>

// AX-12 commands
#define READ_DATA       0x02
#define WRITE_DATA      0x03

// AX-12 registers
#define ID_ADDR         0x03
#define CW_ANG_LIMIT_L  0x06
#define CCW_ANG_LIMIT_L 0x08
#define GOAL_POSITION   0x1e
#define MOVING_SPEED    0x20

COMPort* ax12_com;
unsigned char comd[128] = {0};
unsigned char rx_status[128] = {0};
unsigned char speed = 0x01;

bool com3_ServoTRX(COMPort *port, unsigned char* cmd, int csize, unsigned char* buf, int bsize)
{
    com_ClearRFIFO(port);

    if (com_Send(port, cmd, csize) == false) return false;

    if (port->EnableHalfDuplex == uart_EnableHalfDuplex)  // discard the first-received csize bytes in case of TX/RX-short
    {
        int i;
        unsigned int tmpbyte;
        for (i=0; i<csize; i++)
        {
            if ((tmpbyte = com_Read(port)) == 0xffff)
                return false;
            if ((unsigned char)tmpbyte != cmd[i])
            {
                printf("receive a wrong self-feedback byte\n");
                return false;
            }
        }
    }

    if (buf != NULL)
        if (com_Receive(port, buf, bsize) == false)
            return false;

    return true;
}

unsigned char chk_sum( unsigned char *data, int len )
{
    unsigned int i, sum=0;
    for( i=2;i<(len-1);i++ )
        sum += data[i];
    sum = (~sum) & 0x00ff;
    return (unsigned char)sum;
}

void set_comd( char cmd, int ID, int ax12_reg)
{
    unsigned char flag = 0x00;
    if( ID == 15)
        flag = 0x04;
    switch(cmd)
    {
        case 'w':
            comd[6] = 0xf0;
            comd[7] = flag | speed;
            break;
        case 's':
            comd[6] = 0xf0;
            comd[7] = (0x04 xor flag) | speed;
            break;
        case 'd':
            comd[6] = 0xf0;
            comd[7] = 0x00 | speed;
            break;
        case 'a':
            comd[6] = 0xf0;
            comd[7] = 0x04 | speed;
            break;
        case 'p':
            comd[6] = 0x00;
            comd[7] = 0x00;
            break;
        default:
            break;
    }

    comd[0] = 0xff;
    comd[1] = 0xff;
    comd[2] = ID;
    comd[3] = 5;// LENGTH : LENGTH INSTRUCTION PARAMETER1 PARAMETER2 PARAMETER3
    comd[4] = WRITE_DATA;// INSTRUCTION
    comd[5] = ax12_reg;// register
    comd[8] = chk_sum(comd, 9);// Calculate the checksum.
}

ros::NodeHandle nh;

void wheelCB(const std_msgs::String & msg)
{
    set_comd( msg.data[0], 15, MOVING_SPEED);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    set_comd( msg.data[0], 15, GOAL_POSITION);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    set_comd( msg.data[0], 18, MOVING_SPEED);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    set_comd( msg.data[0], 18, GOAL_POSITION);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    nh.getHardware()->delay(500);

    set_comd( 'p', 15, MOVING_SPEED);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    set_comd( 'p', 18, MOVING_SPEED);
    com3_ServoTRX(ax12_com, comd, 9, rx_status, 6);

    if( msg.data[0] == 'l' )
    {
        for(int action_round=0; action_round<2; action_round++)
        {
            motion_frame[17] = 1600;
            rcservo_SetAction( motion_frame, 200);
            while( rcservo_PlayAction() != RCSERVO_PLAYEND )
                ;
            motion_frame[17] = 1400;
            rcservo_SetAction( motion_frame, 200);
            while( rcservo_PlayAction() != RCSERVO_PLAYEND )
                ;
        }
    }
    if( msg.data[0] == 'r' )
    {
        for(int action_round=0; action_round<2; action_round++)
        {
            motion_frame[22] = 1250;
            rcservo_SetAction( motion_frame, 200);
            while( rcservo_PlayAction() != RCSERVO_PLAYEND )
                ;
            motion_frame[22] = 1450;
            rcservo_SetAction( motion_frame, 200);
            while( rcservo_PlayAction() != RCSERVO_PLAYEND )
                ;
        }
    }
    if( (msg.data[0] == 'e') && (speed < 0x03) )
    {
        speed++;
    }
    if( (msg.data[0] == 'q') && (speed > 0x01) )
    {
        speed--;
    }
}

double abs_d( double num )
{
    if( num < 0 )
        return -1*num;
    return num;
}

ros::Subscriber<std_msgs::String> wheelSub("chatter", &wheelCB);

void WaitMs(unsigned long millisecond)
{
    nh.getHardware()->delay(millisecond);
}

int main(int argc, char* argv[])
{
    roboio_SetRBVer(RB_100RD);  // set the RoBoard version

    ax12_com = com_Init(COM3);
    com_SetFormat(ax12_com, BYTESIZE8 | STOPBIT1 | NOPARITY);
    com_SetBPS(ax12_com, COM_UARTBAUD_115200BPS);

    if (strcmp(argv[1], "d") == 0)
    {
        printf("%s %s %s\n", argv[1], argv[2], argv[3]);
        nh.getHardware()->setEthernet(argv[3]);
        nh.initNode(argv[2]);
    }

    nh.subscribe(wheelSub);

    while (1)
    {
        nh.spinOnce();
        WaitMs(30);
    }
}
```