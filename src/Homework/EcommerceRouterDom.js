import React, { Component,useState,useEffect, Fragment } from 'react';
import { BrowserRouter, Link, Routes, Route,Navigate} from "react-router-dom";
import axios from "axios";

import MemberLogic from './MemberLogic'; // 會員登入頁面 (使用:Hooks) 
import GoodsCreate from './GoodsCreate'; // 新增商品頁面 (使用:classComponent) 
import GoodsReplenishment from './GoodsReplenishment'; // 商品維護補貨 (使用:classComponent)
import GoodsList from './GoodsList'; // 後臺商品頁面(使用:classComponent)  --目前剩拉出頁碼來共用 &看要不要把最上面的排序方式拿掉
import SalesReportHooks from './SalesReportHooks';// 後臺全部訂單頁面(使用Hooks) --目前剩拉出頁碼來共用

import SearchGoods from './SearchGoods';//秀出全部商品 與 使用關鍵字查詢 顯示符合的商品頁面
import QueryCarGoods from './QueryCarGoods';
import MemberLogicOut from './MemberLogicOut';// 會員登出(同時也要清空購物車)
import CheckOutGoods from './CheckOutGoods';  // 結帳購物車頁面
import ClearCarGoods from './ClearCarGoods';  // 清空購物車
import ErrorPage from './ErrorPage';// 錯誤頁面
import SearchName from './SearchName';//搜尋輸入框(EcommerceRouterDom&SearchGoods使用)




import CarGoods from './CarGoods';//------------目前沒有用到 看有沒有需要刪掉 已經寫在主頁面了
import MemberCheck from './MemberCheck';  //------------目前沒有用到 看有沒有需要刪掉 已經寫在主頁面了


//api 購物網-會員-檢查登入 
const apiUrlcheckLogin = 'http://localhost:8090/training/ecommerce/MemberController/checkLogin';
//查詢購物車商品
const apiSearchCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryCartGoods';


