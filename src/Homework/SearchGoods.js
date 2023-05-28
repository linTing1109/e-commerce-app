import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck';
import Carousels from './Carousels';

import './SearchGoods.css';
import 'bootstrap/dist/css/bootstrap.css';
import loadingWait from './pic/loadingWait.gif';

// 前台商品列表與搜尋api
const apiUrl = 'http://localhost:8090/training/ecommerce/FrontendController/queryGoodsData';
// 加入購物車
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods';

// 功能說明:秀出全部商品 與 使用關鍵字查詢 顯示符合的商品頁面
const SearchGoods = ({ carCount, updateCarCount, isLogin }) => {

    // 加入購物車的遮罩設定:避免連續點擊導致畫面無法同步更新
    const [isLoading, setIsLoading] = useState(false);

    // useLocation接收navigate導頁傳入而來的資料
    // location.state?.xxxx 來確保null不會觸發錯誤 (不加 走登入完成進來的SearchGoods會錯 因為都還沒有任何動作) 
    // ex:searchName不會拋錯 會顯示空(因為有可能都還沒點擊 會是null)
    const location = useLocation();
    const searchInfo = location.state?.searchName;// 商品搜尋內容
    const page = location.state?.page; //page設定固定是1(給每次點擊都傳入第一頁)
    const toggle = location.state?.toggle;//觸發使用

    const navigate = useNavigate();


    //各欄位的初始化
    const [data, setData] = useState({
        //輸入的資訊
        currentPageNo: 1,
        pageDataSize: 6,
        pagesIconSize: 5,
        searchKeyword: searchInfo,

        //api回傳的資訊
        goodsDatas: null,
        genericPageable: null,

        goodsID: '',
        goodsName: '',
        description: '',
        goodsPrice: '',
        goodsQuantity: '',
        goodsImageName: '',
        status: '',

        nowToggle: toggle,//判斷是否是重新點擊搜尋按鈕使用
    });


    //購物車的初始化
    const [carData, setCarData] = useState({
        goodsVo: { //api要傳入的資料
            goodsID: 0,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },
        carGoodsItem: 0,//購物車傳值
        addGoodsData: [],
        addCarGoodsID: '',
        addCarGoodsName: '',
        addCarPrice: '',
        addCarQuantity: '',
        addCarDescription: '',
        addCarStatus: '',
    });


    // 解構 
    const { currentPageNo, pageDataSize, pagesIconSize, status,
        goodsDatas, genericPageable, nowToggle } = data;

    const { goodsVo } = carData;

    // 最首頁點擊
    const clickPageStart = (even) => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1
        }));
    }

    // 最末頁點擊
    const clickPageEnd = (even) => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: genericPageable.endPageNo
        }));
    }

    // 前一頁點擊
    const clickPageSub = (even) => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo - 1
        }));
    }

    // 下一頁點擊
    const clickPageAdd = () => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo + 1
        }));
    }

    // 每個頁面上的點擊
    const clickPage = (pageNo) => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: pageNo
        }));
    }

    // 更改每頁資料顯示筆數
    const changePageDataSize = (even) => {
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            pageDataSize: even.target.value,
            //避免已經選到後面頁面導致畫面有空資料
            currentPageNo: 1
        }));
    }

    // 呼叫後端api:前台商品列表與搜尋
    const fetchList = async () => {
        // 這邊參數用nowSearch原因: 因為值進來每次就會塞好
        const params = { "currentPageNo": currentPageNo, "pageDataSize": pageDataSize, "pagesIconSize": pagesIconSize, "searchKeyword": searchInfo };
        const queryGoodsData = await axios.get(apiUrl, { params }, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setData(e => ({

            ...e,//hooks無法部分更新,加...e為保持原先欄位
            goodsDatas: queryGoodsData.goodsDatas,
            genericPageable: queryGoodsData.genericPageable,
        }));
    };


    // 點擊加入購物車 
    const clickAddGoods = async (event) => {

        setIsLoading(true);  // 在 API 請求之前設定 isLoading 為 true，顯示遮罩 (不能放API那這樣會一直開著)
        setTimeout(() => {
            const newGoodsID = parseInt(event.target.value); //需要注意傳入的是數字型態
            console.log("newGoodsID", newGoodsID);
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
    const fetchList2 = async () => {
        const addGoodsData = await axios.post(addCarUrl, goodsVo, { withCredentials: true })
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
            setIsLoading(false);// 在 API 請求結束後設定 isLoading 為 false，隱藏遮罩
        }
    }


    useEffect(() => {
        fetchList2();
        //這邊是回傳給Ecommerce刷新購物車數量用
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    }, [goodsVo]);// 如果只使用ID判斷 就不能購買相同物品 如果用count&ID判斷 當換不同商品會變成觸發兩次


    useEffect(() => {
        //如果觸發不一樣(代表按鈕有重按過):更新搜尋文字 ->改成第一頁顯示 ->觸發更新同步為新的狀態
        if (nowToggle !== toggle) {
            setData(prevState => ({
                ...prevState,
                searchKeyword: searchInfo,
                currentPageNo: page,
                nowToggle: toggle
            }));
        }
        fetchList();
    }, [currentPageNo, pageDataSize, searchInfo, toggle]);// useEffect 第二個欄位為componentDidUpdate



    return (
        <div>
            {/* 這個是輪播 */}
            <Carousels />
            <hr />
            <Container fluid="sm" style={{ width: '70%' }}>
                {!isLogin && <div><p class="text-info">尚未登入,只能查看商品,若要加入購物車請先登入</p></div>}

                {goodsDatas && genericPageable &&
                    <div>
                        <CardDeck>
                            {goodsDatas.slice(0, 3).map((item, index) => (
                                <Card key={index}>
                                    <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.goodsImageName}`} />
                                    <Card.Body>
                                        <Card.Title>{item.goodsName}<br />${item.goodsPrice}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Card.Text>剩餘數量:{item.goodsQuantity}</Card.Text>
                                        <Button
                                            variant={item.goodsQuantity > 0 ? "primary" : "danger"}
                                            value={item.goodsID}
                                            onClick={clickAddGoods}
                                            disabled={!isLogin || !(item.goodsQuantity > 0)}>
                                            {item.goodsQuantity > 0 ? "加入購物車" : "銷售一空!"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </CardDeck>
                        <CardDeck>
                            {goodsDatas.slice(3, 6).map((item, index) => (
                                <Card key={index}>
                                    <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.goodsImageName}`} />
                                    <Card.Body>
                                        <Card.Title>{item.goodsName}<br />${item.goodsPrice}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Card.Text>剩餘數量:{item.goodsQuantity}</Card.Text>
                                        <Button
                                            variant={item.goodsQuantity > 0 ? "primary" : "danger"}
                                            value={item.goodsID}
                                            onClick={clickAddGoods}
                                            disabled={!isLogin || !(item.goodsQuantity > 0)}>
                                            {item.goodsQuantity > 0 ? "加入購物車" : "銷售一空!"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </CardDeck>
                        <CardDeck>
                            {goodsDatas.slice(6, 9).map((item, index) => (
                                <Card key={index}>
                                    <Card.Img variant="top" src={`http://localhost:8090/training/goodsImg/${item.goodsImageName}`} />
                                    <Card.Body>
                                        <Card.Title>{item.goodsName}<br />${item.goodsPrice}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Card.Text>剩餘數量:{item.goodsQuantity}</Card.Text>
                                        <Button
                                            variant={item.goodsQuantity > 0 ? "primary" : "danger"}
                                            value={item.goodsID}
                                            onClick={clickAddGoods}
                                            disabled={!isLogin || !(item.goodsQuantity > 0)}>
                                            {item.goodsQuantity > 0 ? "加入購物車" : "銷售一空!"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </CardDeck>
                        <hr />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Pagination>
                                <Pagination.First disabled={genericPageable.currentPageNo == 1}
                                    onClick={() => clickPageStart()}></Pagination.First>

                                <Pagination.Prev disabled={genericPageable.currentPageNo < 2}
                                    onClick={() => clickPageSub()}></Pagination.Prev>

                                {genericPageable.pagination.map((pageNo, index) => (
                                    <Pagination.Item onClick={() => clickPage(pageNo)}
                                        active={currentPageNo === pageNo}>{pageNo}
                                    </Pagination.Item>
                                ))}

                                <Pagination.Next disabled={genericPageable.currentPageNo >= genericPageable.endPageNo}
                                    onClick={() => clickPageAdd()}></Pagination.Next>

                                <Pagination.Last disabled={currentPageNo == genericPageable.endPageNo}
                                    onClick={() => clickPageEnd()}></Pagination.Last>

                                <Form.Group style={{ marginRight: '10px' }}>

                                    <FormControl
                                        as="select" onChange={changePageDataSize}>
                                        <option value="" disabled selected>更改每頁顯示筆數</option>
                                        <option value="3" selected={status === "3"}>3/page</option>
                                        <option value="6" selected={status === "6"}>6/page</option>
                                        <option value="9" selected={status === "9"}>9/page</option>
                                    </FormControl>
                                </Form.Group>
                                <p class="text-primary" style={{ margin: '5px' }}>共{genericPageable.dataTotalSize}件商品</p>


                            </Pagination>
                        </div>
                    </div>
                }

                <hr />
                {isLoading && (
                    <div className="overlay">
                        <img src={loadingWait} style={{ width: '300px', height: '300px' }} /><br />
                        <br /><br /><br /><br /><br />
                        加入購物車...
                    </div>
                )}
                {/* 測試用:<br/>
                carGoodsItem: {carGoodsItem}<br/>
                觸發使用:<br/>
                筆數:{addGoodsData.length} */}
                {/* 測試:{searchInfo}  <br/> */}
                {/* 頁碼:{page}  <br/> */}
                {/* 觸發前頁狀態{toggle.toString()}<br/> */}
                {/* 觸發後頁狀態{nowToggle.toString()}<br/> */}
                {/* 目前頁碼:{currentPageNo} */}
                {/* 前提條件需要 goodsDatas & genericPageable 有值才會顯示表格 */}
            </Container>
        </div>
    )
}

export default SearchGoods;