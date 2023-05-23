import React, { useState, useEffect,useRef } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClearCarGoods from './ClearCarGoods';
import noGoodsBk from './pic/noGoodsBk.png';

//查詢購物車商品 api
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryCartGoods';

// 功能:查詢購物車頁面
const QueryCarGoods = () => {
    const navigate = useNavigate();

    //填寫收件人資料用
    const inputRefs = useRef([]);
    const creditCardRefs = useRef([]);

    const [data, setData] = useState({
        queryGoodsData: [],
        
        //填寫信用卡用
        creditCard:'',
        effectiveDate:'',
        lastNumber:'',

        sendGoodsData:[],
        // customerResult:'',
        orderGoodsList:[],

        //結帳用的收件人資料
        customer :{ //api要傳入的資料
            cusName:'',
            homeNumber:'',
            mobileNumber:'',
            orderAddr:'',
        },
        
    });

    const { queryGoodsData,
        cusName,homeNumber,mobileNumber,orderAddr,
        creditCard,effectiveDate,lastNumber,
        sendGoodsData,
        orderGoodsList } = data;
   

    // 後端api :查詢購物車
    const fetchList = async () => {
        const queryGoodsData = await axios.get(apiUrl, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        if (queryGoodsData) { //如果存在
            setData(prevData => ({
                ...prevData,
                queryGoodsData: queryGoodsData,
            }));
        }
    };

    
    useEffect(() => {
        fetchList();
    }, []);

    const mergedData = Object.values(//Object.values 函式將 queryGoodsData 所有值取出來放入一個陣列中
        queryGoodsData.reduce((result, item) => {
            //queryGoodsData內不存在此ID 初始值為改為1 (備註:當初後端傳回來的json quantity為庫存 為了方便 直接覆蓋來使用)
            if (!result[item.goodsID]) {  
                result[item.goodsID] = { ...item, quantity: 1 };
            } else { //若此ID已經存在 代表商品數量要加1
                result[item.goodsID].quantity += 1;
            }
            return result;
        }, {})
    );
    // reduce 接受兩個參數 (total累加,item當前值),0是初始值
    const totalAmount = mergedData.reduce((total, item) => total + item.price * item.quantity, 0);

    // 更改訂購者相關資料
    const onChangeData = () => {
        setData((prevState) => ({
            ...prevState,
            // carGoodsItem: carGoodsItem,
            customer: {
                cusName:inputRefs.current[0].value,
                homeNumber:inputRefs.current[1].value,
                mobileNumber:inputRefs.current[2].value,
                orderAddr:inputRefs.current[3].value,
            },
            
            })
        ); 

    };

    // 更改信用卡資料
    const onChangeCreditCard = (index) => {
        if (index <= 3 && creditCardRefs.current[index].value.length === 4) {
          creditCardRefs.current[index + 1].focus();
        }
        if (index ==4 && creditCardRefs.current[index].value.length === 5) {
            creditCardRefs.current[index + 1].focus();
          }
        setData((prevState) => ({
            ...prevState,
            // carGoodsItem: carGoodsItem,
            creditCard:creditCardRefs.current[0].value+creditCardRefs.current[1].value+creditCardRefs.current[2].value+creditCardRefs.current[3].value,
            effectiveDate:creditCardRefs.current[4].value,
            lastNumber:creditCardRefs.current[5].value,
            })
        ); 
      };  
        
    
    // 送出訂單 導入至購買頁面CheckOutGoods 頁面 並將客戶資料傳過去
    const sendOrder = () => {
        navigate("/CheckOutGoods",{state:data});
    };

    const clearData = () => {
        setData((prevState) => ({
            ...prevState,
            queryGoodsData:[],
            })
        ); 

    };    

    return (
        <div>
            <h3>購物車商品清單</h3>
            {/* <hr /> */}

            {mergedData.length <= 0 && 
            <div>
                <h3>尚未有購物車商品 請加入商品</h3>
                <img src ={noGoodsBk} style={{ width: '300px', height: '300px' }}/>
                {/* {setTimeout(() => { */}

                {/* {navigate('/SearchGoods')} */}
                {/* }, 500);} // 延遲0.5秒後執行 API 請求 只是要展顯出畫面的效果 */}
            </div>
            }


            {mergedData.length > 0 &&
                <div>
                    <table border={'2'}>
                        <thead>
                            <tr>
                                <th>商品編號</th>
                                <th>商品圖片</th>
                                <th>商品名稱</th>
                                <th>商品價格</th>
                                <th>商品數量</th>
                                <th>商品小計</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mergedData.map((item, index) => (
                                <tr key={item.goodsID}>
                                    <td>{item.goodsID}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:8090/training/goodsImg/${item.imageName}`}
                                            style={{ width: '100px', height: '75px' }}
                                            alt="Goods Image"
                                        />
                                    </td>
                                    <td>{item.goodsName}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    結帳總額:{totalAmount}
                   <ClearCarGoods onClick={clearData}/>     

                    <hr/>
                    填寫收件人資料<br/>
                    姓名:<input type="text" ref={el => (inputRefs.current[0] = el)} onChange={onChangeData}/><br/>
                    手機號碼:<input type="text" ref={el => (inputRefs.current[1] = el)} onChange={onChangeData}/><br/>
                    連絡電話:<input type="text" ref={el => (inputRefs.current[2] = el)} onChange={onChangeData}/><br/>
                    收件地址:<input type="text" ref={el => (inputRefs.current[3] = el)} onChange={onChangeData}/><br/>

                    <hr/>     
                    填寫信用卡資料<br/>
                    信用卡號:
                    <input type="text" ref={(el) => (creditCardRefs.current[0] = el)}
                                        onChange={() => onChangeCreditCard(0)}
                                        maxLength={4} style={{ width: '55px' }} />
                    -<input type="text" ref={(el) => (creditCardRefs.current[1] = el)}
                                        onChange={() => onChangeCreditCard(1)}
                                        maxLength={4} style={{ width: '55px' }} />
                    -<input type="text" ref={(el) => (creditCardRefs.current[2] = el)}
                                        onChange={() => onChangeCreditCard(2)}
                                        maxLength={4} style={{ width: '55px' }} />
                    -<input type="text" ref={(el) => (creditCardRefs.current[3] = el)}
                                        onChange={() => onChangeCreditCard(3)}
                                        maxLength={4} style={{ width: '55px' }} />
                    {/* <input type="number" ref={el => (creditCardRefs.current[0] = el)} onBlur={onChangeCreditCard} style={{ width: '55px' }} />
                    -<input type="number" ref={el => (creditCardRefs.current[1] = el)} onBlur={onChangeCreditCard} style={{ width: '55px' }} />
                    -<input type="number" ref={el => (creditCardRefs.current[2] = el)} onBlur={onChangeCreditCard} style={{ width: '55px' }}/>
                    -<input type="number" ref={el => (creditCardRefs.current[3] = el)} onBlur={onChangeCreditCard} style={{ width: '55px' }}/> */}
                    <br/>
                    有效日期:
                    {/* ref={el => (creditCardRefs.current[4] = el)} onChange={onChangeCreditCard} */}
                    {/* <input tyep="text" ref={el => (creditCardRefs.current[4] = el)} onBlur={onChangeCreditCard} style={{ width: '80px' }} />(範例格式: 03/25)<br/> */}
                    <input tyep="text" ref={(el) => (creditCardRefs.current[4] = el)}
                                        onChange={() => onChangeCreditCard(4)}
                                        maxLength={5} style={{ width: '80px' }} />(範例格式: 03/25)<br/>
                    背面末三碼:
                    {/* <input tyep="number" ref={el => (creditCardRefs.current[5] = el)} onBlur={onChangeCreditCard} style={{ width: '80px' }}/><br/> */}
                    <input tyep="number" ref={(el) => (creditCardRefs.current[5] = el)}
                                        onChange={() => onChangeCreditCard(5)}
                                        maxLength={3} style={{ width: '80px' }}/><br/>
                    <button onClick={sendOrder} >送出訂單</button>
                    
                    
                    <hr/>            
                    這邊只是測試使用:<br/>

                    cusName:{cusName}<br/>
                    homeNumber:{homeNumber}<br/>
                    mobileNumber:{mobileNumber}<br/>
                    orderAddr:{orderAddr}<br/>

                    creditCard:{creditCard}<br/>
                    effectiveDate: {effectiveDate}<br/>
                    lastNumber:{lastNumber}<br/>
{/*                                  
                    新增內容為:<pre>{JSON.stringify(customer, null, 2)}</pre>           
                    新增內容為:<pre>{JSON.stringify(orderGoodsList, null, 2)}</pre>         */}


                </div>
            //這個不要不小心刪掉 是判斷式的尾巴 
            }

            


        </div>
    )
}

export default QueryCarGoods
