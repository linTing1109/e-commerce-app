import React, { Component,useState,useEffect, Fragment } from 'react';
import { BrowserRouter, Link, Routes, Route,useLocation} from "react-router-dom";
import axios from "axios";

//檢查登入
const apiUrlcheckLogin = 'http://localhost:8090/training/ecommerce/MemberController/checkLogin';

const MemberCheck = () => {
    const [data, setData] = useState({
        
        idNo: '', 
        cusName:'',
        loginMessage: '',
        isLogin:false,
        
      });
// 解構 
  const {idNo,cusName,loginMessage,isLogin} =data ;
  const fetchList = async () => {
    const memberData = await axios
      .get(apiUrlcheckLogin, { withCredentials: true })
      .then((rs) => rs.data)
      .catch((error) => {
        console.log(error);
      });

    setData((prevState) => ({
      ...prevState,
      idNo: memberData.identificationNo,
      cusName: memberData.cusName,
      loginMessage: memberData.loginMessage,
      isLogin: memberData.isLogin,
    })
    );
  };
  // 生命週期放置的位置
  useEffect(() => {
    fetchList();
  },
  [idNo]);

  return (
    <div>
     {cusName &&  <Fragment>歡迎光臨 {cusName} 先生/小姐您好!</Fragment> }
    </div>
  )
}

export default MemberCheck



