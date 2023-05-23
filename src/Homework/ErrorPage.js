import React from 'react'
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    // 在 5 秒後導頁
    setTimeout(() => {
        navigate("/SearchGoods");
    }, 15000);

    const clickHomePage = ()  => {
        navigate("/SearchGoods");//導入到首頁

        // navigate(window.location.pathname);
        //  window.location="/SearchGoods";
        //  window.location = "/SearchGoods";//為了上半部重新刷新 所以故意使用這個
    }

    return (
        <div>
            操作錯誤，頁面不存在!<br/>
            請點擊下方按鈕 或系統將於15秒後回首頁!<br/>
        <button onClick={clickHomePage}>回首頁</button>
        </div>
    )
}

export default ErrorPage
