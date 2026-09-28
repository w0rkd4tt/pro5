---
title: 'XML external entity injection - XXE'
slug: xxe
type: blog
date: 2021-09-27
summary: 'XML external entity injection (XXE)...'
tags: [security, writeup]
---

# XML external entity injection (XXE)
## What is XML enternal entity injection ?
XML entermal entity injection hay còn được gọi là XXE injection là 1 lỗ hổng được đánh giá mức độ nghiêm trọng là 4/10 Web Application Secirity Risks của OWASP.
XXE là một lỗ hổng bảo mật web cho phép hacker tấn công can thiệp vào quá trình xử lí dữ liệu XML của application.
Về XXE thì sẽ có 2 phần định nghĩa như sau :
- XML : là ngôn ngữ đánh dấu mở rộng được thiết kế với mục đích luuw trữ truyền dữ liệu và cả người và “máy” đều có thể đọc được.
Struct XML:
```
      eMB
      MB
      2021
40000000
```
Dòng đầu tiên là dùng để khai báo XML ( XML declaration)
Phần thân bao gồm nhiều cặp thẻ khác nhau tạo nên các phần tử khác nhau và lồng vào nhau tạo thành cấu trúc dạng cây. Sẽ có quy định về cú pháp, cách khai báo, cách lồng các phần tử, thuộc tính ,….

External Entity : entity tham chiếu đến nội dung một file bên ngoài tài liệu XML.
*Entity : là 1 khái niệm có thể dược sử dụng như một kiểu tham chiếu đến dữ liệu, cho phép thay thế 1 ký tự đặc biệt,
1 khối văn bản hay thậm chí toàn bộ nội dung 1 file vào trong tài liệu XML. Một số kiểu entity: character, parameter, named (internal), external…
```
]>
```
==> XXE là lỗ hổng lợi dụng tính năng phân tích cú pháp của XML dùng để phân tích cú pháp đầu vào XML từ người dùng.
Dựa vào đó hacker có thể truy cập các tệp cục bộ, chạy các lệnh, quét các dịch vụ và các cổng nội bộ, truy cập mạng nội bộ, từ đó thưc hiện nhiều phương pháp tấn công tương ứng.
## How do XXE vulnerabilities arise?
Lỗi XXE phát sinh do bên trong XML có chứa các tính năng nguy hiểm và XML cho phép sử dụng các công cụ phân tích các tính năng này.
## What are the types of XXE attacks?

Exploit XXE to retireve files(Khai thác XXE để truy xuất file) :  External entity được xác định có chứa nội dung của file và trả về trong phản hồi của ứng dụng.

Exploit XXE to perform SSRF attacks(Khai thác XXE để thực hiện các cuộc tấn công SSRF) : External entity được xác định dựa trên URL đến hệ thống back-end.

Exploit blind XXE exfiltrate data out-of-band(Khai thác lỗ hổng XXE mù ngoài luồng dữ liệu exfiltrate): Dữ liệu nhạy cảm có thể được truyền từ máy chủ ứng dụng đến máy chủ của hacker.

Exploit blind XXE to retire data via error messages(Khai thác lỗ hổng XXE mù để truy xuất dữ liệu thông qua thông báo lỗi): Nơi mà hacker dùng các thông báo lỗi để phân tích dữ liệu nhạy cảm.
## XXE attack flow
Hacker có thể tận dụng tối đa các thực thể bên ngoài XML để sử dụng lổ hổng này nhằm sử dụng chức năng bên ngoài của nó.
Trong nhiều trường hợp thì lỗ hổng XXE cũng có thể là 1 ví dụ về cách hacker có thể tận dụng cấu hình sai này của trình phân tích cú pháo XML về cơ bản biến nó thành 1 máy chủ proxy để chúng có thể thực hiện các cuộc tấn công Select query về phía máy chủ
và truy cập vào mạng nội bộ hoặc có thể kết nối với các máy chủ công cộng bên ngoài từ sau tường lửa. Hacker có thể sử dụng định nghĩa thực thể XML và định danh hệ thống trên trình phân tích cú pháp XML để chỉ chấp nhận các yêu cầu được tạo ra thủ công độc hại chứa các tệp XML dường như vô hại đối với tường lửa hoặc ứng dụng vì chức năng của các dịch vụ đó dường như không bị tấn công trực tiếp.
## Find and test for XXE vulnerabilities
Đa số các lỗ hổng XXE thì chúng ta có thể tìm được thông qua chức năng scanner vulnerabilities của Burp Suite hỗ trợ.
Ngoài ra có thể kiểm tra thủ công như sau :

