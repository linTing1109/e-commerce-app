import React, { useState, useEffect,useRef ,setData } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

//清空購物車
const apiClearCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/clearCartGoods';

const ClearCarGoods = () => {

    const navigate = useNavigate();

    // 後端api:清空購物車
    const fetchList = async () => {
        const clearGoodsData = await axios.delete(apiClearCarUrl,{ withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
            navigate("/SearchGoods");//導回到購買頁面
        
    };

    const clearCartGoods = () => {
        fetchList();
    };

    return (
        <div>
            <button onClick={clearCartGoods}>清空購物車</button>    
        </div>
    )
}

export default ClearCarGoods
