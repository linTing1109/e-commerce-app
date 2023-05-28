import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import loginPagePic from './pic/loginPage.png';

// 會員登入 api
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/login';

// 功能:會員登入頁面
const MemberLogic = ({ isLoginData }) => {
  // 遮罩使用
  const [isLoading, setIsLoading] = useState(false);

  // 輸入欄位驗證
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();
  const inputPdRef = useRef();

  const [data, setData] = useState({

    // 後端api傳入使用:memberInfoVo傳api 把identificationNo&cusPassword包進去
    memberInfoVo: {
      identificationNo: '',
      cusPassword: '',
    },

    //回傳所需的資料 密碼不會秀出來 所以這邊不會有密碼
    idNo: '',
    cusName: '',
    isLogin: false,
    loginMessage: '',
  });

  // 解構 
  const { memberInfoVo, idNo, cusName, isLogin, loginMessage } = data;
  // const {identificationNo,cusPassword}=memberInfoVo;


  const changeMemberID = (event) => {
    setData((prevState) => ({
      ...prevState,
      memberInfoVo: { //兩層式的寫法
        ...prevState.memberInfoVo,
        identificationNo: event.target.value,
        // loginMessage:''
      },
    }));
    inputPdRef.current.focus(); //當滑鼠點擊其他地方時 游標跳到password那邊
  };

  const changePassword = (event) => {
    setData((prevState) => ({
      ...prevState,
      memberInfoVo: {
        ...prevState.memberInfoVo,
        cusPassword: event.target.value,
      },
    }));
  };

  // 點擊登入按鈕  
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止瀏灠器預設submit跳頁
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      await fetchList();

    }

  }

  // 後端api
  const fetchList = async () => {
    const memberData = await axios.post(apiUrl, memberInfoVo, { withCredentials: true })
      .then(rs => rs.data)
      .catch(error => { console.log(error); });
    setData(e => ({
      ...e,//hooks無法部分更新,加...e為保持原先欄位
      idNo: memberData.identificationNo,  //這邊不會有密碼出現
      cusName: memberData.cusName,
      loginMessage: memberData.loginMessage,
      isLogin: memberData.isLogin,
    }));

    // 將會員資訊轉換為字串並存儲到 localStorage
    localStorage.setItem('memberData', JSON.stringify(memberData));


    // //代表已經登入 導入商品頁
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (memberData.isLogin) {
        navigate('/SearchGoods'); //若成功登入則導頁到商品頁面
      }
    }, 1000); // 1秒後自動關閉
  };


  useEffect(() => {
    if (isLoginData) { //當頁面已經登入又回到登入頁面時 自動帶入到商品頁面中
      navigate('/SearchGoods');
    }

  }, [isLoginData, isLogin]);//當輸入帳號密碼更新

  const clickAddMember = () => {
    navigate('/MemberAdd');
  }


  return (
    <div>
      <Container fluid="sm" style={{ backgroundImage: `url(${loginPagePic})`, backgroundSize: '20% auto', backgroundRepeat: 'no-repeat', backgroundPosition: 'center right' }}>

        <p class="h2">會員登入</p>
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
                  onBlur={changePassword} ref={inputPdRef} // 使用 onBlur 避免頻繁被觸發
                />
                <Form.Control.Feedback type="invalid">尚未輸入!</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
              <Button variant="outline-primary" type="submit">登入</Button>{'   '}
              <Button variant="outline-primary" onClick={clickAddMember} >新增會員</Button>
            </Col>
          </Col>
        </Form>
      </Container>
      {isLoading && (
        <div className="overlay">
          <p class="text-danger" style={{ fontSize: '30px' }}>{loginMessage}</p>
        </div>
      )}

      {/* 測試用:<br/>
            idNo:{idNo}<br/>
            cusName:{cusName}<br/> */}
      {/* JSX 不能直接顯示布林值 要先轉換成String才可以直接秀出來 */}
      {/* isLogin: {String(isLogin)}<br/> 
            loginMessage:{loginMessage}<br/> */}

    </div>
  )
}

export default MemberLogic
