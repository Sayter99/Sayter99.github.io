---
toc: true
---
不知不覺又過了一個月，最近小弟正在開發 [86Duino Linux SDK](https://github.com/roboard/86Duino_Linux_SDK)，而剛好有負責到 Ethernet lib 的部分，老實說...之前上學不認真，這塊從沒好好學過 Orz。只好先偷偷惡補再上工啦XD

## Linux Socket Programming
因為 Edison 的 Ethernet library 是用 Linux Socket Programming 完成的，因此這也是惡補的第一步啦！

### The client server model
許多行程間通訊都是採用這個架構。其中一個行程為 Client，可連上 Server 來交換資訊。其中 client 要知道 server 的位址，但 server 則不必知道 client 的位置。當連線建立時，雙方都能夠收送訊息。雖然建立 client 與 server 的系統指令不同，但都需要透過 *socket* 來建構。Socket 為一端的接口，server 與 client 都需要建立自己的 socket。

建立 client 的步驟：

1. 以 **socket()** 來建立 socket
2. 以 **connect()** 來連結 server 端的 socket
3. 收送資訊，最簡單的方式為透過 **write()** 與 **read()**。

建立 server 的步驟：

1. 以 **socket()** 來建立 socket
2. 用 **bind()** 將 socket 與一個位址（包含 port number）綁定。
3. 用 **listen()** 聽取是否有連線
4. 用 **accept()** 來允許連線。這個函式會阻塞直到 client 連進來。
5. 收送資訊

### Address Domain & Socket Types
兩個程序要互相溝通的話，各自所擁有的 *address domain* 與 *socket type* 要是相同的。

#### Address Domain
比較常見的有：

1. *Unix doamin*：用於檔案傳輸，其位址為一表檔案路徑的字串。
2. *Internet domain*：用於網路傳輸，其位址為 32 bit 的 IP address 加上 16 bit 的 port number。通常較低的 port 為系統服務，例如 FTP 為 21。而 2000 以上通常為可用的。

#### Socket Types
比較常使用的：

1. *Stream socket*：將資料視為連續的字元流，使用 TCP。
2. *Datagram socket*：每次要處理完整的一段訊息，使用 UDP。

### Sample
#### server.c
```c
/* A simple server in the internet domain using TCP
   The port number is passed as an argument */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h> 
#include <sys/socket.h>
#include <netinet/in.h>

void error(const char *msg)
{
    perror(msg);
    exit(1);
}

int main(int argc, char *argv[])
{
     int sockfd, newsockfd, portno;
     socklen_t clilen;
     char buffer[256];
     struct sockaddr_in serv_addr, cli_addr;
     int n;
     if (argc < 2) {
         fprintf(stderr,"ERROR, no port provided\n");
         exit(1);
     }
     sockfd = socket(AF_INET, SOCK_STREAM, 0);
     if (sockfd < 0) 
        error("ERROR opening socket");
     bzero((char *) &serv_addr, sizeof(serv_addr));
     portno = atoi(argv[1]);
     serv_addr.sin_family = AF_INET;
     serv_addr.sin_addr.s_addr = INADDR_ANY;
     serv_addr.sin_port = htons(portno);
     if (bind(sockfd, (struct sockaddr *) &serv_addr,
              sizeof(serv_addr)) < 0) 
              error("ERROR on binding");
     listen(sockfd,5);
     clilen = sizeof(cli_addr);
     newsockfd = accept(sockfd, 
                 (struct sockaddr *) &cli_addr, 
                 &clilen);
     if (newsockfd < 0) 
          error("ERROR on accept");
     bzero(buffer,256);
     n = read(newsockfd,buffer,255);
     if (n < 0) error("ERROR reading from socket");
     printf("Here is the message: %s\n",buffer);
     n = write(newsockfd,"I got your message",18);
     if (n < 0) error("ERROR writing to socket");
     close(newsockfd);
     close(sockfd);
     return 0; 
}
```

### client.c
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h> 

void error(const char *msg)
{
    perror(msg);
    exit(0);
}

int main(int argc, char *argv[])
{
    int sockfd, portno, n;
    struct sockaddr_in serv_addr;
    struct hostent *server;

    char buffer[256];
    if (argc < 3) {
       fprintf(stderr,"usage %s hostname port\n", argv[0]);
       exit(0);
    }
    portno = atoi(argv[2]);
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) 
        error("ERROR opening socket");
    server = gethostbyname(argv[1]);
    if (server == NULL) {
        fprintf(stderr,"ERROR, no such host\n");
        exit(0);
    }
    bzero((char *) &serv_addr, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    bcopy((char *)server->h_addr, 
         (char *)&serv_addr.sin_addr.s_addr,
         server->h_length);
    serv_addr.sin_port = htons(portno);
    if (connect(sockfd,(struct sockaddr *) &serv_addr,sizeof(serv_addr)) < 0) 
        error("ERROR connecting");
    printf("Please enter the message: ");
    bzero(buffer,256);
    fgets(buffer,255,stdin);
    n = write(sockfd,buffer,strlen(buffer));
    if (n < 0) 
         error("ERROR writing to socket");
    bzero(buffer,256);
    n = read(sockfd,buffer,255);
    if (n < 0) 
         error("ERROR reading from socket");
    printf("%s\n",buffer);
    close(sockfd);
    return 0;
}
```

在 Ubuntu 系統應該是可以直接編譯成功的，若無法的話，嘗試加上 -lsocket 來編譯。編譯完成之後，先啟動 server

```shell
server <port number>
```

接著啟動 client

```shell
client <IP address> <port number>
```

之後 client 會要求輸入訊息，輸入訊息後 client 會將訊息送出，server 接收到訊息後會顯示相關資訊，接著結束。

## Server Code
接著我們就挑些重點來說明吧！

* `#include <sys/types.h>`：types.h 定義了許多系統指令需要的資料型別，也包含了 socket.h 和 in.h 所需要的。
* `#include <sys/socket.h>`：定義了 *socket* 所需要的結構。
* `#include <netinet/in.h>`：包含 *internet address domain* 所需要的常數與結構。
* `void error(char *msg){...}`：當系統指令呼叫失敗時使用，會印出錯誤訊息並結束程式。[更深入了解 perror](http://www.linuxhowtos.org/data/6/perror.txt)。
* `int sockfd, newsockfd, portno, clilen, n`：
	* sockfd 與 newsockfd 為 file descriptor，每個執行中的程序有一個 file descriptor table，這張表包含了指向所有開啟的 i/o stream，例如最常見的 stdin、stdout、stderr。[更詳盡的 file descriptor](http://www.linuxhowtos.org/data/6/fd.txt)。而這兩個變數是用來儲存 socket() 與 accept() 函數的回傳值。
	* portno 用來存 server 在 bind() 時所用的 port number。
	* clilen 用來儲存 client 的 size，這是 accept() 所需要的參數。
	* n 用來存 read() 與 write() 的回傳值，表示讀或寫了多少字元。
* `char buffer[256]`：Server 讀進來的字元將會存在此 buffer。
* `struct sockaddr_in serv_addr, cli_addr`：sockaddr_in 為儲存網路位址的資料結構，定義在 <netinet/in.h>，其定義如下
```c
struct sockaddr_in
{
  short   sin_family; /* must be AF_INET */
  u_short sin_port;
  struct  in_addr sin_addr;
  char    sin_zero[8]; /* Not used, must be zero */
};
```
其中，in_addr 也是定義在同個檔案的結構，僅包含一個 unsigned long 變數 s_addr。而 serv_addr 與 cli_addr 各是用來儲存 server 與 client 的位址。
* `sockfd = socket(AF_INET, SOCK_STREAM, 0)`：socket() 會創建一個新的 socket。[The socket() man page](http://www.linuxhowtos.org/data/6/socket.txt)。
	* 第一個參數為 address domain，若是使用 Unix domain 要使用 AF_UNIX，而 Internet domain 的話則像範例中一樣使用 AF_INET。
	* 第二個參數為 socket type，此處採用 SOCK_STREAM，為連續的字元流。若要使用 datagram 的方式，要改用 SOCK_DGRAM。
	* 第三個參數為使用的 protocol，若為 0，作業系統會選擇一個合適的協定，例如 TCP 或 UDP。
	* 回傳值為 file descriptor table 的某一個入口，若失敗則回傳 -1。
* `bzero((char *) &serv_addr, sizeof(serv_addr))`：bzero() 會將 buffer 內的值全部設定為 0。第一個參數為 buffer 位址，第二個參數為 buffer 大小。
* `portno = atoi(argv[1])`：把輸入的 port number 轉成數字。
* `serv_addr.sin_family = AF_INET`：開始設定 serv_addr，首先第一個要設定的為 sin_family，意思為 address family，設定為 AF_INET。
* `serv_addr.sin_port = htons(protno)`：接著設定 port number，值得注意的是因為網路上使用 big endian，而大部分電腦採用 little endian，所以要透過 [htons()](http://www.linuxhowtos.org/data/6/byteorder.html) 這個函數幫忙轉換 port number。
* `serv_addr.sin_addr.s_addr = INADDR_ANY`：設定 IP address，此處通常為執行 server 那台機器的 IP 位址，可以透過 INADDR_ANY 這個變數取得。
* `if(bind(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) error("...")`：將剛剛用 socket() 建立的 socket bind 到 serv_addr 這個位址，成功回傳 0，失敗回傳 -1。[bind()](http://www.linuxhowtos.org/data/6/bind.txt)。
* `liten(sockfd, 5)`：這裡比較值得注意的是第二個參數，這是指 blocking queue 的大小，當程式在處理某個連線時，允許等待的連線上限。而 5 為大部分系統所允許的上限。[listen() man page](http://www.linuxhowtos.org/data/6/listen.txt)。
* `newsockfd = accept(sockfd, (struct sockaddr*)&cli_addr, &clilen);`：accept() 會 block 整個程式直到有 client 連上。回傳值為一個新的 file descriptor，而所有的通訊都要在這個 file descriptor 完成。第二個參數為一個 client 位址的參考指標。[accept() man page](http://www.linuxhowtos.org/data/6/accept.txt)。
* `n = read(newsockfd, buffer, 255)`：從剛剛 accept() 回傳的 file descriptor 來將資料讀進 buffer 之中。[read() man page](http://www.linuxhowtos.org/data/6/read.txt)。
* `n = write(newsockfd, "...", ...)`：[write() man page](http://www.linuxhowtos.org/data/6/write.txt)。

## Client Code
有部分程式碼已經在上面介紹過，所以可能會跳過比較多。
* `#include <netdb.h>`：定義了 hostent 這個結構，之後會有更詳細的說明。
* `struct hostent *server`：hostent 結構內容
```c
struct  hostent
{
  char    *h_name;        /* official name of host */
  char    **h_aliases;    /* alias list */
  int     h_addrtype;     /* host address type */
  int     h_length;       /* length of address */
  char    **h_addr_list;  /* list of addresses from name server */
  #define h_addr  h_addr_list[0]  /* address, for backward compatiblity */
};
```
	* h_name：主機的名稱。
	* h_aliases：主機的別名。
	* h_addrtype：要回傳的 address type，為 AF_INET。
	* h_length：位址長度，以 byte 為單位。
	* h_addr_list：一個指向網路位址列表的指標。
* `server = gethostbyname(argv[1])`：gethostbyname() 會回傳一個 hostent 指標，儲存了以 "argv[1]" 為名之主機的資訊。而 `char *h_addr` 包含了 IP address。若回傳值為 NULL，代表找不到這台機器。[gethostbyname() man page](http://www.linuxhowtos.org/data/6/gethostbyname.txt)。
* 接著我們會拿 server 中的資訊填到 serv_addr 裡頭：
```c
bzero((char *) &serv_addr, sizeof(serv_addr));
serv_addr.sin_family = AF_INET;
bcopy((char *)server->h_addr,
      (char *)&serv_addr.sin_addr.s_addr,
      server->h_length);
serv_addr.sin_port = htons(portno);
```
`void bcopy(char* s1, char* s2, int length)`會將 s1 內 length bytes 的資料複製到 s2 中。
* `if(connect(sockfd, &serv_addr, sizeof(serv_addr)) < 0) ...`：connect() 是 client 用來與 server 建立連線用的，包含了三個參數，第一個參數為 socket file descriptor，第二個參數為欲連線的 server 位址，第三個參數為 server 位址的 size。[connect() man page](http://www.linuxhowtos.org/data/6/connect.txt)。

# Ethernet Library of Intel Edison
到這邊算是初步了解 Linux Socket Programming 了，雖然還有非常多東西可以深入研究，例如使用 fork() 讓 server 可以處理更多連線，解決衍生而來的 zombie problem；研究 UDP、Unix Domain 等等。不過呢，基本上要看懂愛迪生的 Ethernet 函式庫已經不是大問題了！接著大家可以先取得愛迪生的原始碼，去[官方網站](https://software.intel.com/en-us/iot/hardware/edison/downloads)下載 Developer Kit，安裝好後開啟 Arduino IDE，選擇 Board->Intel Edison，接著開啟編譯資訊並編譯，就能找出原始碼位置了！下面我就稍微補充一下前面沒有提到的函式與結構。 

* `<sys/ioctl.h>, <net/if.h>`：Linux 常見的網路裝置操作都是以 ifreq 結構為參數，例如 `ioctl(fd, 各種屬性操作 , &ifr)`
* `<ifaddrs.h>`：取得 local ip -> `getifaddrs(&ifaddr)`。
* Edison 的 Dhcp、Dns 沒有實做任何東西，有修改 core/IPAddress.h。
* EthernetClient 沒有實做 peek()，user 需要的話可以自己弄一個。
* EthernetClient 中 availabe() 的實做是使用 poll。在這邊要先了解一個結構 `struct pollfd{int fd; short event; short revents};`，poll 類似 select，用來等待某個事件發生，使用前先設定好 pollfd 結構，此處 fd = socket、events = POLLIN（當 data 進來）、revents = 0。設定好之後可以利用指令 `ret = poll(&ufds, 1, 5000)` 第一個參數為指向 pollfd 列表的指標，第二個參數為 pollfd 的總數，第三個參數為 timeout。當 POLLIN 這個事件真的發生時 `if(ret > 0 && ufds.revent & POLLIN)` 成立，就可以用 `ret = ioctl(_sock, FIONREAD, &byte)` 來得知 socket 中有多少資料要讀。
* EthernetServer 中的 accept() 實做與 available() 類似，當有 client 連進來時（一樣是 POLLIN 事件）會呼叫 accept() 並將連線存到 pclients 陣列中沒被使用的位置。
* EthernetServer 中的 available() 是回傳已經連線的其中一個 client，不要與 EthernetClient 中的 available() 搞混了。
* UDP server 不用 listen()、accept()，只需要 bind()。 Client 不用 connect()。 SOCK_STREAM 改為 SOCK_DGRAM。 不使用 read()、write() 改用 sendto()、recvfrom()。EthernetUDP 沒有實做 peek()、remoteIP()、remotePORT()；flush() 有機率失敗。

# Reference
[Linux Howtos: C/C++ -> Sockets Tutorial](http://www.linuxhowtos.org/C_C++/socket.htm)