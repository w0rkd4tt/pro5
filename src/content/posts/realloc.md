---
title: '[Pwnable.tw] – Realloc'
slug: realloc
type: blog
date: 2021-12-30
summary: '[Pwnable.tw] – [Realloc](https://pwnable.tw/challenge/#40)...'
tags: [security, writeup]
---

## [Pwnable.tw] – [Realloc](https://pwnable.tw/challenge/#40)
PIE bị vô hiệu hóa, điều này sẽ dễ dàng hơn cho việc leak địa chỉ.
##### allocate()
Đọc index đầu tiên là loại long, và giá trị chỉ có thể là 0 hoặc 1, size phải