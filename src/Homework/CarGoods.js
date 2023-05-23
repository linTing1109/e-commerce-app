import React, { useState, useEffect,useRef } from 'react'
import axios from "axios";

//查詢購物車商品
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryCartGoods';

//單純搜尋購物車數量  現在這邊還沒完成

const CarGoods = () => {
    const [data, setData] = useState({
        queryGoodsData: [],
        
    });

    const { queryGoodsData } = data;

    // 後端api
    const fetchList = async () => {
        const queryGoodsData = await axios.get(apiUrl, { withCredentials: true })
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
        fetchList();
    }, []);


    return (
        <div>
            {/* 筆數:{queryGoodsData.length} */}
        <button>
            購物車
            {/* 如果購物車有內容顯示筆數 */}
            {queryGoodsData && queryGoodsData.length}
        </button>
        </div>
    )
}

export default CarGoods
