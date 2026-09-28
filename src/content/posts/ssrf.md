---
title: 'Server-side request forgery - SSRF'
slug: ssrf
type: writeup
date: 2021-09-27
summary: 'Server-side request forgery (SSRF)...'
tags: [security, writeup]
---

# Server-side request forgery (SSRF)
## What is Server-side request forgery ?
SSRF là 1 lỗ hổng bảo mật web cho phéo kẻ tấn công điều khiển ứng dụng phía máy chủ thực hiện các yêu cầu HTTP đến 1 tên miền tùy ý của hacker.
Trong 1 cuộc tấn công SSRF điển hình thì hacker có thể kiến server tạo kết nối với các dịch vụ chỉ dành cho nội bộ trong cở sở hạ tầng của tổ chức. Trong các trường họp khác thì có thể buộc máy chủ kết nối với các hệ thống bên ngoài, có thể làm rõ rỉ dữ liệu nhạy cảm,..
Thông thường, SSRF lcasc cuộc tấn công nhắm tục tiêu là các hệ thống nội bộ phía sau tường lửa mà thông thường không thể tiếp cận với bên ngoài(nhưng có thể thông qua 1 server để tiếp cận).
Sử dụng các cuộc tấn công SSRF nó có thể:

Quét hệ thống và tấn công từ mạng nội bộ mà không phải là truy cập bình thường

Liệt kê và các dịch vụ đang chạy trên các máy chủ tấn công

