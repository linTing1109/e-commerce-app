import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

//功能:輸入搜尋文字使用
const SearchName = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        // 各欄位的初始化
        searchName:'',//搜尋內容
        page:1,//當今頁面
        toggle:true,//觸發
      });

      const {searchName,toggle} =data ;
    
    // 頁面標頭的商品搜尋
    const changeSearchGoodsName = (event) => {
        setData((prevState) => ({
        ...prevState,
        searchName: event.target.value,
        }));
    };  

    // 送出搜尋
    const clickSearchName = (event) => {
        setData((prevState) => ({
            ...prevState,
            toggle:!toggle, //當每次點擊按鈕的時候會 true <->false 互換
            // page:1,
            // count:count+1,
            }));
        navigate("/SearchGoods",{state:data}); //將data內容傳入至SearchGoods
    };  

    return (
        <div>

            <input type="text" onBlur={changeSearchGoodsName} placeholder='搜尋商品名稱'/>
            <button onClick={clickSearchName}>搜尋</button>
            <br/>
            {/* 測試中:{searchName} */}
        </div>
    )
}

export default SearchName

