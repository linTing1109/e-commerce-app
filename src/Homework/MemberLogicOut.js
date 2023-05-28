import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from 'react-bootstrap/Button';

//會員登出api
const apiMemberOutUrl = 'http://localhost:8090/training/ecommerce/MemberController/logout';
//清空購物車api
const apiGoodsOutUrl2 = 'http://localhost:8090/training/ecommerce/MemberController/clearCartGoods';

// 功能:會員登出(同時也要清空購物車)
const MemberLogicOut = () => {
    const navigate = useNavigate();
  
    // 後端會員登出 api
    const fetchList = async() => {
        const memberOutData = await axios.get(apiMemberOutUrl,{ withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
            // navigate("/" );//導入到登入頁面
            window.location = "/";//為了上半部重新刷新 所以故意使用這個
    };

    // 清空購物車 api
    const fetchList2 = async () => {
      const clearGoodsData = await axios.delete(apiGoodsOutUrl2,{ withCredentials: true })
          .then(rs => rs.data)
          .catch(error => { console.log(error); });
  };
    
    
    const clickMemberLogicOut = ()  => {
        localStorage.removeItem('memberData');
        fetchList(); //登出會員
        fetchList2(); //清空購物車
    }
 
  return (
    <div>
       <Button variant="outline-danger" onClick={clickMemberLogicOut}>登出</Button>
    </div>
  )
}

export default MemberLogicOut
