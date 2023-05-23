import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CarGoods from './CarGoods';
import './SearchGoods.css';
import loadingWait from './pic/loadingWait.gif';


// 前台商品列表與搜尋api
const apiUrl = 'http://localhost:8090/training/ecommerce/FrontendController/queryGoodsData';
// 加入購物車
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods';

// 功能說明:秀出全部商品 與 使用關鍵字查詢 顯示符合的商品頁面
const SearchGoods = ({ carCount, updateCarCount ,isLogin}) => {

    // 加入購物車的遮罩設定:避免連續點擊導致畫面無法同步更新
    const [isLoading, setIsLoading] = useState(false);

    // useLocation接收navigate導頁傳入而來的資料
    // location.state?.xxxx 來確保null不會觸發錯誤 (不加 走登入完成進來的SearchGoods會錯 因為都還沒有任何動作) 
    // ex:searchName不會拋錯 會顯示空(因為有可能都還沒點擊 會是null)
    const location=useLocation();
    // const inboxInfo=location.state;// EcommerceRouterDom那邊傳入的資料(一定是state)
    const searchInfo=location.state?.searchName;// 商品搜尋內容
    const page=location.state?.page; //page設定固定是1(給每次點擊都傳入第一頁)
    const toggle=location.state?.toggle;//觸發使用

    // const isLoginData=location.state?.toggle;

    const navigate = useNavigate();


    // const params = useParams();
    // const nowSearch=params.searchName;


    //各欄位的初始化
    const [data, setData] = useState({
        //輸入的資訊
        currentPageNo : 1,
        pageDataSize : 5,
        pagesIconSize :5,
        searchKeyword:searchInfo,

        //api回傳的資訊
        goodsDatas:null,
        genericPageable:null,
        //
        goodsID:'',
        goodsName:'',
        description:'',
        goodsPrice:'',
        goodsQuantity:'',
        goodsImageName:'',
        status:'',

        nowToggle:toggle,//判斷是否是重新點擊搜尋按鈕使用
    });
    

    //購物車的初始化
    const [carData, setCarData] = useState({
        goodsVo :{ //api要傳入的資料
            goodsID: 0,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },
        carGoodsItem:0,//購物車傳值
        
        addGoodsData:[],
        addCarGoodsID:'',
        addCarGoodsName:'',
        addCarPrice:'',
        addCarQuantity:'',
        addCarDescription:'',
        addCarStatus:'',
    });

     
    // 解構 
    const {currentPageNo,pageDataSize,pagesIconSize,searchKeyword,
        goodsID,goodsName,description,goodsPrice,goodsQuantity,goodsImageName,status,
        queryGoodsData,goodsDatas,genericPageable,
        nowToggle} =data ;

    const{goodsVo,carGoodsItem,addGoodsData,addCarGoodsID}=carData;  





     // 最首頁點擊
     const clickPageStart = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo:1}));
    }

    // 最末頁點擊
    const clickPageEnd = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo:genericPageable.endPageNo}));
    }


    // 前一頁點擊
    const clickPageSub = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo-1}));
    }


    // 下一頁點擊
    const clickPageAdd = ()  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo+1}));
    }

    // 每個頁面上的點擊
    const clickPage = (pageNo)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: pageNo}));
    }

    // 更改每頁資料顯示筆數
    const changePageDataSize = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            pageDataSize:even.target.value,
            //避免已經選到後面頁面導致畫面有空資料
            currentPageNo:1 }));
    } 

    // 呼叫後端api:前台商品列表與搜尋
    const fetchList = async() => {
        // 這邊參數用nowSearch原因: 因為值進來每次就會塞好
        const params =  { "currentPageNo": currentPageNo,"pageDataSize":pageDataSize,"pagesIconSize":pagesIconSize,"searchKeyword":searchInfo};
        const queryGoodsData = await axios.get(apiUrl, {params})
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
            setData( e => ({
                
                    ...e,//hooks無法部分更新,加...e為保持原先欄位
                    goodsDatas:queryGoodsData.goodsDatas,
                    genericPageable:queryGoodsData.genericPageable,
                }));
    }; 

   
    // 點擊加入購物車 
    const clickAddGoods = async(event) => {
       
        setIsLoading(true);  // 在 API 請求之前設定 isLoading 為 true，顯示遮罩 (不能放API那這樣會一直開著)
        setTimeout(() => {

            const newGoodsID = parseInt(event.target.value); //需要注意傳入的是數字型態
            console.log("newGoodsID",newGoodsID);
            setCarData((prevState) => ({
            ...prevState,
            carGoodsItem: newGoodsID,
            goodsVo: {
                ...prevState.goodsVo,
                goodsID: newGoodsID,
            },
            
            }));

        }, 500); // 延遲0.5秒後執行 API 請求 只是要展顯出畫面的效果
        
        
        // const newCarCount = carCount + 1;
        // updateCarCount(newCarCount);


        // window.location="/SearchGoods"; 
        // navigate("/SearchGoods",{state:});
        
    };
    // 呼叫後端api: 加入購物車
    const fetchList2 = async() => {
        

        const addGoodsData = await axios.post(addCarUrl, goodsVo,{ withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

            if(addGoodsData != '' ){ //addGoodsData不為空才setData不然會有很多空[]在裡面
                setCarData( prevData  => ({
                    ...prevData ,//hooks無法部分更新,加...e為保持原先欄位
                    addGoodsData:[...prevData.addGoodsData, addGoodsData],//這樣才會留住之前的購物車內容
                    addCarGoodsID:addGoodsData.goodsID ,
                    addCarGoodsName:addGoodsData.goodsName ,
                    addCarPrice:addGoodsData.price ,
                    addCarQuantity:addGoodsData.quantity ,
                   
                }));

            // 在 API 請求結束後設定 isLoading 為 false，隱藏遮罩
            setIsLoading(false);    
                
         }
    }
    
    // 生命週期放置的位置
    useEffect(() => {
        fetchList2();
        //這邊是回傳給Ecommerce刷新購物車數量用
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    },//如果只使用ID判斷 就不能購買相同物品 如果用count&ID判斷 當換不同商品會變成觸發兩次
    [goodsVo]);// useEffect 第二個欄位為componentDidUpdate

    

    // 生命週期放置的位置
    useEffect(() => {
        //如果觸發不一樣(代表按鈕有重按過):更新搜尋文字 ->改成第一頁顯示 ->觸發更新同步為新的狀態
        if (nowToggle !== toggle) {
            setData(prevState => ({
              ...prevState,
              searchKeyword:searchInfo,
              currentPageNo: page,
              nowToggle:toggle
            }));
          }
        fetchList();
    },
    [currentPageNo,pageDataSize,searchInfo,toggle]);// useEffect 第二個欄位為componentDidUpdate

    

    return (
        <div>
         {/* 測試:{searchInfo}  <br/> */}
         {/* 頁碼:{page}  <br/> */}
         {/* 觸發前頁狀態{toggle.toString()}<br/> */}
         {/* 觸發後頁狀態{nowToggle.toString()}<br/> */}
         {/* 目前頁碼:{currentPageNo} */}
        {/* 前提條件需要 goodsDatas & genericPageable 有值才會顯示表格 */}

        {!isLogin && <div>尚未登入,只能查看商品,若要加入購物車請先登入</div>}


        { goodsDatas &&  genericPageable &&
                <div>
                <table border={'2'}>
                    <thead>
                        <tr>
                        
                            <th>商品編號</th>
                            <th>商品姓名</th> 
                            <th>商品描述</th>
                            <th>商品價格</th>
                            <th>剩餘數量</th>
                            <th>商品圖片</th>
                            <th>商品狀態</th>
                           
                            
                        </tr>
                    </thead>
                    <tbody>
                        {goodsDatas.map((item, index) => (
                        <tr key={goodsDatas.goodsID}> 
                        
                        <td>{item.goodsID}</td> 
                        <td>{item.goodsName}</td> 
                        <td>{item.description}</td> 
                        <td>{item.goodsPrice}</td> 
                        <td>{item.goodsQuantity}</td> 
                        {/* 原本這個只秀商品圖片名稱 */}
                        {/* <td>{item.goodsImageName}</td>  */}
                        <td>    
                        <img src={`http://localhost:8090/training/goodsImg/${item.goodsImageName}`} 
                        style={{ width: '200px', height: '150px' }} /></td>
                        <td>{item.goodsQuantity > 0 ? '銷售中':'暫時缺貨中'}
                            <br/>
                            {/* disabled=false才是關閉 所以要 false(有登入) || false(有庫存) 才可以加入購物車 */}
                            <button value={item.goodsID} onClick={clickAddGoods} disabled={!isLogin || !(item.goodsQuantity > 0 )}>加入購物車</button><br/>
                            商品ID:{item.goodsID}
                        </td> 
                        
                        {isLoading && (
                            <div className="overlay">
                                <img src={loadingWait} style={{ width: '300px', height: '300px' }} /><br/>
                                <br/><br/><br/><br/><br/>
                                {/* <div>加入購物車中...</div> */}
                                {/* <div className="overlay">加入購物車中...</div> */}
                                加入購物車...
                            </div>
                        )}

                        </tr>
                        ))}
                    </tbody>
                </table>
                <hr/> 
                <div>
                
                    
                    <button disabled={genericPageable.currentPageNo ==1}
                    onClick={() => clickPageStart()}>{'<<'}</button>
                    <button disabled={genericPageable.currentPageNo <2}
                    onClick={() => clickPageSub()}>{'<'}</button>
                    
                    {genericPageable.pagination.map((pageNo, index) => (
                        
                        <span key={index}>
                            
                        <button onClick={() => clickPage(pageNo)}>
                            {/* 如果為當前頁面 粗體&下底線 */}
                            {currentPageNo ===pageNo ?<b><u>{pageNo}</u></b> :pageNo}
                        </button>
                        </span>
                    ))}

                    <button disabled={genericPageable.currentPageNo >= genericPageable.endPageNo } 
                    onClick={() => clickPageAdd()}>{'>'}</button>

                    <button disabled={currentPageNo==genericPageable.endPageNo  }
                    onClick={() => clickPageEnd()}>{'>>'}</button>

                    <select onChange={changePageDataSize}>
                        <option value="">更改每頁顯示筆數</option>
                        <option value="3" selected={status === "3"}>3/page</option>
                        <option value="6" selected={status === "6"}>6/page</option>
                        <option value="9" selected={status === "9"}>9/page</option>
                    </select>    

                    共{genericPageable.dataTotalSize}件商品
                </div> 
                </div>
                }

                <hr/>
                測試用:<br/>
                carGoodsItem: {carGoodsItem}<br/>
                觸發使用:<br/>
                筆數:{addGoodsData.length}
                {/* 這個不要看 會顯示錯誤的 直接看swagger那邊的 */}
                {/* <pre>{JSON.stringify(addGoodsData, null, 2)}</pre> */}
        </div>
    )
}

export default SearchGoods;