Kiểm tra khả năng truy xuất tệp bằng cashc xác định một external entity dựa trên một tệp hệ điều hành nổi tiếng và sử dụng thực thể đó trong dữ liệu được trả về trong phản hồi của ứng dụng

Kiểm tra các lỗ hổng blind XXE bằng cashc xác định 1 external entity bên dựa trên URL của 1 hệ thống mà bạn kiểm soát và giám sát. Chức năng Burp Collaborator của Burp Suite có thể hỗ trợ chúng ta phần này.

Kiểm tra xem máy có dễ bị injection vào dữ liệu không phải là XML do người dùng cung cấp trong tài liệu XML phía máy chủ hay không, bằng cashc sử dụng XInclude attack để cố gắng truy xuất hệ điều hành nổi tiếng.
*XInclude* là một phần của đặc tả XML cho phép một tài liệu XML được xây dựng từ các tài liệu con. Bạn có thể đặt một cuộc tấn công XInclude trong bất kỳ giá trị dữ liệu nào trong tài liệu XML, do đó, cuộc tấn công có thể được thực hiện trong các tình huống mà bạn chỉ kiểm soát một mục dữ liệu duy nhất được đặt vào tài liệu XML phía máy chủ.
Để thực hiện một cuộc tấn công XInclude, bạn cần tham chiếu không gian tên XInclude và cung cấp đường dẫn đến tệp mà bạn muốn đưa vào. Ví dụ:
```
```
### Prevent XXE vulnerabilities
Các lỗ hổng XXE đều phát sinh do thư viện phân tích cú pháp XML của ứng dụng hỗ trợ các tính năng XML tiềm ẩn nguy hiểm ma fungws dụng không cần hoặc có ý định sử dụng. CÁch dễ nhất và hiệu quả nhất là vô hiệu hóa những chức năng tiềm ẩn nguy hiểm đó.

Bất cứ khi nào có thể, hãy sử dụng các định dạng dữ liệu ít phức tạp hơn như JSON và tránh tuần tự hóa dữ liệu nhạy cảm.

Vá hoặc nâng cấp tất cả các bộ xử lý và thư viện XML được ứng dụng hoặc trên hệ điều hành cơ bản sử dụng. Sử dụng bộ kiểm tra phụ thuộc. Cập nhật SOAP lên SOAP 1.2 hoặc cao hơn.

Triển khai xác thực, lọc hoặc khử trùng đầu vào tích cực phía máy chủ để ngăn chặn dữ liệu thù địch trong các tài liệu, tiêu đề hoặc nút XML.

Xác minh rằng chức năng tải lên tệp XML hoặc XSL kiểm tra XML đến bằng cách sử dụng xác thực XSD hoặc tương tự.