const EcommerceRouterDom = () => {
  
  // const [isLoginData, setIsLoginData] = useState(isLogin);
  // 商品列表的購物車判斷使用
  
  const [carCount, setCarCount] = useState(0);
  const updateCarCount = (count) => {
    setCarCount(count);
  };

  // 購買完成後 購物車上層顯示刷新
  // const [carCount, setCarCount] = useState(0);

  const [data, setData] = useState({
    // 各欄位的初始化
    searchName:'',
    // 檢查會員目前狀態的值
    memberInfo:'',
    isLogin:false,
    cusName:'',
    idNo:'',
    seachNumberCount:0,

    //購物車數量
    queryGoodsData: [],

    // //購物車判斷使用:
    // carCount:0,

  });
  // 解構 
  const {searchName,isLogin,cusName,idNo,memberInfo,seachNumberCount,queryGoodsData,
    // carCount,
  } =data ;

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
  
  
  // // 計算搜尋次數的
  // const clickNumbetCount = (event) => {
  //   setData((prevState) => ({
  //     ...prevState,
  //     seachNumberCount: seachNumberCount+1,
  //   }));
  // };

  useEffect(() => {
    fetchMemberList();// componentDidMount:一進來就檢查登入
    fetchSearchGoodList(); //檢查購物車狀態
  },
  [carCount]);// componentDidUpdate:queryGoodsData(購物車內容有變動的時候)-->但是這樣會一直打API
  

  return (
    <BrowserRouter>
      測試:{carCount } {isLogin.toString()}
      {/* 我是測試{idNo}{isLogin ? 'true' : 'false'}{cusName}{memberInfo} */}

      <h1>E-commerce-App</h1>
      {cusName &&  <Fragment>歡迎光臨 {cusName} 先生/小姐您好!</Fragment> }<br/>
      {/* 商品搜尋: */}
      <SearchName/>



      {/* <CarGoods /> */}
    



      {/* <MemberCheck/> 最後沒有使用*/}
      {/* <input type="text" onBlur={changeSearchGoodsName} placeholder='搜尋商品名稱'/> */}
      {/* 需要在Route path那邊設定好才可以使用 */}
      {/* <Link to={`/SearchGoods/${searchName}`}><button >搜尋</button></Link>  */}
      {/* <Link to={`/SearchGoods/${searchName}?page=1`}><button >搜尋</button></Link>  */}
      {/* onClick={clickNumbetCount} */}
      
        {/* <Link to="/QueryCarGoods"><button>購物車 {queryGoodsData.length}</button></Link>
        {isLogin && <MemberLogicOut/> } */}

        {isLogin && <div>
          <Link to="/QueryCarGoods"><button>購物車 {queryGoodsData.length >0 &&　queryGoodsData.length}</button></Link>
          <MemberLogicOut/>
          </div>}
      
          
        <ul>
        { !isLogin &&
          <div>
            <li><Link to="/">會員登入-MemberLogic</Link></li>
          </div>
        }
          
          { isLogin && 
          <div>
            購物網-前臺
            <li><Link to="/SearchGoods">前臺-首頁-SearchGoods</Link></li>
            <li><Link to="/QueryCarGoods">前臺-購物車-QueryCarGoods</Link></li>
            購物網-後臺
            <li><Link to="/GoodsCreate">後臺-商品新增-GoodsCreate</Link></li>
            <li><Link to="/GoodsReplenishment">後臺-商品維護-GoodsReplenishment</Link></li>
            <li><Link to="/GoodsList">後臺-商品列表-GoodsList</Link></li>
            <li><Link to="/SalesReportHooks">後臺-訂單查詢-SalesReportHooks</Link></li>
          </div>
        }
        </ul>
            <hr />
            <Routes>
                
                {/* 判斷原則:沒有登入只有登入進得去,商品列表沒有做限制,其餘皆登入頁才可以使用 */}
                
                {/* <Route path="/"
                     element={!isLogin ? (<MemberLogic/>) : (
                      <Navigate to="/SearchGoods" replace={true} state={{ from: '/MemberLogic' }} />
                )}/> */}

                {/* <Route path="/GoodsCreate"
                     element={isLogin ? (<GoodsCreate/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/GoodsCreate' }} />
                )}/> */}
                {/* <Route path="/GoodsReplenishment"
                     element={isLogin ? (<GoodsReplenishment/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/GoodsReplenishment' }} />
                )}/> */}
                {/* <Route path="/GoodsList"
                     element={isLogin ? (<GoodsList/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/GoodsList' }} />
                )}/> */}
                {/* <Route path="/SalesReportHooks"
                     element={isLogin ? (<SalesReportHooks/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/SalesReportHooks' }} />
                )}/> */}
                {/* <Route path="/QueryCarGoods"
                     element={isLogin ? (<QueryCarGoods/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/QueryCarGoods' }} />
                )}/> */}
                {/* <Route path="/MemberLogicOut"
                     element={isLogin ? (<MemberLogicOut/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/MemberLogicOut' }} />
                )}/> */}
                {/* <Route path="/MemberCheck"
                     element={isLogin ? (<MemberCheck/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/MemberCheck' }} />
                )}/> */}
                {/* <Route path="/CheckOutGoods"
                     element={isLogin ? (<CheckOutGoods/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/CheckOutGoods' }} />
                )}/> */}
                {/* <Route path="/ClearCarGoods"
                     element={isLogin ? (<ClearCarGoods/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/ClearCarGoods' }} />
                )}/> */}
                {/* <Route path="/SalesReportHooks"
                     element={isLogin ? (<SalesReportHooks/>) : (
                      <Navigate to="/" replace={true} state={{ from: '/SalesReportHooks' }} />
                )}/> */}

                <Route path="*" element={<ErrorPage />} /> 

                <Route path="/SearchGoods" element={<SearchGoods  carCount={carCount} updateCarCount={updateCarCount} isLogin={isLogin} />} >
                    {/* <Route path=':searchName' element={<SearchGoods/>}/>   */}
                    {/* <Route path=':seachNumberCount' element={<SearchGoods/>}/>   */}
                </Route> 

                
                <Route path="/SearchName" element={<SearchName />} /> 

                <Route path="/CarGoods" element={<CarGoods />} /> 
                <Route path="/MemberCheck" element={<MemberCheck />} /> 

                <Route path="/" element={<MemberLogic isLoginData={isLogin} />} />
                {/* <Route path="/GoodsCreate" element={<GoodsCreate />} /> */}
                {/* <Route path="/GoodsReplenishment" element={<GoodsReplenishment />} /> */}
                {/* <Route path="/GoodsList" element={<GoodsList />} /> */}
                {/* <Route path="/SalesReportHooks" element={<SalesReportHooks />} /> */}
                 
                {/* <Route path="/QueryCarGoods" element={<QueryCarGoods />} />   */}
                {/* <Route path="/MemberLogicOut" element={<MemberLogicOut />} />  */}
                
                {/* <Route path="/CheckOutGoods" element={<CheckOutGoods carCount={carCount} updateCarCount={updateCarCount}/>} />   */}
                {/* 其餘操作 導入錯誤頁面 */}
                
                {/* <Route path="/MemberLogic"
                     element={ !isLogin ? (<MemberLogic/>) : (
                      <SearchGoods/>) } /> */}

                <Route path="/SalesReportHooks"
                     element={ isLogin ? (<SalesReportHooks/>) : (
                      <MemberLogic/>) } />

                <Route path="/GoodsCreate"
                     element={ isLogin ? (<GoodsCreate/>) : (
                      <MemberLogic/>) } />

                <Route path="/GoodsReplenishment"
                     element={ isLogin ? (<GoodsReplenishment/>) : (
                      <MemberLogic/>) } />

                <Route path="/GoodsList"
                     element={ isLogin ? (<GoodsList/>) : (
                      <MemberLogic/>) } />

                <Route path="/QueryCarGoods"
                     element={ isLogin ? (<QueryCarGoods/>) : (
                      <MemberLogic/>) } />

                <Route path="/MemberLogicOut"
                     element={ isLogin ? (<MemberLogicOut/>) : (
                      <MemberLogic/>) } />

                <Route path="/CheckOutGoods"
                     element={ isLogin ? (<CheckOutGoods carCount={carCount} updateCarCount={updateCarCount}/>) : (
                      <MemberLogic/>) } />

               
            </Routes>
    </BrowserRouter>
  )
}

export default EcommerceRouterDom
