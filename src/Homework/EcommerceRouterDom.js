import React, { Component, useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Link, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import MemberLogic from './MemberLogic'; // 會員登入頁面 (使用:Hooks) 
import GoodsCreate from './GoodsCreate'; // 新增商品頁面 (使用:classComponent) 
import GoodsReplenishment from './GoodsReplenishment'; // 商品維護補貨 (使用:classComponent)
import GoodsList from './GoodsList'; // 後臺商品頁面(使用:classComponent)  --目前剩拉出頁碼來共用 &看要不要把最上面的排序方式拿掉
import SalesReportHooks from './SalesReportHooks';// 後臺全部訂單頁面(使用Hooks) --目前剩拉出頁碼來共用

import SearchGoods from './SearchGoods';//秀出全部商品 與 使用關鍵字查詢 顯示符合的商品頁面
import QueryCarGoods from './QueryCarGoods';//購物車頁面修改
import MemberLogicOut from './MemberLogicOut';// 會員登出(同時也要清空購物車)
import CheckOutGoods from './CheckOutGoods';  // 結帳購物車頁面
import ClearCarGoods from './ClearCarGoods';  // 清空購物車
import ErrorPage from './ErrorPage';// 錯誤頁面
import SearchName from './SearchName';//搜尋輸入框(EcommerceRouterDom&SearchGoods使用)
import MemberAdd from './MemberAdd';// 新增會員 (同時發送成功失敗信件)
import SalesReportMember from './SalesReportMember';//個人訂單查詢
import GoodsSalesReport from './GoodsSalesReport';//銷售報表
import SellWellGoods from './SellWellGoods';//熱銷商品
import CustomerServiceMail from './CustomerServiceMail';//客服信箱

import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import emailIcon from './pic/email.png';

//api 購物網-會員-檢查登入 
const apiUrlcheckLogin = 'http://localhost:8090/training/ecommerce/MemberController/checkLogin';
//查詢購物車商品
const apiSearchCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryCartGoods';


const EcommerceRouterDom = () => {

  // 從 localStorage 中讀取會員資訊(原本用這個一直維持 但會有個問題 如果後臺斷了這邊還會一直存在)
  // 所以這個只適用於後面頁面 主首頁還是一直維持跟之前一樣連後端確認
  const memberData = localStorage.getItem('memberData');
  //   // 解析 JSON 字串為 JavaScript 物件
  //   const memberObj = JSON.parse(memberData); //使用前一定要先轉 不然會取不到值
  // const memberDataID =memberObj.identificationNo;

  // 商品列表的購物車判斷使用
  const [carCount, setCarCount] = useState(0);
  const updateCarCount = (count) => {
    setCarCount(count);
  };

  // 購買完成後 購物車上層顯示刷新
  // const [carCount, setCarCount] = useState(0);

  const [data, setData] = useState({
    // 各欄位的初始化
    searchName: '',
    memberInfo: '',
    isLogin: '',
    cusName: '',
    idNo: '',
    seachNumberCount: 0,

    //購物車數量
    queryGoodsData: [],

  });
  // 解構 
  const { searchName, isLogin, cusName, idNo, memberInfo, seachNumberCount, queryGoodsData,
    // carCount,
  } = data;

  // 頁面標頭的商品搜尋
  const changeSearchGoodsName = (event) => {
    setData((prevState) => ({
      ...prevState,
      searchName: event.target.value,
    }));
  };

  // 購物網-會員-檢查登入
  const fetchMemberList = async () => {
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

  // 後端api
  const fetchSearchGoodList = async () => {
    const queryGoodsData = await axios.get(apiSearchCarUrl, { withCredentials: true })
      .then(rs => rs.data)
      .catch(error => { console.log(error); });

    if (queryGoodsData) { //如果存在
      setData(prevData => ({
        ...prevData,
        queryGoodsData: queryGoodsData,

      }));
      // updateCartCount(queryGoodsData.length);
    }
  };

  useEffect(() => {
    // if(memberData){
    //   // 解析 JSON 字串為 JavaScript 物件
    //   const memberObj = JSON.parse(memberData); //使用前一定要先轉 不然會取不到值
    //   setData((prevState) => ({
    //          memberInfo:memberObj,
    //     idNo: memberObj.identificationNo,
    //     cusName: memberObj.cusName,
    //     loginMessage: memberObj.loginMessage,
    //     isLogin: memberObj.isLogin,
    //   }));

    // }
    fetchMemberList();// componentDidMount:一進來就檢查登入
    fetchSearchGoodList(); //檢查購物車狀態
  },
    [carCount]);// componentDidUpdate:queryGoodsData(購物車內容有變動的時候)-->但是這樣會一直打API


  return (
    <Container>
      <BrowserRouter>

        <Navbar bg="dark" variant={"dark"} expand="lg">
          <Navbar.Brand href="/"><h1>E-commerce</h1>{cusName && <Fragment>{cusName} 先生/小姐您好!</Fragment>}</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">

            <Nav className="mr-auto">
              {/* to 路徑對應 Route path */}
              {!isLogin &&
                <Nav.Link as={Link} to="/">會員登入-MemberLogic</Nav.Link>}

              {isLogin && <>
                <Nav.Link as={Link} to="/SearchGoods">購物專區</Nav.Link>
                <Nav.Link as={Link} to="/SellWellGoods">熱銷商品</Nav.Link>
                {/* <Nav.Link as={Link} to="/QueryCarGoods">購物車</Nav.Link> */}
                <Nav.Link as={Link} to="/SalesReportMember">個人訂單</Nav.Link>
                <NavDropdown title="後臺" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/GoodsCreate">商品新增</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/GoodsReplenishment">商品維護</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/GoodsList">商品列表</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/SalesReportHooks">訂單查詢</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/GoodsSalesReport">銷售報表</NavDropdown.Item>
                </NavDropdown>

              </>}
            </Nav>

            <Form inline >
              <SearchName />
              {isLogin && <>
                <Nav.Link as={Link} to="/QueryCarGoods">
                  {/* 定義有queryGoodsData才顯示長度 否則一開始進去會報錯誤 */}
                  {queryGoodsData && queryGoodsData.length > 0 ? (
                    <Button variant="outline-primary" className="d-flex align-items-center">購物車 {queryGoodsData.length}</Button>) : (
                    <Button variant="outline-secondary">購物車</Button>)}
                </Nav.Link>
                
                <MemberLogicOut />
                
                <Link to="/CustomerServiceMail" > 
                  <img src={emailIcon} style={{ width: '30px', height: '35px' }} />
                </Link>     
              </>}
            </Form>
          </Navbar.Collapse>
        </Navbar>

        <br />
        <hr />
        <Routes>
          {/* 判斷原則:沒有登入只有登入進得去,商品列表沒有做限制,其餘皆登入頁才可以使用 */}

          <Route path="*" element={<ErrorPage />} />

          <Route path="/SearchGoods" element={<SearchGoods carCount={carCount} updateCarCount={updateCarCount} isLogin={isLogin} />} />

          <Route path="/SearchName" element={<SearchName />} />
          <Route path="/MemberAdd" element={<MemberAdd />} />

          <Route path="/" element={<MemberLogic isLoginData={isLogin} />} />

          <Route path="/SalesReportMember"
            element={isLogin ? (<SalesReportMember carCount={carCount} updateCarCount={updateCarCount} />) : (
              <MemberLogic />)} />

          <Route path="/SalesReportHooks"
            element={isLogin ? (<SalesReportHooks />) : (
              <MemberLogic />)} />

          <Route path="/GoodsCreate"
            element={isLogin ? (<GoodsCreate />) : (
              <MemberLogic />)} />

          <Route path="/GoodsReplenishment"
            element={isLogin ? (<GoodsReplenishment />) : (
              <MemberLogic />)} />

          <Route path="/GoodsList"
            element={isLogin ? (<GoodsList />) : (
              <MemberLogic />)} />

          <Route path="/QueryCarGoods"
            element={isLogin ? (<QueryCarGoods carCount={carCount} updateCarCount={updateCarCount} />) : (
              <MemberLogic />)} />

          <Route path="/MemberLogicOut"
            element={isLogin ? (<MemberLogicOut />) : (
              <MemberLogic />)} />

          <Route path="/CheckOutGoods"
            element={isLogin ? (<CheckOutGoods carCount={carCount} updateCarCount={updateCarCount} />) : (
              <MemberLogic />)} />

          <Route path="/GoodsSalesReport"
            element={isLogin ? (<GoodsSalesReport />) : (
              <MemberLogic />)} />

          <Route path="/CustomerServiceMail"
            element={isLogin ? (<CustomerServiceMail />) : (
              <MemberLogic />)} />

          <Route path="/SellWellGoods"
            element={isLogin ? (<SellWellGoods carCount={carCount} updateCarCount={updateCarCount} />) : (
              <MemberLogic />)} />


        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default EcommerceRouterDom