Các công cụ Kiểm tra Bảo mật Ứng dụng Tĩnh có thể phát hiện XXE trong mã nguồn, nhưng xem xét mã thủ công là giải pháp thay thế tốt nhất trong các ứng dụng phức tạp với nhiều tích hợp.
## XXE Lab
### Lab: Exploiting XXE using external entities to retrieve files
```
This lab has a "Check stock" feature that parses XML input and returns any unexpected values in the response.
To solve the lab, inject an XML external entity to retrieve the contents of the /etc/passwd file.
```
Mô tả trên đã chỉ ra cho chúng ta biết lỗi chúng ta có thể khai thác nằm ở chức năng “Check stock” của web, và yêu cầu chúng ta leak được file passwd thì sẽ hoàn thành.
Sau khi check stock và bắt lạ request chúng ta có thể thấy 1 XML cơ bản và cách exploit vô cùng đơn giản.
```
 ]>
&xxe;
1
```
Thay vì kiểm tra productID như bt thì payload này sẽ tham chiếu đến thực thể bên ngoài(external entity) và truy xấu giá trị của xxe là file:///etc/passwd
### Lab: Exploiting XXE to perform SSRF attacks
```
This lab has a "Check stock" feature that parses XML input and returns any unexpected values in the response.
The lab server is running a (simulated) EC2 metadata endpoint at the default URL, which is http://169.254.169.254/. This endpoint can be used to retrieve data about the instance, some of which might be sensitive.
To solve the lab, exploit the XXE vulnerability to perform an SSRF attack that obtains the server's IAM secret access key from the EC2 metadata endpoint.
```
Như bài lab đã mô tả cho chúng ta biết được rằng mạng nội bộ mà chúng ta cần là http://169.254.169.254/ và request chúng ta bắt được khi check stock vẫn là form XXE như cũ điều đó dẫn chúng ta đến payload như sau :
```
 ]>
```
Tiếp theo chúng ta chuyển sang repeater để thử >
“Invalid product ID:” Là phản hồi được trả về, kèm theo sau đó là 1 foldername, sau đó thêm folder name vào phía sau của URL mà chúng ta có được, cứ tiếp tục như thế cho đến khi chúng ta có được SecretAccessKey.
```
latest/meta-data/iam/security-credentials/admin
```
Sau đó chúng ta có được payload cuối cùng như sau
```
 ]>
&xxe;1
```
### Lab: Exploiting XInclude to retrieve files
```
This lab has a "Check stock" feature that embeds the user input inside a server-side XML document that is subsequently parsed.
Because you don't control the entire XML document you can't define a DTD to launch a classic XXE attack.
To solve the lab, inject an XInclude statement to retrieve the contents of the /etc/passwd file.
```
Chúng ta sử dụng XInclude để khai thác file /etc/passwd. Trước hết chúng ta cần biết về XInclude : Để thực hiện một cuộc tấn công XInclude,
bạn cần tham chiếu không gian tên XInclude và cung cấp đường dẫn đến tệp mà bạn muốn đưa vào. Ví dụ:
```
```
Chúng ta truy cập bài lab và bắt request của check stock như sau
Nhận thấy rằng đã có sự thay đổi trong cách thử sử dụng XML, lab đã không sử dụng cấu trúc như cũ mà đã chọn cách nhúng dữ liệu vào DOCTYPE,
điều này khiến chúng ta không thể thực hiện 1 cuộc tấn công cổ điển vì không thể xác định được rõ ràng cấu trúc của XML.
Chúng ta có thể sử
dụng XInclude để khai thác file /etc/passwd. Trước hết chúng ta cần biết về XInclude : XInclude là một phần của đặc tả XML cho phép một tài
liệu XML được xây dựng từ các tài liệu con. Bạn có thể đặt một cuộc tấn công XInclude trong bất kỳ giá trị dữ liệu nào trong tài liệu XML, do
đó, cuộc tấn công có thể được thực hiện trong các tình huống mà bạn chỉ kiểm soát một mục dữ liệu duy nhất được đặt vào tài liệu XML phía máy
chủ. Để thực hiện một cuộc tấn công XInclude, bạn cần tham chiếu không gian tên XInclude và cung cấp đường dẫn đến tệp mà bạn muốn đưa vào.
Ví dụ:
```
```
Sau đó chúng ta truyền payload này vào 1 param của request cụ thể hơn lần này là ProductID.
Và chúng ta đã leak được file passwd.
### Lab: Exploiting XXE via image file upload
```
This lab lets users attach avatars to comments and uses the Apache Batik library to process avatar image files.
To solve the lab, upload an image that displays the contents of the /etc/hostname file after processing. Then use the "Submit solution" button to submit the value of the server hostname.
```
Bài lab này mô tả khá chi tiết như sau, lồ hổng mà chúng ta cần khai thác lần này là phần comment của bài, trong phần đó cho đính kèm ảnh và bài yêu cầu chúng ta trả về file
/etc/hostname và click Submit solution để solve bài lab.
Hint: ảnh dạng SVG sẽ có format XML :33
Điều này đã giúp chúng ta hình dung được cách thức tấn công, truy cập bài lab và chúng ta nhận được 1 blog như sau :
Chúng ta thấy phần cmt sẽ có phần thêm avatar , từ đó chúng ta có thể thêm bất kỳ ảnh nào. Như gọi ý thì SVG sẽ có format là XML nên chúng ta tạo 1 XML như sau và lưu dưới định
dạng svg.
```
 ]>
&xxe;
```
Payload này sẽ trả về giá trị của file /etc/hostname mà chúng ta cần.
Giá trị của ảnh trả về như sau
```
94a8bb1f14c8
```
### Lab: Blind XXE with out-of-band interaction
```
This lab has a "Check stock" feature that parses XML input but does not display the result.
You can detect the blind XXE vulnerability by triggering out-of-band interactions with an external domain.
To solve the lab, use an external entity to make the XML parser issue a DNS lookup and HTTP request to Burp Collaborator.
```
Mô tả nói rằng check stock vẫn sẽ là mục tiêu exploit của chúng ta tuy nhiên lần này lại là blind vulnerability và đề xuất chúng ta sử dụng out-of-band ([OAST](https://portswigger.net/burp/application-security-testing/oast)) để khai thác.
Truy cập bài lab chúng ta lại thấy web bán hàng và tìm tới chức năng check stock rồi bắt lại request.
Tại đây chúng ta có thể thấy format của XML điều đó có nghĩa chúng ta có thể thực hiện 1 cuộc tấn công XXE cơ bản, tuy nhiên phải áp dụng out-of-band. Và Burp Collaboration sẽ cũng cấp cho chúng ta 1 client để nhận dữ liệu về. Từ đó có payload như sau :
```
 ]>
```
Sau khi poll về chúng ta sẽ thấy data đã có thể chuyển về client điều này có nghĩa là chúng ta đã thành công tấn công OAST
### Lab: Blind XXE with out-of-band interaction via XML parameter entities
```
This lab has a "Check stock" feature that parses XML input, but does not display any unexpected values, and blocks requests containing regular external entities.
To solve the lab, use a parameter entity to make the XML parser issue a DNS lookup and HTTP request to Burp Collaborator.
```
Đầu tiên chúng ta bắt lại request và thực thi thử XXE cơ bản thì nhận thấy rằng không có gì trả về :
Đôi khi các cuộc tấn công external entity XXE thường bị chặn, do 1 số xác thực đầu vào của ứng dụng hoặc
1 số quá trình làm cứng trình phần tích cú pháp XML đang được sử dụng. Trong trường hợp này chúng ta có
thể sử dụng tham số XML để thay thế. Đầu tiên khai báo 1 thực thể tham số XML :
```
```
Sau đó tham chiếu thực thể như sau :
```
 %xxe; ]>
```
Sau khi send request thì chúng ta poll data về client.
Và chúng ta đã hoàn thành bài lab
### Lab: Exploiting blind XXE to exfiltrate data using a malicious external DTD
```
This lab has a "Check stock" feature that parses XML input but does not display the result.
To solve the lab, exfiltrate the contents of the /etc/hostname file.
```
Bài lab mô tả răng lỗ hổng này sẽ có phân tích input và sẽ không hiển thị kết quả, điều này làm rõ đặc tính của blind vuln.
Truy cập bài lab chúng ta thấy 1 trang web bán hàng với chức năng check stock như đã biết trước , tuy nhiên để thực hiện được exfiltrate data đối với XXE thì chúng ta cần  maliciuos DTD, cụ thể hơn trong bài này chúng ta sẽ tạo 1 malicious DTD bằng exploit server. Dựa trên các tiêu chí để tạo ra 1 malicious DTD chúng ta tạo được payload như sau :
```
">
%eval;
%exfiltrate;
==> 
">
%eval;
%exfil;
```
Đầu tiên chúng ta thêm đuôi dtd vào tên file để file trở thành đúng định dạng.
Sau đó sent payload vào exploit server:
Vậy là chúng ta đã chuẩn bị xong 1 malicious DTD, tiếp theo tới việc dùng nó để extract data sáng client của chúng ta :vv
```
 %xxe;]>
==>
 %xxe;]>
```
Sau đó chèn vào request và tấn công như hình thức cơ bản, tiếp theo truy cập Burp Collaboration poll data về và chúng ta sẽ có được giá trị của /etc/hostname
Vào check data phần có giao thức HTTP chúng ta thấy được giá trị của file chúng ta cần :
### Lab: Exploiting blind XXE to retrieve data via error messages
```
This lab has a "Check stock" feature that parses XML input but does not display the result.
To solve the lab, use an external DTD to trigger an error message that displays the contents of the /etc/passwd file.
The lab contains a link to an exploit server on a different domain where you can host your malicious DTD.
```
Bài lab đã mô tả rằng chúng ta phải khai thác vào phần kích hoạt lỗi của website> Một cách tiếp cận khác để khai thác XXE mù là kích hoạt lỗi phân tích cú pháp XML trong đó thông báo lỗi chứa dữ liệu nhạy cảm mà bạn muốn truy xuất. Điều này sẽ có hiệu lực nếu ứng dụng trả về thông báo lỗi kết quả trong phản hồi của nó.
Dựa vào đó chúng ta làm tương tự như bài lab trên, tuy nhiên phần client sẽ là 1 client không tồn tại = > điều này sẽ dẫn đến lỗi được kích hoạt và tin nhắn lỗi trả về cũng giá
trị file mà mình mong muốn.
```
">
%eval;
%exfil;
 %xxe;]>
```
### Lab: Exploiting XXE to retrieve data by repurposing a local DTD
```
This lab has a "Check stock" feature that parses XML input but does not display the result.
To solve the lab, trigger an error message containing the contents of the /etc/passwd file.
You'll need to reference an existing DTD file on the server and redefine an entity from it.
```
Bài lab mô tả rằng chúng ta sẽ kích hoạt lỗi và trả về file passwd, tuy nhiên lần này chúng ta không tự viết file malicious DTD nữa mà sẽ sử dụng file có sẳn trên hệ thống.
Vì cuộc tấn công XXE này liên quan đến việc định vị lại một DTD hiện có trên hệ thống tệp máy chủ, yêu cầu chính là xác định vị trí tệp phù hợp. Điều này thực sự khá đơn giản. Vì
ứng dụng trả về bất kỳ thông báo lỗi nào do trình phân tích cú pháp XML ném ra, bạn có thể dễ dàng liệt kê các tệp DTD cục bộ chỉ bằng cách cố gắng tải chúng từ bên trong DTD nội
bộ.
Chúng ta có thể kiểm tra thử xem file DTD có tồn tại hay không bằng cách chuyển payload này vào request và xem thử :
```
%local_dtd;
]>
```
Sau khi xác định được file DTD cần thiết chúng ta tiến hành exploit. Đối với kỹ thuật trước chúng ta chỉ có thể áp dụng với file malicious phía bên ngoài, lần này chúng ta khai thác bằng file local nên sẽ khác. CHúng ta dựa trên format sau để tạo payload phù hợp khi đã xác định được file DTD local:
```
">
%eval;
%error;
'>
%local_dtd;
]>
This DTD carries out the following steps:
 + Defines an XML parameter entity called local_dtd, containing the contents of the external DTD 
file that exists on the server filesystem.
 + Redefines the XML parameter entity called custom_entity, which is already defined in the external
DTD file. The entity is redefined as containing the error-based XXE exploit that was already described,
for triggering an error message containing the contents of the /etc/passwd file.
 + Uses the local_dtd entity, so that the external DTD is interpreted, including the redefined value of
the custom_entity entity. This results in the desired error message.
```
Từ format trên chúng ta có thể suy ra được payload cần thiết như sau :
```
">
%eval;
%error;
'>
%local_dtd;
]>
```