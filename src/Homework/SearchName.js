import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

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
            <FormControl
            type="text" placeholder="搜尋商品名稱" 
            onBlur={changeSearchGoodsName} // 使用 onBlur 避免頻繁被觸發
            style={{ marginRight: '10px'}} // 添加右侧外边距   
            />
            <Button variant="outline-secondary" onClick={clickSearchName}>搜尋</Button>
           
        </div>
    )
}

export default SearchName

