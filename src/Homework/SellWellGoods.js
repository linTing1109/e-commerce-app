import React, { useState,useEffect } from 'react';
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck';
import 'bootstrap/dist/css/bootstrap.css';

import loadingWait from './pic/loadingWait.gif';

// 前台商品熱銷表 api
const apiUrl = 'http://localhost:8090/training/ecommerce/FrontendController/sellWellGoods';
// 加入購物車
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods';

const SellWellGoods = ({ carCount, updateCarCount}) => {
    // 加入購物車的遮罩設定:避免連續點擊導致畫面無法同步更新
    const [isLoading, setIsLoading] = useState(false);

    const [cal,setCal]=useState(6);  //設定cal變數的值
    // 這邊原本是cal=6寫的註解 是使用當日日期換算 六個月前的資料:
    const date = new Date();//取得當天日期
    const month = date.getMonth() + 1;//因為起始月:0開始 所以+1
    const endMonth = month < 10 ? `0${month}` : month; //當日月份:需判斷是否有0的
    const startMonth = month - cal < 1 ? month - cal + 12 : month - cal;//上半年月份:需判斷是否跨年
    const dateStartMonth = startMonth < 10 ? `0${startMonth}` : startMonth;//當日日期:需判斷是否有0的
    const startYear = month - cal < 1 ? date.getFullYear() - 1 : date.getFullYear();//上半年年份:需判斷是否跨年
    const endYear = date.getFullYear();//當日年份不需要變動
    // 這邊是在判斷起始的日期 跟實際月份該月份最後一天比較 ex:date.getDate():2/29 該2023/02/28是最後一天 那就是2/28
    const nowStartday = Math.min(date.getDate(), new Date(startYear, dateStartMonth, 0).getDate());
    const nowEndday = date.getDate();
    
    const dateSDay = nowStartday < 10 ? `0${nowStartday}` : nowStartday;
    const dateEDay = nowEndday < 10 ? `0${nowEndday}` : nowEndday;
    const dateSText = `${startYear}-${dateStartMonth}-${dateSDay}`;//組成開始的日期
    const dateEText = `${endYear}-${endMonth}-${dateEDay}`;//組成結束的日期

    //驗證用
    const [validated, setValidated] = useState(false);

    const [data, setData] = useState({
        // 各欄位的初始化:
        startDate:dateSText, //預設傳入的是查詢當日~前六個月
        endDate:dateEText,//預設傳入的是查詢當日~前六個月

        // 判斷起訖日期順序的
        isStartDateValid: true, // 設定初始值為 true
        isEndDateValid: true, // 設定初始值為 true

        reportData:null,
    });

     //購物車的初始化
     const [carData, setCarData] = useState({
        goodsVo :{ //api要傳入的資料
            goodsID: 0,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },
        carGoodsItem:0,//購物車傳值
        
        addGoodsData:[],
        addCarGoodsID:'',
        addCarGoodsName:'',
        addCarPrice:'',
        addCarQuantity:'',
        addCarDescription:'',
        addCarStatus:'',
    });

    // 解構 
    const {startDate,endDate,isStartDateValid,isEndDateValid,reportData} =data ;

    const{goodsVo,carGoodsItem,addGoodsData,addCarGoodsID}=carData;  

    const fetchList = async () => {
        const params = { "startDate": startDate, "endDate": endDate };
        const reportData = await axios.get(apiUrl, { params })
          .then(rs => {
            setData(e => ({
              ...e,
              reportData: rs.data
            }));
          })

      };
      
      // 呼叫本月區間
      const changeCalOne = async () => {
        setCal(1); // 將 cal 的狀態設定為 1
      }
      // 呼叫本月區間
      const changeCalThree = async () => {
        setCal(3); // 將 cal 的狀態設定為 3
      }
      // 呼叫半年區間
      const changeCalSix = async () => {
        setCal(6); // 將 cal 的狀態設定為 6
      }
      // 呼叫一年區間
      const changeCalYear = async () => {
        setCal(12); // 將 cal 的狀態設定為 12
      }
      
      useEffect(() => {
        setData(e => ({ //當cal日期區間計算方式變動的時候,重算起迄
            ...e,
            startDate: dateSText,
            endDate: dateEText
          }));
        fetchList();
      }, [cal, startDate, endDate]);


    // 點擊加入購物車 
    const clickAddGoods = async(event) => {
       
        setIsLoading(true);  // 在 API 請求之前設定 isLoading 為 true，顯示遮罩 (不能放API那這樣會一直開著)
        setTimeout(() => {
            const newGoodsID = parseInt(event.target.value); //需要注意傳入的是數字型態
            console.log("newGoodsID",newGoodsID);
            setCarData((prevState) => ({
            ...prevState,
            carGoodsItem: newGoodsID,
            goodsVo: {
                ...prevState.goodsVo,
                goodsID: newGoodsID,
            },
            
            }));

        }, 500); // 延遲0.5秒後執行 API 請求 只是要展顯出畫面的效果
        
    };
    // 呼叫後端api: 加入購物車
    const fetchList2 = async() => {
        const addGoodsData = await axios.post(addCarUrl, goodsVo,{ withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

            if(addGoodsData != '' ){ //addGoodsData不為空才setData不然會有很多空[]在裡面
                setCarData( prevData  => ({
                    ...prevData ,//hooks無法部分更新,加...e為保持原先欄位
                    addGoodsData:[...prevData.addGoodsData, addGoodsData],//這樣才會留住之前的購物車內容
                    addCarGoodsID:addGoodsData.goodsID ,
                    addCarGoodsName:addGoodsData.goodsName ,
                    addCarPrice:addGoodsData.price ,
                    addCarQuantity:addGoodsData.quantity ,
                   
                }));

            // 在 API 請求結束後設定 isLoading 為 false，隱藏遮罩
            setIsLoading(false);    
                
         }
    }
    
    // 生命週期放置的位置
    useEffect(() => {
        fetchList2();
        //這邊是回傳給Ecommerce刷新購物車數量用
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    },//如果只使用ID判斷 就不能購買相同物品 如果用count&ID判斷 當換不同商品會變成觸發兩次
    [goodsVo]);// useEffect 第二個欄位為componentDidUpdate

    

  return (
    <div>
        <Container fluid="sm">
            <p class="h2">熱銷商品</p>
            <p class="h5">只顯示上架商品，目前銷售排行統計:  {startDate}~{endDate}</p>
            {/* <p class="text-primary">目前銷售排行統計:  {startDate}~{endDate}</p> */}
            <Button variant="outline-primary"  onClick={changeCalOne}>本月銷售排行</Button>{' '}
            <Button variant="outline-primary"  onClick={changeCalThree}>近三月銷售排行</Button>{' '}
            <Button variant="outline-primary"  onClick={changeCalSix}>近半年銷售排行</Button>{' '}
            <Button variant="outline-primary"  onClick={changeCalYear}>近一年銷售排行</Button>{' '}
            { reportData && <div>
                <CardDeck>
                        {reportData.slice(0, 3).map((item, index) => (
                            <Card key={index}>
                            <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.imageName}`} />
                            <Card.Body>
                                <Card.Title>
                                    <p class="text-danger">熱銷排名:No.{index+1}</p>
                                    {item.goodsName}<br />${item.price}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Card.Text>剩餘數量:{item.quantity}/總銷售:{item.total}</Card.Text>
                                <Button
                                    variant= {item.quantity > 0 ? "primary" :"danger"} onClick={clickAddGoods}
                                    value={item.goodsID} disabled={!(item.quantity > 0)}>
                                    {item.quantity > 0 ? <>商品編號:{item.goodsID} 加入購物車</> :"銷售一空!"}
                                    </Button> 
                            </Card.Body>
                            </Card>
                        ))}
                </CardDeck>
                <CardDeck>
                        {reportData.slice(3, 6).map((item, index) => (
                            <Card key={index}>
                            <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.imageName}`} />
                            <Card.Body>
                                <Card.Title><p class="text-danger">熱銷排名:No.{index+4}</p>{item.goodsName}<br />${item.price}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Card.Text>剩餘數量:{item.quantity}/總銷售:{item.total}</Card.Text>
                                <Button
                                    variant= {item.quantity > 0 ? "primary" :"danger"} onClick={clickAddGoods}
                                    value={item.goodsID} disabled={!(item.quantity > 0)}>
                                    {item.quantity > 0 ? <>商品編號:{item.goodsID} 加入購物車</> :"銷售一空!"}
                                    </Button> 
                            </Card.Body>
                            </Card>
                        ))}
                </CardDeck>
                <CardDeck>
                        {reportData.slice(6, 10).map((item, index) => (
                            <Card key={index}>
                            <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.imageName}`} />
                            <Card.Body>
                                <Card.Title><p class="text-danger">熱銷排名:No.{index+7}</p>{item.goodsName}<br />${item.price}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Card.Text>剩餘數量:{item.quantity}/總銷售:{item.total}</Card.Text>
                                <Button
                                    variant= {item.quantity > 0 ? "primary" :"danger"} onClick={clickAddGoods}
                                    value={item.goodsID} disabled={!(item.quantity > 0)}>
                                   {item.quantity > 0 ? <>商品編號:{item.goodsID} 加入購物車</> :"銷售一空!"}
                                    </Button> 
                            </Card.Body>
                            </Card>
                        ))}
                </CardDeck>
            </div>}
        </Container>

        {isLoading && (
                            <div className="overlay">
                                <img src={loadingWait} style={{ width: '300px', height: '300px' }} /><br/>
                                <br/><br/><br/><br/><br/>
                                加入購物車...
                            </div>
                        )}                    
       {/* 測試結果:<pre>{JSON.stringify(reportData, null, 2)}</pre> */}
    </div>
  )
}

export default SellWellGoods
