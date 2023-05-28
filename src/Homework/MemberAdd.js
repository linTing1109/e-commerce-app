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

    //回傳所需的資料 密碼不會秀出來 所以這邊不會有密碼
    idNoUpdate: '',
    cusNameUpdate: '',
    isLogin:false,
    loginMessage:'',
    memberData:'',
});

  // 解構 
  const {memberInfoVo,idNoUpdate,cusNameUpdate,loginMessage,isLogin} =data ;
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

            // 資料新增成功 導入會員登入頁
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                if(isLogin==true){
                  navigate('/'); //若成功登入則導頁到會員登入頁面
                }
              }, 1000); // 1秒後自動關閉
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