Khai thác dịch vụ chứng thực dựa trên máy chủ
## Impact of SSRF attacks
SSRF thành công thường có thể đẫn đến các hành động truy cập trái phép vào dữ liệu trong tổ chúc, trong chính ứng dụng dễ bị tấn công hoặc trên các hệ thống back-end mà ứng dụng có thể giao tiếp. Trong 1 vài trường hợp, SSRF có thể cho phép hacker thực hiện các câu lệnh tùy ý.
Việc khai thác SSRF gây ra kết nối với các hệ thống của bên thứ 3 bên ngoài có thể dẫn đến các cuộc tấn công nguy hiểm có vẻ như bắt nguồn từ tổ chức lưu trữ ứng dụng có lỗ hổng bảo mật.
## Type of SSRF attack
SSRF attacks against the server itself( Tấn công SSRF tấn công lại chính máy chủ): Hacker khiến ứng dụng thực hiện 1 yêu cầu HTTP quay lại máy chủ đang lưu trữ ứng dụng, thông qua giao diện mạng vòng lặp của nó. Điều này thường liên quan đến việc cung cấp URL có tên máy chủ như 127.0.0.1 hoặc localhost.
SSRF attacks against other back-end systems( Tấn công SSRF chống lại hệ thống back-end khác): Các hệ thống này thường có địa chỉ IP riêng không định tuyến được. Vì các hệ thống back-end thường được bảo vệ bởi cấu trúc liên kết mạng, chúng thường có vị trí bảo mật yếu hơn. Trong nhiều trường hợp, hệ thống back-end nội bộ chứa chức năng nhạy cảm có thể được truy cập mà không cần xác thực bởi bất kỳ ai có thể tương tác với hệ thống.
SSRF with blacklist-based input filters(SSRF với bộ lọc đầu vào dựa trên blacklist)
SSRF with whitelist-based input filters(SSRF với bộ lọc đầu vào dựa trên whitelist)
Bypassing SSRF filters via open redirection(Bỏ qua bộ lọc SSRF thông qua chuyển hướng): Với điều kiện API được sử dụng để thực hiện yêu cầu HTTP phía sau hỗ trợ chuyển hướng, bạn có thể tạo một URL đáp ứng bộ lọc và dẫn đến một yêu cầu được chuyển hướng đến mục tiêu phía sau mong muốn.
## Prevent SSRF attacks
Để ngăn ngừa các lỗ hổng SSRF trong ứng dụng web chúng ta có thể sử dụng whitelist, domains và protocols được phép truy cập tài nguyên máy chủ.
Nên tránh sử dụng các chức năng mà người dùng trực tiếp yêu cầu tài nguyên thay cho máy chủ. Ngoài ra bạn cũng nên filter input của người dùng bằng blacklist.
## SSRF Lab
### Lab: Basic SSRF against the local server
```
This lab has a stock check feature which fetches data from an internal system.
To solve the lab, change the stock check URL to access the admin interface at http://localhost/admin and delete the user carlos.
```
Bài lab mô tả rằng lỗi chúng ta khai thác tại phần check stock, và để hoàn thành thì phải xóa được user carlos bằng quyền admin
Truy cập bài lab chúng ta thấy 1 website bán hàng bình thường.
Thử truy cập đến trang admin thì nhận được phản hồi như sau :
Sau đó qua kiểm tra request check stock mà đề bài đã đề cập tới và nhận thấy rằng request này sử dụng stockAPI để chuyển hướng đến URL của stock. Điều đó có nghĩa chúng ta có thể lợi dụng stockAPI để gọi lên thao tác xóa người dùng và trả về kết quả :
```
http://localhost/admin/delete?username=carlos
```
Thay thế vào request và chờ kết quả trả về .
### Lab: Basic SSRF against another back-end system
```
This lab has a stock check feature which fetches data from an internal system.
To solve the lab, use the stock check functionality to scan the internal 192.168.0.X range for an admin interface on port 8080, then use it to delete the user carlos.
```
Bài lab này được mô tả tương tự bài trên, tuy nhiên có 1 điểm khác biệt là chúng ta không biết được vị trí chính xác của mạng nội bộ, chỉ có gợi ý là sẽ nằm trong 192.168.0.X:8080.
Điều này có thể giải quyết được bằng cách dùng Intruder để bruteforce hết tất cả dưới form payload sau:
```
http://192.168.0.X:8080/admin/delete?username=carlos
```
Truy cập bài web chúng ta thấy được trang web bán hàng thông thường, bắt request và chuyển sang Intruder để bắt đầu bruteforce.
Setup payload như hình sau :
Sau đó bắt đầu tấn công
Sau khi tấn công xong chúng ta có thể xác định được mạng nội bộ dựa trên kết quả trả về như sau:
và chúng ta đã hoàn thành bài lab
### Lab: SSRF with blacklist-based input filter
```
This lab has a stock check feature which fetches data from an internal system.
To solve the lab, change the stock check URL to access the admin interface at http://localhost/admin and delete the user carlos.
The developer has deployed two weak anti-SSRF defenses that you will need to bypass.
```
Bài lab mô tả lỗ hổng tương tự lần trước, tuy nhiên lần này dev đã thêm 2 hệ thống bảo mật chống lại SSRF và yêu cầu chúng ta vượt qua nó.
Chúng ta hãy truy cập lab và xem có gì mới nhé .
Bắt request của chức năng check stock và chuyển sang repeater để bắt đầu tìm ra filler
Sau nhiều lần filer thì chúng ta biết được rằng dev đã filter đi “localhost” “127.0.0.1” và “admin” từ đó chúng ta rút ra được payload như sau :
```
http://127.1/%2561dmin/delete?username=carlos
```
### Lab: SSRF with whitelist-based input filter
```
This lab has a stock check feature which fetches data from an internal system.
To solve the lab, change the stock check URL to access the admin interface at http://localhost/admin and delete the user carlos.
The developer has deployed an anti-SSRF defense you will need to bypass.
```
Bài này tương tự bài trên, tuy nhiên cơ chế bảo mật với SSRF có sự thay đổi, thay vì sử dụng blacklist để filer thì bây giờ dùng whitelist để filter các input được cho phép. Đây là 1 gợi ý đáng giá cho bài lab này. Dựa vào đó chúng ta search gg xem cách bypass whitelist và có kết quả như sau :
```
The URL specification contains a number of features that are liable to be overlooked when 
implementing ad hoc parsing and validation of URLs:
   + You can embed credentials in a URL before the hostname, using the @ character. 
   For example: https://expected-host@evil-host.
   + You can use the # character to indicate a URL fragment. For example: 
   https://evil-host#expected-host.
   + You can leverage the DNS naming hierarchy to place required input into a fully-qualified 
   DNS name that you control. For example: https://expected-host.evil-host.  
   + You can URL-encode characters to confuse the URL-parsing code. This is particularly useful 
   if the code that implements the filter handles URL-encoded characters differently than the code
   that performs the back-end HTTP request.
   + You can use combinations of these techniques together.
```
Dựa vào các hướng dẫn có trên chúng ta truy cập bài lab và bắt request như thường lệ có được:
Chuyển sang reepeater để kiểm tra xem filer ở đây là gì, thì chúng ta nhận được thông báo sau :
Điều đó có nghĩa là whitelist ở đây là : *hhtp://stock.weliketoshop.net/* , vậy chúng ta thử xem URL dạng này có được chấp nhận hay không nhé, này là mình dựa vào ký tự @ để nhúng đường link mong muốn vào server.
```
http://username@stock.weliketoshop.net/
```
Và kết quả trả về chúng ta thấy rằng không hề bị chặn lại
Điều đó có nghĩa chúng ta sẽ nhúng đường link vào sau server được, tuy nhiên mình còn phải thực hiện thao tác xóa username nên mình sẽ cần ký tự # để thêm phân đoạn vào. Tuy nhiên ký tự # lại bị chặn => mình sẽ sử dụng các tương tự bài trên URL encoding # =? %2523
```
http://localhost:80%2523@stock.weliketoshop.net/admin/delete?username=carlos
```
### Lab: SSRF with filter bypass via open redirection vulnerability
```
This lab has a stock check feature which fetches data from an internal system.
To solve the lab, change the stock check URL to access the admin interface at http://192.168.0.12:8080/admin and delete the user carlos.
The stock checker has been restricted to only access the local application, so you will need to find an open redirect affecting the application first
```
Lỗ hổng checkstock đã bị hạn chế lại, không thể truy cập từ bên ngoài như những bài lab trên, hướng đi mà bài này chỉ dẫn đó chính là tìm 1 đường chuyển hướng (open redirect) khác đến ứng dụng
Truy cập bài lab và làm theo các bước như các bài trên, chúng ta nhận được phản hồi như sau.
Điều đó có nghĩa là chúng ta không thể khai thác từ request của check stock được nữa, tuy nhiên có vài button với chức năng khác trong bài và chúng ta chỉ cần tìm ra chức năng có gọi và trả về URL là có thể khai thác bằng open redirection
Sau 1 thời gian vừa test và bắt lại request cuối cùng cũng tìm ra được chức năng nextprotduct có request như sau :
Request này sẽ trả về URL được chỉ định nên chúng ta có thể dựa vào đó để chèn url của chúng ta vào. Chúng ta có thể lợi dụng điểm này để dùng stockAPI trả về chức năng next protduct rồi thực hiện thao tác xóa user
```
/product/nextProduct?currentProductId=16&path=/product/nextProduct?path=http://192.168.0.12:8080/admin/delete?username=carlos
```
### Lab: Blind SSRF with out-of-band detection
```
This site uses analytics software which fetches the URL specified in the Referer header when a product page is loaded.
To solve the lab, use this functionality to cause an HTTP request to the public Burp Collaborator server.
```
Bài này mô tả rằng lỗ hổng ở phần mềm phân tích tìm nạp URL được chỉ định trong Referer header khi trang được tải. Để giải quyết bài lab thì chúng ta cần phải sử dụng Burp Collaboration server mà Burp Suite hỗ trợ để thực hiện 1 cuộc tấn công out-of-band.
### Lab: Blind SSRF with Shellshock exploitation
```
This site uses analytics software which fetches the URL specified in the Referer header when a product page is loaded.
To solve the lab, use this functionality to perform a blind SSRF attack against an internal server in the 192.168.0.X range on port 8080. In the blind attack, use a Shellshock payload against the internal server to exfiltrate the name of the OS user.
```
Đầu tiên chúng ta có thể tìm hiểu thêm về [Shellshock](https://bizflycloud.vn/tin-tuc/tim-hieu-ve-lo-hong-bao-mat-nghiem-trong-shellshock-300.htm) tại đây