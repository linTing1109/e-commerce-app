import React, { useState,useRef ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

// 會員新增 api
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/addMemberLogin';

// 寄送信件 api
const apiUrlMail = 'http://localhost:8090/training/ecommerce/MailController/sendMailText';

const MemberAdd = () => {
  // 遮罩使用
  const [isLoading, setIsLoading] = useState(false);
  // 輸入欄位驗證
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState({
    // 後端api傳入使用:memberInfoVo傳api 三個資料包進去
    memberInfoVo:{ 
        identificationNo: '',
        cusPassword: '',
        cusName:'',
    },
    mail:'',
    //回傳所需的資料 密碼不會秀出來 所以這邊不會有密碼
    idNoUpdate: '',
    cusNameUpdate: '',
    isLogin:false,
    loginMessage:'',
    memberData:'',
});

  // 解構 
  const {memberInfoVo,idNoUpdate,cusNameUpdate,loginMessage,isLogin,mail} =data ;
  const {identificationNo,cusPassword,cusName}=memberInfoVo;

  const changeMemberID = (event) => {
    setData((prevState) => ({
      ...prevState,
      memberInfoVo: { //兩層式的寫法
        ...prevState.memberInfoVo,
        identificationNo: event.target.value,
      },
    }));
  };  
  const changeCusName = (event) => {
    setData((prevState) => ({
      ...prevState,
      memberInfoVo: { //兩層式的寫法
        ...prevState.memberInfoVo,
        cusName: event.target.value,
      },
    }));
  };  
  const changePassword = (event) => {
    setData((prevState) => ({
      ...prevState,
      memberInfoVo: { //兩層式的寫法
        ...prevState.memberInfoVo,
        cusPassword: event.target.value,
      },
    }));
  };

  const changeCusMail = (event) => {
    setData((prevState) => ({
      ...prevState,
      mail:event.target.value,
    }));
  };  
  
  // 點擊登入按鈕  
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
    const memberData = await axios.post(apiUrl, memberInfoVo,{ withCredentials: true })
        .then(rs => rs.data)
        .catch(error => { console.log(error); });
        setData((prevState) => ({
          ...prevState,
          memberData:memberData,
                idNoUpdate: memberData.identificationNo,  //這邊不會有密碼出現
                cusNameUpdate: memberData.cusName,
                loginMessage: memberData.loginMessage,
                isLogin:memberData.isLogin,
          }));
          //下面這邊是寄送註冊成功 或註冊失敗信件
          // const fetchList2 = async() => {
            //注意:由於信件內容純文字格式 所以用的是\n 而不是<br/>
           
           const mailRealText = memberData.isLogin ?`歡迎註冊E-Commerce-App\n帳號名稱: ${memberInfoVo.identificationNo}\n用戶名稱: ${memberInfoVo.cusName}\n用戶密碼: ${memberInfoVo.cusPassword}密碼請託善保管`:
                                        `歡迎註冊E-Commerce-App\n帳號名稱: ${memberInfoVo.identificationNo}帳號已存在請重新確認`;
           
           const mailTitle= memberData.isLogin ? `會員註冊成功`:`會員註冊失敗`;
           
            const params = {// 固定送到客服信箱內
                "mailAddress": mail, "message": mailTitle, "messageText": mailRealText
            };
            const mailResult = await axios.get(apiUrlMail, {params},{ withCredentials: true })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });
                setData((prevState) => ({
                  ...prevState,
                  mailResult:mailResult,
                  }));
            // };

            // 資料新增成功 導入會員登入頁
              setIsLoading(true);
              setTimeout(async() => {
                setIsLoading(false);
                if(isLogin){//新增成功導入會員登入
                  navigate('/'); 
                }else{//註冊失敗也導入會員登入
                  navigate('/'); 
                }
              }, 1000); // 1秒後自動關閉
};

const fetchList2 = async() => {
  //注意:由於信件內容純文字格式 所以用的是\n 而不是<br/>
  const mailRealText = `歡迎註冊E-Commerce-App\n帳號名稱: ${memberInfoVo.identificationNo}\n用戶名稱: ${memberInfoVo.cusName}\n用戶密碼: ${memberInfoVo.cusPassword}密碼請託善保管`;

  const params = {// 固定送到客服信箱內
      "mailAddress": mail, "message": "會員註冊成功", "messageText": mailRealText
  };
  const mailResult = await axios.get(apiUrlMail, {params},{ withCredentials: true })
      .then(rs => rs.data)
      .catch(error => { console.log(error); });
      setData((prevState) => ({
        ...prevState,
        mailResult:mailResult,
        }));
  };


  return (
    <div>
       <Container fluid="sm">
          <p class="h2">會員新增</p>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Col>
                <Col xs={3}>
                    <Form.Group >
                        <Form.Label>會員帳號 ID：</Form.Label>
                        <FormControl
                        type="text" name="id" placeholder="Enter ID" required  
                        onBlur={changeMemberID}  // 使用 onBlur 避免頻繁被觸發
                        />

                        <Form.Control.Feedback type="invalid">尚未輸入!</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={3}>
                    <Form.Group >
                        <Form.Label>會員密碼 Password：</Form.Label>
                        <FormControl
                        type="password" name="pwd" placeholder="Enter Password" required 
                        onBlur={changePassword}  // 使用 onBlur 避免頻繁被觸發
                        />

                        <Form.Control.Feedback type="invalid">尚未輸入!</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={3}>
                    <Form.Group >
                        <Form.Label>會員姓名 Name：</Form.Label>
                        <FormControl
                        type="text" name="cusName" placeholder="Enter cusName" required  
                        onBlur={changeCusName}  // 使用 onBlur 避免頻繁被觸發
                        />

                        <Form.Control.Feedback type="invalid">尚未輸入!</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={3}>
                    <Form.Group >
                        <Form.Label>會員信箱 mail</Form.Label>
                        <FormControl
                        type="text" name="cusMail" placeholder="Enter cusMail" required  
                        onBlur={changeCusMail}  // 使用 onBlur 避免頻繁被觸發
                        />

                        <Form.Control.Feedback type="invalid">尚未輸入!</Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
                        <Button variant="outline-primary" type="submit">新增會員</Button>
                </Col>
              </Col>
              </Form>
       </Container>
        {isLoading && (
            <div className="overlay">
              <p class="text-danger" style={{ fontSize: '30px' }}>{loginMessage}</p>
            </div>
        )}

    </div>
  )
}

export default MemberAdd
