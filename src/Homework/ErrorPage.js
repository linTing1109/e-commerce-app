import React from 'react'
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const ErrorPage = () => {
    const navigate = useNavigate();

    // 在 5 秒後導頁
    setTimeout(() => {
        navigate("/SearchGoods");
    }, 15000);

    const clickHomePage = () => {
        navigate("/SearchGoods");//導入到首頁

    }

    return (
        <div>
            <p class="text-danger h3">操作錯誤，頁面不存在!<br />
                請點擊下方按鈕 或系統將於15秒後回首頁!</p>
            <Button variant="outline-primary" onClick={clickHomePage}>回首頁</Button>
        </div>
    )
}

export default ErrorPage
