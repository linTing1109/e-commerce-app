import React, { useState, useEffect } from 'react'
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

import picAsc from './pic/pic1.png';
import picDesc from './pic/pic2.png';
import picAll from './pic/pic3.png';

// 會員商品訂單列表api
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryGoodsSales';

// 加入購物車
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods';

const SalesReportMember = ({ carCount, updateCarCount }) => {
    const [cal, setCal] = useState(6);  //設定cal變數的值
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

    // 從 localStorage 中讀取會員資訊
    const memberData = localStorage.getItem('memberData');
    // 解析 JSON 字串為 JavaScript 物件
    const memberObj = JSON.parse(memberData); //使用前一定要先轉 不然會取不到值

    const [data, setData] = useState({

        // 各欄位的初始化:每頁十筆 頁碼按鈕5個 近半年~當日
        currentPageNo: 1,
        pageDataSize: 10,
        pagesIconSize: 5,
        startDate: dateSText, //預設傳入的是查詢當日~前六個月
        endDate: dateEText,//預設傳入的是查詢當日~前六個月
        orderByItem: 'orderID', //預設就是用訂單編號排
        sort: 'ASC',
        cusName: memberObj.cusName,//從登入者資訊來的

        // 判斷起訖日期順序的
        isStartDateValid: true, // 設定初始值為 true
        isEndDateValid: true, // 設定初始值為 true

        //回傳結果
        goodsReportSalesList: null, //放查詢回來的結果
        genericPageable: null,//放查詢回來相關頁碼資料使用

        // 加入商品的,
        goodsVo: { //api要傳入的資料
            goodsID: 0,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },

        //控制各欄位排序顯示圖片
        imagePicOrderID: picAsc,
        imagePicOrderDate: picAll,
        imagePicOrderCusName: picAll,
        imagePicOrderGoodID: picAll,
        imagePicOrderGoodName: picAll,
        imagePicOrderGoodPrice: picAll,
        imagePicOrderBuyQuantity: picAll,
    });

    // 解構 
    const { currentPageNo, pageDataSize, pagesIconSize, startDate, endDate, sort, orderByItem, cusName, goodsVo,
        isStartDateValid, isEndDateValid,goodsReportSalesList, genericPageable,
        imagePicOrderID, imagePicOrderDate, imagePicOrderCusName, imagePicOrderGoodID,
        imagePicOrderGoodName, imagePicOrderGoodPrice, imagePicOrderBuyQuantity } = data;

    // 變更PageDataSize
    const changePageDataSize = (even) => {
        setData(e => ({
            ...e, //hooks無法部分更新,加...e為保持原先欄位
            pageDataSize: even.target.value
        }));
    }

    // 變更PagesIconSize
    const changePagesIconSize = (even) => {
        setData(e => ({...e,//hooks無法部分更新,加...e為保持原先欄位
            pagesIconSize: even.target.value
        }));
    }

    // // 變更startDate(並且起始必須早於結束)
    const changeStartDate = (event) => {
        const newStartDate = event.target.value;
        if (newStartDate <= endDate) {
            setData((prevData) => ({
                ...prevData,
                startDate: newStartDate,
                isStartDateValid: true
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                startDate: newStartDate,
                isStartDateValid: false
            }));
        }
    };
    // 變更endDate (並且結束比需晚於起始)
    const changeEndDate = (event) => {
        const newEndDate = event.target.value;
        if (startDate <= newEndDate) {
            setData((prevData) => ({
                ...prevData,
                endDate: newEndDate,
                isEndDateValid: true
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                endDate: newEndDate,
                isEndDateValid: false
            }));
        }
    };

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

    // 日期搜尋
    const handleSubmit = async (event) => {
        event.preventDefault(); // 防止瀏灠器預設submit跳頁
        // 使用者送出開啟表單欄位驗証功能
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === true) {

            fetchList();
            setData(e => ({
                ...e,//hooks無法部分更新,加...e為保持原先欄位
                currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
                //重新搜尋 將排序預定為訂單ID並且是ASC
                sort: 'ASC',
                orderByItem: 'orderID',
                imagePicOrderID: picAsc,
                imagePicOrderDate: picAll,
                imagePicOrderCusName: picAll,
                imagePicOrderGoodID: picAll,
                imagePicOrderGoodName: picAll,
                imagePicOrderGoodPrice: picAll,
                imagePicOrderBuyQuantity: picAll,

            }));
            //成功送出的時候驗證同時就要關掉
            setValidated(false);
        }
    }


    // 各欄位排序圖片狀態顯示:(在input那邊需要搭配箭頭函式才可以使用)
    const clickSortOrder = (even) => {
        const newSort = sort === "ASC" ? "DESC" : "ASC"; // 點擊 ASC & DESC 互換
        const imageValue = sort === "ASC" ? picDesc : picAsc; // 判斷變圖
        const imagePicAll = picAll; // 原圖
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            sort: newSort,
            // 傳給後端的值:因為後端訂單編號的順序跟日期順序是一樣的 沒有額外寫date排序
            orderByItem: even.target.name === 'orderDate' ? 'orderID' : even.target.name,

            //依照排序條件動態抽換圖片
            imagePicOrderBuyQuantity: even.target.name === 'buyQuantity' ? imageValue : imagePicAll,
            imagePicOrderID: even.target.name === 'orderID' ? imageValue : imagePicAll, //even.target.name為的是要原本的觸發條件不要上面的
            imagePicOrderDate: even.target.name === 'orderDate' ? imageValue : imagePicAll,//even.target.name為的是要原本的觸發條件不要上面的
            imagePicOrderCusName: even.target.name === 'customerName' ? imageValue : imagePicAll,
            imagePicOrderGoodID: even.target.name === 'goodsID' ? imageValue : imagePicAll,
            imagePicOrderGoodName: even.target.name === 'goodsName' ? imageValue : imagePicAll,
            imagePicOrderGoodPrice: even.target.name === 'goodsBuyPrice' ? imageValue : imagePicAll,

        }));
    }

    // 後端api
    const fetchList = async () => {
        const params = {
            "currentPageNo": currentPageNo, "pageDataSize": pageDataSize, "pagesIconSize": pagesIconSize
            , "startDate": startDate, "endDate": endDate, "orderByItem": orderByItem, "sort": sort, "cusName": cusName
        };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        //判斷式原因是: 避免api傳回空值 塞值時 導致傳入有誤 進而引發畫面為空
        if (reportData && reportData.goodsReportSalesList && reportData.genericPageable) {
            setData(e => ({
                ...e,//hooks無法部分更新,加...e為保持原先欄位
                goodsReportSalesList: reportData.goodsReportSalesList,
                genericPageable: reportData.genericPageable
            }));
        } else {
            setData(e => ({
                ...e,//hooks無法部分更新,加...e為保持原先欄位
                goodsReportSalesList: '',
                genericPageable: ''
            }));
        }
    };
    // 點擊增加商品數量
    const clickaddGoodsID = (event) => {
        const newGoodsID = parseInt(event.target.value);
        setData((prevState) => ({
            ...prevState,
            goodsVo: {
                ...prevState.goodsVo,
                goodsID: newGoodsID,
            },
        }));
    };

    useEffect(() => {
        setData(e => ({ //當cal日期區間計算方式變動的時候,重算起迄
            ...e,
            startDate: dateSText,
            endDate: dateEText
        }));
        fetchList();//componentDidMount
    }, [currentPageNo, sort, orderByItem, cal, startDate, endDate]);// componentDidUpdate:頁碼,升降冪,排序方式

    // 增加商品
    useEffect(() => {
        fetchList2();
        //這邊是回傳給Ecommerce刷新購物車數量用
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    }, [goodsVo]);

    // 呼叫後端api: 加入購物車
    const fetchList2 = async () => {
        // const params =  { "goodsID": parseInt(event.target.value)};
        const addGoodsData = await axios.post(addCarUrl, goodsVo, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        if (addGoodsData) {
            fetchList(); // 更新購物車列表 刷新畫面
        }
    }

    // 呼叫本月區間
    const changeCalOne = async () => {
        setCal(1); // 將 cal 的狀態設定為 1
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
            //重新搜尋 將排序預定為訂單ID並且是ASC
            sort: 'ASC',
            orderByItem: 'orderID',
            imagePicOrderID: picAsc,
            imagePicOrderDate: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,

        }));
    }
    // 呼叫近三月區間
    const changeCalThree = async () => {
        setCal(3); // 將 cal 的狀態設定為 1
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
            //重新搜尋 將排序預定為訂單ID並且是ASC
            sort: 'ASC',
            orderByItem: 'orderID',
            imagePicOrderID: picAsc,
            imagePicOrderDate: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,

        }));
    }
    // 呼叫半年區間
    const changeCalSix = async () => {
        setCal(6); // 將 cal 的狀態設定為 6
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
            //重新搜尋 將排序預定為訂單ID並且是ASC
            sort: 'ASC',
            orderByItem: 'orderID',
            imagePicOrderID: picAsc,
            imagePicOrderDate: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,

        }));
    }
    // 呼叫一年區間
    const changeCalYear = async () => {
        setCal(12); // 將 cal 的狀態設定為 12
        setData(e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
            //重新搜尋 將排序預定為訂單ID並且是ASC
            sort: 'ASC',
            orderByItem: 'orderID',
            imagePicOrderID: picAsc,
            imagePicOrderDate: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,

        }));
    }
    return (
        <div>
            <Container fluid="sm">
                <p class="h2">訂單查詢</p>
                快速查詢:{" "}
                <Button variant="outline-primary" onClick={changeCalOne}>本月訂單</Button>{' '}
                <Button variant="outline-primary" onClick={changeCalThree}>近三月訂單</Button>{' '}
                <Button variant="outline-primary" onClick={changeCalSix}>近半年訂單</Button>{' '}
                <Button variant="outline-primary" onClick={changeCalYear}>近一年訂單</Button>{' '}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={3}>
                            <Form.Group controlId="startDate">
                                <Form.Label>查詢日期起：</Form.Label>
                                <FormControl
                                    type="date" required
                                    value={startDate}
                                    onChange={changeStartDate}
                                    isInvalid={!isStartDateValid} // 根據狀態設置 isInvalid 屬性
                                />
                                <Form.Control.Feedback type="invalid">欄位錯誤!必填 且 起始必須早於結束</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                            <Form.Group controlId="endDate">
                                <Form.Label>查詢日期迄：</Form.Label>
                                <FormControl
                                    type="date" required
                                    value={endDate}
                                    onChange={changeEndDate}
                                    isInvalid={!isEndDateValid} // 根據狀態設置 isInvalid 屬性
                                />
                                <Form.Control.Feedback type="invalid">欄位錯誤!必填 且 結束必須晚於起始</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={3}>
                            <Form.Group >
                                <Form.Label>修改每頁資料筆數(pageDataSize)</Form.Label>
                                <FormControl
                                    type="number" required
                                    min="1" value={pageDataSize}
                                    onChange={changePageDataSize}
                                />
                                <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">欄位錯誤!需必填最少為1</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                            <Form.Group >
                                <Form.Label>修改頁碼按鈕個數(pagesIconSize)</Form.Label>
                                <FormControl
                                    type="number" required
                                    min="1" value={pagesIconSize}
                                    onChange={changePagesIconSize}
                                />
                                <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">欄位錯誤!需必填最少為1</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {/* style={{ marginTop: '15px' }} 為往下的偏移量只是要對齊使用                    */}
                        <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
                            <Button variant="outline-primary" type="submit">查詢</Button>

                        </Col>
                    </Row>
                </Form>
                {genericPageable && <div>符合的日期區間總筆數:{genericPageable.dataTotalSize}</div>}
                {goodsReportSalesList == '' && <div> <p class="text-danger">此區間尚未有購買紀錄 請重新查詢</p></div>}
            </Container>


            {/* 前提條件需要 goodsReportSalesList &  genericPageable 有值才會顯示表格 */}
            {goodsReportSalesList && genericPageable &&
                <div>
                    <Container fluid="sm">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>訂單編號<img src={imagePicOrderID} onClick={(event) => clickSortOrder(event)} name='orderID' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    <th>購買日期<img src={imagePicOrderDate} onClick={(event) => clickSortOrder(event)} name='orderDate' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    {/* <th>顧客姓名<img src={imagePicOrderCusName}  onClick={(event) => clickSortOrder(event)} name='customerName' style={{ width: '25px', height: '25px',marginLeft: '10px' }}/></th> */}
                                    <th>商品編號<img src={imagePicOrderGoodID} onClick={(event) => clickSortOrder(event)} name='goodsID' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    <th>商品名稱<img src={imagePicOrderGoodName} onClick={(event) => clickSortOrder(event)} name='goodsName' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    <th>商品價格<img src={imagePicOrderGoodPrice} onClick={(event) => clickSortOrder(event)} name='goodsBuyPrice' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    <th>購買數量<img src={imagePicOrderBuyQuantity} onClick={(event) => clickSortOrder(event)} name='buyQuantity' style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    <th>好評回購</th>
                                </tr>
                            </thead>

                            <tbody>
                                {goodsReportSalesList.map((item, index) => (

                                    <tr key={item.orderID}>

                                        <td>{item.orderID}</td>
                                        <td>{new Date(item.orderDate).toLocaleString()}</td>
                                        {/* 將字串轉換成符合當地環境日期格式 */}
                                        <td>{item.goodsID}</td>
                                        <td>{item.goodsName}</td>
                                        <td>{item.goodsBuyPrice}</td>
                                        <td>{item.buyQuantity}</td>
                                        <td> 
                                            <div><Button variant={(item.quantity > 0) ? "outline-primary" : "outline-danger"}
                                            value={item.goodsID} onClick={clickaddGoodsID}
                                            disabled={!(item.quantity > 0)}>{item.quantity > 0? "再買一次" : "銷售一空"}</Button></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

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
                            </Pagination>
                        </div>
                    </Container>
                </div>
            }
            <hr />
            {/* <pre>{JSON.stringify(goodsReportSalesList, null, 2)}</pre><hr/> */}
            {/* Hooks 測試資料用:<br/>
        startDate:{startDate}<br/>
        endDate:{endDate}<br/>
        currentPageNo:{currentPageNo}<br/>
        pageDataSize:{pageDataSize}<br/>
        pagesIconSize:{pagesIconSize}<br/>
        sort:{sort}<br/>
        orderByItem:{orderByItem}<br/> */}
            {/* imagePicOrderID:<img src={imagePicOrderID}></img><br/> */}
            {/* {goodsReportSalesList} */}
        </div>
    )
}

export default SalesReportMember
