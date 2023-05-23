import React, { useState, useEffect,useRef } from 'react'
import axios from "axios";
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";

// 送出訂單(結帳購物車商品) api
const apiUrl = 'http://localhost:8090/training/ecommerce/FrontendController/checkoutGoods';
// 清空購物車 api
const apiClearCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/clearCartGoods';

// 功能:結帳購物車頁面
const CheckOutGoods = ({ carCount, updateCarCount }) => {
    const navigate = useNavigate();
    const location=useLocation();
    const data=location.state;
  
    const wantGoods=data.queryGoodsData;//想要購買的商品內容
    const mergedData = Object.values(//Object.values 函式將 queryGoodsData 所有值取出來放入一個陣列中
        wantGoods.reduce((result, item) => {
            //queryGoodsData內不存在此ID 初始值為改為1 (備註:當初後端傳回來的json quantity為庫存 為了方便 直接覆蓋來使用)
            if (!result[item.goodsID]) {  
                result[item.goodsID] = { ...item, quantity: 1 };
            } else { //若此ID已經存在 代表商品數量要加1
                result[item.goodsID].quantity += 1;
            }
            return result;
        }, {})
    );


    const [dataResult, setDataResult] = useState({
        sendGoodsData:[],
        customerResult:data.customer,//從QueryCarGoods那邊傳來的訂購者資料
        orderGoodsList:[],//放最後所有訂購商品項目
     });

     const { sendGoodsData,customerResult,orderGoodsList} = dataResult;

   // 呼叫後端api:送出訂單 & 清空購物車
   const fetchList = async() => {
    // 1.送出訂單
    const reportData = await axios.post(apiUrl,customerResult,{ withCredentials: true })
        .then(rs => rs.data)
        .catch(error => { console.log(error); });
      setDataResult( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            sendGoodsData:reportData,
            customerResult: reportData.customer, 
            orderGoodsList: reportData.orderGoodsList
        }));
        
    // 2.同時清空購物車    
    const clearGoodsData = await axios.delete(apiClearCarUrl,{ withCredentials: true })
        .then(rs => rs.data)
        .catch(error => { console.log(error); });
        //這邊是回傳給Ecommerce刷新購物車數量用 (讓上層的按鈕同時刷新)
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    };

    useEffect(() => {
      fetchList();//預先載入的就是購買者的資訊與購買商品
  }, []);

  
  const cilckGoBuy = () => {
    navigate("/SearChGoods");//導入到原本首頁頁面(只導頁不做任何動作 避免使用者沒依照這邊點選)
  };

  // reduce 接受兩個參數 (total累加,item當前值),0是初始值
  const totalAmount = orderGoodsList.reduce((total, item) => total + item.price * item.buyRealQuantity, 0);

  // 點擊繼續購物導入首頁商品
  const clickHomePage = ()  => {
    navigate("/SearchGoods");//導入到首頁
  }

  return (
    <div>
      {/* <button onClick={sendOrder} >送出訂單</button><br/> */}
      {/* 測試中: */}
      {/* customer:{data.customer} */}


      {/* 最後結帳業1
      新增內容為:<pre>{JSON.stringify(reportData.customer, null, 2)}</pre>  
      新增內容為:<pre>{JSON.stringify(reportData.orderGoodsList, null, 2)}</pre>  */}

      {/* 重複在完成結帳頁面刷新 */}
    {orderGoodsList.length <= 0  && 
     <div>你已完成購物結帳 請勿重複刷新
        <button onClick={clickHomePage}>回首頁</button>
      </div>} 



    {orderGoodsList.length > 0  &&
    <div>
      訂單確認完成:
        <div>
          <p>收件人姓名: {customerResult.cusName}</p>
          <p>手機號碼: {customerResult.mobileNumber}</p>
          <p>聯絡電話: {customerResult.homeNumber}</p>
          <p>收件地址: {customerResult.orderAddr}</p>
          <button onClick={cilckGoBuy}>繼續購物</button>
            
        </div>
      
          <table border={'2'}>
              <thead>
                  <tr>
                    <th>商品編號</th>
                    <th>商品圖片</th>
                    <th>商品名稱</th>
                    <th>商品價格</th>
                    <th>商品數量</th>
                  </tr>
              </thead>
              <tbody>
                  {orderGoodsList.map((item, index) => (
                  <tr key={item.goodsID}> 
                  
                  <td>{item.goodsID}</td> 
                  {/* <td>{item.imageName}</td>  */}
                  <td>    
                    <img src={`http://localhost:8090/training/goodsImg/${item.imageName}`} 
                    style={{ width: '200px', height: '150px' }} /></td>
                  <td>{item.goodsName}</td>
                  <td>{item.price}</td>    
                  <td>{item.buyRealQuantity}</td>    
                  
                  </tr>
                  
                  ))}
                  結帳總額:{totalAmount}
              </tbody>
              {/* 兩個陣列相互比較,orderGoodsList:最後訂單,mergedItem:購物車 來比較最後購買差異 */}
              {orderGoodsList.map((item, index) => {
                const mergedItem = mergedData[index]; // 取得相應索引的 mergedData 元素
                if (mergedItem && item.buyRealQuantity !== mergedItem.quantity) {
                  return (
                    
                    <React.Fragment key={item.goodsID}>
                      
                      <div>商品編號: {mergedItem.goodsID} 庫存不足</div>
                      <div>購買數量:原先預計({mergedItem.quantity}) / 最後實際({item.buyRealQuantity}) </div>
                      
                    </React.Fragment>
                  );
                  
                }
              })}

          </table>
                      
    </div>
        }
        
    </div>
    
  )
}

export default CheckOutGoods
