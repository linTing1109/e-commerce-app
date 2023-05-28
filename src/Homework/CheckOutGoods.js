import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col } from 'react-bootstrap';

// 送出訂單(結帳購物車商品) api
const apiUrl = 'http://localhost:8090/training/ecommerce/FrontendController/checkoutGoods';
// 清空購物車 api
const apiClearCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/clearCartGoods';



// 功能:結帳購物車頁面
const CheckOutGoods = ({ carCount, updateCarCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const wantGoods = data.queryGoodsData;//想要購買的商品內容
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
    sendGoodsData: [],
    customerResult: data.customer,//從QueryCarGoods那邊傳來的訂購者資料
    orderGoodsList: [],//放最後所有訂購商品項目
  });

  const { sendGoodsData, customerResult, orderGoodsList } = dataResult;

  // 呼叫後端api:送出訂單 & 清空購物車
  const fetchList = async () => {
    // 1.送出訂單
    const reportData = await axios.post(apiUrl, customerResult, { withCredentials: true })
      .then(rs => rs.data)
      .catch(error => { console.log(error); });
    setDataResult(e => ({
      ...e,//hooks無法部分更新,加...e為保持原先欄位
      sendGoodsData: reportData,
      customerResult: reportData.customer,
      orderGoodsList: reportData.orderGoodsList
    }));

    // 2.同時清空購物車    
    const clearGoodsData = await axios.delete(apiClearCarUrl, { withCredentials: true })
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
  const clickHomePage = () => {
    navigate("/SearchGoods");//導入到首頁
  }
  // orderGoodsList為結帳後的商品訂單 為了跟購物車比較 需要先把結帳後的由商品訂單小到大
  const sortedOrderGoodsList = orderGoodsList.sort((a, b) => a.goodsID - b.goodsID);
  return (
    <div>
      <Container fluid="sm">
       
        {/* 重複在完成結帳頁面不斷刷新 */}
        {orderGoodsList.length <= 0 &&
          <div>
            <p class="text-danger">你已完成購物結帳 請勿重複刷新</p>
            <Button variant="outline-secondary" onClick={clickHomePage}>回首頁</Button>
          </div>}



        {orderGoodsList.length > 0 &&
          <div>
            <p class="text-dark">訂單確認完成:</p>
            <p class="text-primary">收件人姓名: {customerResult.cusName}</p>
            <p class="text-primary">手機號碼: {customerResult.mobileNumber}</p>
            <p class="text-primary">聯絡電話: {customerResult.homeNumber}</p>
            <p class="text-primary">收件地址: {customerResult.orderAddr}</p>
            <Button variant="outline-secondary" onClick={cilckGoBuy}>繼續購物</Button>

            <Table bordered hover>
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
                    <td>
                      <img src={`http://localhost:8090/training/goodsImg/${item.imageName}`}
                        style={{ width: '200px', height: '150px' }} /></td>
                    <td>{item.goodsName}</td>
                    <td>{item.price}</td>
                    <td>{item.buyRealQuantity}</td>

                  </tr>

                ))}

                <p class="text-dark"> 結帳總額:{totalAmount}</p>
              </tbody>
              {/* 兩個陣列相互比較,orderGoodsList:最後訂單,mergedItem:購物車 來比較最後購買差異 */}
              {/* 這裡使用的不是orderGoodsList,而是sortedOrderGoodsList(是orderGoodsList重新商品由小到大排序)
              這樣在跟購物車的數量比較的時候 每一個順序的項目才是對的 才可以比較 */}
              {sortedOrderGoodsList.map((item, index) => {
                const mergedItem = mergedData[index]; // 取得相應索引的 mergedData 元素
                if (mergedItem && item.buyRealQuantity !== mergedItem.quantity) {
                  return (

                    <React.Fragment key={item.goodsID}>
                      <p class="text-danger">商品編號: {mergedItem.goodsID} 庫存不足</p>
                      <p class="text-danger">購買數量:原先預計({mergedItem.quantity}) / 最後實際({item.buyRealQuantity})</p>
                    </React.Fragment>
                  );

                }
              })}

            </Table>
          </div>
        }
      </Container>
      {/* <pre>{JSON.stringify(orderGoodsList, null, 2)}</pre><hr/>
      <pre>{JSON.stringify(mergedData, null, 2)}</pre> */}
    </div>

  )
}

export default CheckOutGoods
