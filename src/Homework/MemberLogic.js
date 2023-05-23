import React, { useState,useRef ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';//有多import才可以使用

const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/login';

// 功能:會員登入頁面
const MemberLogic = ({isLoginData}) => {
  // 遮罩使用
  const [isLoading, setIsLoading] = useState(false);

  // const [carCount]=props;

  const navigate = useNavigate();
  const inputPdRef = useRef();

  // const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({

        // 後端api傳入使用:memberInfoVo傳api 把identificationNo&cusPassword包進去
        memberInfoVo:{ 
            identificationNo: '',
            cusPassword: '',
        },

        //回傳所需的資料 密碼不會秀出來 所以這邊不會有密碼
        idNo: '',
        cusName: '',
        isLogin:false,
        loginMessage:'',
    });

    // 解構 
    const {memberInfoVo,idNo,cusName,isLogin,loginMessage} =data ;
    const {identificationNo,cusPassword}=memberInfoVo;
    

    const changeMemberID = (event) => {
        setData((prevState) => ({
          ...prevState,
          memberInfoVo: { //兩層式的寫法
            ...prevState.memberInfoVo,
            identificationNo: event.target.value,
            // loginMessage:''
          },
        }));
        inputPdRef.current.focus(); //當滑鼠點擊其他地方時 游標跳到password那邊
      };  
      
      const changePassword = (event) => {
        setData((prevState) => ({
          ...prevState,
          memberInfoVo: {
            ...prevState.memberInfoVo,
            cusPassword: event.target.value,
            // loginMessage:'',
          },
        }));
      };  
    
    // 點擊登入按鈕  
    const clickMemberLogic = ()  => {
        fetchList();
        // setShowModal(false); 
        // setIsLoading(false);  
    
       
    }

    // 後端api
    const fetchList = async() => {
        const memberData = await axios.post(apiUrl, memberInfoVo,{ withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
            setData( e => ({
                    ...e,//hooks無法部分更新,加...e為保持原先欄位
                    idNo: memberData.identificationNo,  //這邊不會有密碼出現
                    cusName: memberData.cusName,
                    loginMessage: memberData.loginMessage,
                    isLogin: memberData.isLogin,
                }));
                 
                // //代表已經登入 導入商品頁
                // if(isLogin){ 
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    if(memberData.isLogin){
                      navigate('/SearchGoods'); //若成功登入則導頁到商品頁面
                    }
                  }, 1000); // 1秒後自動關閉
                //   // window.location = "/SearchGoods";//為了上半部重新刷新 所以故意使用這個
                //   // navigate('/SearchGoods');
                // }

                // // 尚未登入 秀出彈跳畫面視窗(錯誤結果)
                // if (!isLogin ) {
                //   setShowModal(true);
                //   navigate('/');
                // }  
    };

    useEffect(() => {
      if (isLoginData) { //當頁面已經登入又回到登入頁面時 自動帶入到商品頁面中
        navigate('/SearchGoods');
      }
      // fetchList();
      // //代表已經登入 導入商品頁
      // if(isLogin){ 
      //   // setIsLoading(true);
      //   // window.location = "/SearchGoods";//為了上半部重新刷新 所以故意使用這個
      //   navigate('/SearchGoods');
      // }

      // // 尚未登入 秀出彈跳畫面視窗(錯誤結果)
      // if (!isLogin ) {
      //   // setShowModal(true);
      //   navigate('/');
      // }  
      

    },[isLoginData,isLogin]);//當輸入帳號密碼更新 

    return (
        <div>
          測試:{isLogin.toString()}


            會員登入<br />
            <br />
              會員帳號 ID<br /> 
              {/* 使用 onBlur 避免頻繁被觸發 */}
              <input type="text" name="id" placeholder="Enter ID" required  onBlur={changeMemberID} /><br />
              會員密碼 Password<br />
              <input type="password" name="pwd" placeholder="Enter Password" required onBlur={changePassword} ref={inputPdRef}/><br />
              
              <button onClick={clickMemberLogic}>登入</button>
            
            {/* {!isLogin && <div>{loginMessage}</div>} */}

            {/* <Model>{loginMessage}</Model> */}
            {isLoading && (
                  <div className="overlay">
                    {loginMessage}
                  </div>
            )}

            {/* <Modal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              style={{
                content: {
                  width: '400px',  // 設定寬度
                  height: '300px', // 設定高度
                },
              }}
            >
              {loginMessage}
              <button onClick={() => setShowModal(false)}>關閉</button>
            </Modal> */}
            
            {/* <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                overlayClassName="modal-overlay"
                className="modal-content"
              >
                <h2>彈跳視窗</h2>
                <p>點擊任意地方以關閉視窗</p>
            </Modal> */}
            <hr/>
            
            {/* 測試用:<br/>
            idNo:{idNo}<br/>
            cusName:{cusName}<br/> */}
            {/* JSX 不能直接顯示布林值 要先轉換成String才可以直接秀出來 */}
            {/* isLogin: {String(isLogin)}<br/> 
            loginMessage:{loginMessage}<br/> */}

        </div>
    )
}

export default MemberLogic
