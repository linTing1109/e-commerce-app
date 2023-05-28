import React, { useState, useEffect } from 'react'
import axios from "axios";

// 購物車api
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods'

const CarGoodsPage = ({ data }) => {
    const { carGoodsItem, carGoodsCount } = data;
    const [carData, setCarData] = useState({
        goodsVo: { //api要傳入的資料
            goodsID: carGoodsItem,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },
        addGoodsData: [],
        addCarGoodsID: '',
        addCarGoodsName: '',
        addCarPrice: '',
        addCarQuantity: '',
        addCarDescription: '',
        addCarStatus: '',

        updateCondition1: false,
        updateCondition2: false,
    });
    // 解構
    const { goodsVo, addGoodsData, goodsID, updateCondition1, updateCondition2 } = carData;


    // 後端api (加入購物車)
    const fetchList2 = async () => {
        console.log("下層-fetchList");
        console.log("下層-fetchList-前-goodsVo", goodsVo);
        const addGoodsData = await axios.post(addCarUrl, goodsVo)
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        if (addGoodsData != '') { //addGoodsData不為空才setData不然會有很多空[]在裡面
            setCarData(prevData => ({
                ...prevData,//hooks無法部分更新,加...e為保持原先欄位
                addGoodsData: [...prevData.addGoodsData, addGoodsData],//這樣才會留住之前的購物車內容
                addCarGoodsID: addGoodsData.goodsID,
                addCarGoodsName: addGoodsData.goodsName,
                addCarPrice: addGoodsData.price,
                addCarQuantity: addGoodsData.quantity,
                
            }));
        }
        console.log("下層-fetchList-後-goodsVo", goodsVo);
    };


    useEffect(() => {
        setCarData((prevState) => ({
            ...prevState,
            carGoodsItem: carGoodsItem,
            goodsVo: {
                //   ...prevState.goodsVo,
                goodsID: carGoodsItem,
            },
            updateCondition1: prevState.carGoodsCount != carGoodsCount ? true : false,
            updateCondition2: prevState.goodsID != goodsID ? true : false,
        })
        );
        console.log("下層-useEffect-後-carGoodsItem", carGoodsItem);
        console.log("下層-useEffect-後-goodsID", goodsVo.goodsID);
        fetchList2();
    },// useEffect 第二個欄位為componentDidUpdate
        //因為是異步 所以最後更新goodsID 而不是使用carGoodsItem(會少一步)
        //,carGoodsCount,goodsVo.goodsID
        // [carGoodsCount]);// 只使用carGoodsCount 畫面更新資料會少一筆
        // [carGoodsCount,goodsVo.goodsID]);// 不同按鈕的時候會多一筆 上一筆舊資料
        [carGoodsCount, carGoodsItem]);// 


    return (
        <div>
            {addGoodsData &&
                <div>
                    <table border={'2'}>
                        <thead>
                            <tr>
                                <th>商品編號</th>
                                <th>商品名稱</th>
                                <th>商品價格</th>
                                <th>商品圖片</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addGoodsData.map((goodsGroup, index) => (
                                // 第一層迴圈: 購物車的各項商品
                                goodsGroup.map((item) => (
                                    // 每個購物車細項資料
                                    <tr key={item.goodsID}>
                                        <td>{item.goodsID}</td>
                                        <td>{item.goodsName}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:8090/training/goodsImg/${item.imageName}`}
                                                style={{ width: '100px', height: '75px' }}
                                                alt="Goods Image"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>

                </div>
            }
            <pre>{JSON.stringify(addGoodsData, null, 2)}</pre>
        </div>
    )
}

export default CarGoodsPage
