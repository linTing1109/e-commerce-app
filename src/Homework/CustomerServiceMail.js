import React, { useState,useRef ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

// 寄送信件 api
const apiUrl = 'http://localhost:8090/training/ecommerce/MailController/sendMailText';

const CustomerServiceMail = () => {
    // 輸入欄位驗證
  const [validated, setValidated] = useState(false);
  // 遮罩使用
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState({
        subject:'',
        question:'',
        customerName:'',
        mail:'',
        mailResult:'',
    });
    // 解構 
    const {subject,question,customerName,mail,mailResult} =data ;
  // 變更主旨
  const changeSubject = (even) => {
      // if(even.target.value !=null){
      setData(e => ({
          ...e,subject: even.target.value}));
  }
  // 變更問題內容
  const changeQuestion = (even) => {
      // if(even.target.value !=null){
      setData(e => ({
          ...e,question: even.target.value}));
  }
  // 變更聯絡姓名
  const changeCustomerName = (even) => {
      // if(even.target.value !=null){
      setData(e => ({
          ...e,customerName: even.target.value}));
  }
  // 變更聯絡mail
  const changeMail = (even) => {
      // if(even.target.value !=null){
      setData(e => ({
          ...e,mail: even.target.value}));
  }

    // 點擊送出按鈕  
    const handleSubmit = async(event)  => {
        event.preventDefault(); // 防止瀏灠器預設submit跳頁
        setValidated(true);
        const form = event.currentTarget;
        if(form.checkValidity() === true){
        await fetchList();
        }
    }
    


    // 後端api
  const fetchList = async() => {
    //注意:由於信件內容純文字格式 所以用的是\n 而不是<br/>
    const mailRealText = `客戶姓名: ${customerName}\n聯絡方式: ${mail}\n反應問題: ${question}`;

    const params = {// 固定送到客服信箱內
        "mailAddress": "javastudy1109@gmail.com", "message": subject, "messageText": mailRealText
    };
    const mailResult = await axios.get(apiUrl, {params},{ withCredentials: true })
        .then(rs => rs.data)
        .catch(error => { console.log(error); });
        setData((prevState) => ({
          ...prevState,
          mailResult:mailResult,
          }));

            // 資料新增成功 導入會員登入頁
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                // if(isLogin==true){
                  navigate('/'); //若成功登入則導頁到會員登入頁面
                // }
              }, 10000); // 1秒後自動關閉
    };


    return (
        <div>
            <Container fluid="sm">
                <p class="h2">客戶服務信箱</p>
                感謝您對E-Commerce-App的使用,若有任何疑問,請提供寶貴意見,<br/>
                我們將會盡快回覆,謝謝<br/>
                <hr/>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group >
                        <Form.Label>主旨:</Form.Label>
                        <FormControl
                            type="text" name="subject" placeholder="請輸入主旨" required
                            onBlur={changeSubject}
                        />
                        <Form.Control.Feedback type="invalid">請輸入信件主旨!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>內容</Form.Label>
                        <FormControl
                            as="textarea" rows="3" placeholder="請輸入問題" required
                            onBlur={changeQuestion}
                        />
                        <Form.Control.Feedback type="invalid">請輸入問題!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>姓名</Form.Label>
                        <FormControl
                            type="text" name="customerName" placeholder="請輸入聯繫人姓名" required
                            onBlur={changeCustomerName}
                        />
                        <Form.Control.Feedback type="invalid">請輸入聯繫人姓名!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>聯繫mail</Form.Label>
                        <FormControl
                            type="email" name="contactInformation" placeholder="請輸入聯繫mail" required
                            onBlur={changeMail}
                        />
                        <Form.Control.Feedback type="invalid">請輸入email內容!</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="outline-primary" type="submit">送出</Button>
                </Form>
                {isLoading && (
                    <div className="overlay">
                    <p class="text-danger" style={{ fontSize: '30px' }}>{mailResult}</p>
                    </div>
                 )}
            </Container>
        </div>
    )
}

export default CustomerServiceMail
