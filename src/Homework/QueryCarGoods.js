import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClearCarGoods from './ClearCarGoods';
import noGoodsBk from './pic/noGoodsBk.png';

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';


//查詢購物車商品 api
const apiUrl = 'http://localhost:8090/training/ecommerce/MemberController/queryCartGoods';

///刪除單一(全部)商品購物車
const apiDelUrl = 'http://localhost:8090/training/ecommerce/MemberController/delOneGoodsCart';

// 加入購物車
const addCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/addCartGoods';

// 減少單一商品購物車
const subCarUrl = 'http://localhost:8090/training/ecommerce/MemberController/reduceOneGoodsCart';

// 功能:查詢購物車頁面
const QueryCarGoods = ({ carCount, updateCarCount }) => {
    const navigate = useNavigate();
    // 輸入欄位驗證
    const [validated, setValidated] = useState(false);

    //填寫收件人資料用
    const inputRefs = useRef([]);
    const creditCardRefs = useRef([]);

    const [data, setData] = useState({
        queryGoodsData: [],

        //填寫信用卡用
        creditCard: '',
        effectiveDate: '',
        lastNumber: '',

        sendGoodsData: [],
        // customerResult:'',
        orderGoodsList: [],

        //結帳用的收件人資料
        customer: { //api要傳入的資料
            cusName: '',
            homeNumber: '',
            mobileNumber: '',
            orderAddr: '',
        },
        // 為什麼要分三個原因:避免相同 只要變動一個全部連動 都用後端的goodVo就不用建多個
        // 加入商品的,
        goodsVo: { //api要傳入的資料
            goodsID: 0,//goodsID:carGoodsItem useState初始化 carGoodsItem值尚未被設定 所以不能直接用 要透過useEffect
        },
        // 減少商品的
        goodsVo2: { 
            goodsID: 0,
        },
        // 減少同一個商品的
        goodsVoAll: {
            goodsID: 0,
        },
    });

    const { queryGoodsData, goodsVo, goodsVo2, goodsVoAll } = data;


    // 後端api :查詢購物車
    const fetchList = async () => {
        const queryGoodsData = await axios.get(apiUrl, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        if (queryGoodsData) { //如果存在
            setData(prevData => ({
                ...prevData,
                queryGoodsData: queryGoodsData,
            }));
        }
    };

    //查詢商品
    useEffect(() => {
        fetchList();
    }, []);

    // 減少單一相同商品
    useEffect(() => {
        fetchList4();
        //這邊是回傳給Ecommerce刷新購物車數量用
        const newCarCount = carCount + 1;
        updateCarCount(newCarCount);
    }, [goodsVoAll]);

    const mergedData = Object.values(//Object.values 函式將 queryGoodsData 所有值取出來放入一個陣列中
        queryGoodsData.reduce((result, item) => {
            //queryGoodsData內不存在此ID 初始值為改為1 (備註:當初後端傳回來的json quantity為庫存 為了方便 直接覆蓋來使用)
            if (!result[item.goodsID]) {
                result[item.goodsID] = { ...item, quantity: 1 };
            } else { //若此ID已經存在 代表商品數量要加1
                result[item.goodsID].quantity += 1;
            }
            return result;
        }, {})
    );

    // reduce 接受兩個參數 (total累加,item當前值),0是初始值
    const totalAmount = mergedData.reduce((total, item) => total + item.price * item.quantity, 0);

    // 更改訂購者相關資料
    const onChangeData = () => {
        setData((prevState) => ({
            ...prevState,
            customer: {
                cusName: inputRefs.current[0].value,
                homeNumber: inputRefs.current[1].value,
                mobileNumber: inputRefs.current[2].value,
                orderAddr: inputRefs.current[3].value,
            },

        })
        );

    };

    // 更改信用卡資料
    const onChangeCreditCard = (index) => {
        if (index <= 3 && creditCardRefs.current[index].value.length === 4) {
            creditCardRefs.current[index + 1].focus();
        }
        if (index == 4 && creditCardRefs.current[index].value.length === 5) {
            creditCardRefs.current[index + 1].focus();
        }
        setData((prevState) => ({
            ...prevState,
            // carGoodsItem: carGoodsItem,
            creditCard: creditCardRefs.current[0].value + creditCardRefs.current[1].value + creditCardRefs.current[2].value + creditCardRefs.current[3].value,
            effectiveDate: creditCardRefs.current[4].value,
            lastNumber: creditCardRefs.current[5].value,
        })
        );
    };


    // 送出訂單 導入至購買頁面CheckOutGoods 頁面 並將客戶資料傳過去
    const handleSubmit = (event) => {
        event.preventDefault(); // 防止瀏灠器預設submit跳頁
        // 使用者送出開啟表單欄位驗証功能
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            navigate("/CheckOutGoods", { state: data });
        }

    };

    const clearData = () => {
        setData((prevState) => ({
            ...prevState,
            queryGoodsData: [],
        })
        );
    };

    // 點擊增加商品數量
    const clickaddGoodsID = async (event) => {
        // 直接把抓到的值放入使用 避免異步更新
        const addGoodsData = await axios.post(addCarUrl, { ...goodsVo, goodsID: parseInt(event.target.value) }, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        if (addGoodsData) {
            fetchList(); // 更新購物車列表 刷新畫面
            const newCarCount = carCount + 1;
            updateCarCount(newCarCount);
        }

    };

    // 點擊減少商品數量
    const clicksubGoodsID = async (event) => {
         // 直接把抓到的值放入使用 避免異步更新
        const addGoodsData = await axios.post(subCarUrl, { ...goodsVo2, goodsID: parseInt(event.target.value) }, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        if (addGoodsData) {
            fetchList(); // 更新購物車列表 刷新畫面
            const newCarCount = carCount + 1;
            updateCarCount(newCarCount);
        }
    };

    // 點擊減少相同商品數量
    const clickDelGoodsID = (event) => {
        const newGoodsID = parseInt(event.target.value);
        setData((prevState) => ({
            ...prevState,
            goodsVoAll: {
                ...prevState.goodsVo,
                goodsID: newGoodsID,
            },
        }));
    };
    // 刪除全部同商品的
    const fetchList4 = async () => {
        const delOneGoodsData = await axios.post(apiDelUrl, goodsVoAll, { withCredentials: true })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        if (delOneGoodsData) {
            fetchList(); // 更新購物車列表 刷新畫面
        }
    }


    return (
        <div>

            <Container fluid="sm">
                <p class="h2">購物車商品清單</p>
                {/* <hr /> */}

                {mergedData.length <= 0 &&
                    <div>
                        <h3>尚未有購物車商品 請加入商品</h3>
                        <img src={noGoodsBk} style={{ width: '300px', height: '300px' }} />
                    </div>
                }


                {mergedData.length > 0 &&
                    <div>

                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>商品編號</th>
                                    <th>商品圖片</th>
                                    <th>商品名稱</th>
                                    <th>商品價格</th>
                                    <th>商品數量</th>
                                    <th>商品小計</th>
                                    <th>商品調整</th>
                                    <th>刪除商品</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mergedData.map((item, index) => (


                                    <tr key={item.goodsID}>
                                        <td>{item.goodsID}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:8090/training/goodsImg/${item.imageName}`}
                                                style={{ width: '100px', height: '75px' }}
                                                alt="Goods Image"
                                            />
                                        </td>
                                        <td>{item.goodsName}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price * item.quantity}</td>
                                        <td>
                                            <Button variant="outline-primary" value={item.goodsID} onClick={clickaddGoodsID}>+</Button>{' '}
                                            <Button variant="outline-primary" value={item.goodsID} onClick={clicksubGoodsID}>-</Button>

                                        </td>
                                        <td><Button variant="outline-danger" value={item.goodsID} onClick={clickDelGoodsID}>刪除</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p class="text-dark">結帳總額:{totalAmount}</p>

                        <ClearCarGoods onClick={clearData} />

                        <hr />

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <p class="text-primary">填寫收件人資料</p>
                            <Row>
                                <Col xs={4}>
                                    <Form.Group >
                                        <Form.Label>姓名:</Form.Label>
                                        <Form.Control col={3}
                                            type="text" required
                                            ref={el => (inputRefs.current[0] = el)} onChange={onChangeData} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={4}>
                                    <Form.Group >
                                        <Form.Label>手機號碼:</Form.Label>
                                        <Form.Control col={3} required minLength={10} maxLength={10}
                                            type="text" ref={el => (inputRefs.current[1] = el)} onChange={onChangeData} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={4}>
                                    <Form.Group >
                                        <Form.Label>連絡電話:</Form.Label>
                                        <Form.Control col={3} required
                                            type="text" ref={el => (inputRefs.current[2] = el)} onChange={onChangeData} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group >
                                        <Form.Label>收件地址:</Form.Label>
                                        <Form.Control col={3} required
                                            type="text" ref={el => (inputRefs.current[3] = el)} onChange={onChangeData} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <p class="text-primary">填寫信用卡資料</p>
                            <Row>
                                <Col xs={2}>
                                    <Form.Group >
                                        <Form.Label>信用卡卡號</Form.Label>
                                        <Form.Control
                                            type="text" ref={(el) => (creditCardRefs.current[0] = el)}
                                            onChange={() => onChangeCreditCard(0)} required
                                            minLength={4} maxLength={4} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={2} >
                                    <Form.Group >

                                        <Form.Control
                                            type="password" ref={(el) => (creditCardRefs.current[1] = el)}
                                            onChange={() => onChangeCreditCard(1)} required
                                            minLength={4} maxLength={4} style={{ marginTop: '2rem' }} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group >

                                        <Form.Control
                                            type="password" ref={(el) => (creditCardRefs.current[2] = el)}
                                            onChange={() => onChangeCreditCard(2)} required
                                            minLength={4} maxLength={4} style={{ marginTop: '2rem' }} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group >

                                        <Form.Control
                                            type="text" ref={(el) => (creditCardRefs.current[3] = el)}
                                            onChange={() => onChangeCreditCard(3)} required
                                            minLength={4} maxLength={4} style={{ marginTop: '2rem' }} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <Form.Group >
                                        <Form.Label>有效日期:(範例格式: 03/25)</Form.Label>
                                        <Form.Control
                                            type="text" ref={(el) => (creditCardRefs.current[4] = el)}
                                            onChange={() => onChangeCreditCard(4)} required
                                            minLength={5} maxLength={5} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={4}>
                                    <Form.Group >
                                        <Form.Label>驗證碼末三碼:</Form.Label>
                                        <Form.Control
                                            type="text" ref={(el) => (creditCardRefs.current[5] = el)}
                                            onChange={() => onChangeCreditCard(5)} required
                                            minLength={3} maxLength={3} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <hr />
                            </Row>
                            <Row>
                                <Col xs={3}>
                                    <Button variant="primary" type="submit">送出訂單</Button>
                                </Col>
                            </Row>
                        </Form>
                        <hr />
                        {/* 這邊只是測試使用:<br/>

                    cusName:{cusName}<br/>
                    homeNumber:{homeNumber}<br/>
                    mobileNumber:{mobileNumber}<br/>
                    orderAddr:{orderAddr}<br/>

                    creditCard:{creditCard}<br/>
                    effectiveDate: {effectiveDate}<br/>
                    lastNumber:{lastNumber}<br/> */}
                        {/*                                  
                    新增內容為:<pre>{JSON.stringify(customer, null, 2)}</pre>           
                    新增內容為:<pre>{JSON.stringify(orderGoodsList, null, 2)}</pre>         */}


                    </div>
                //這個不要不小心刪掉 是判斷式的尾巴 
                }



            </Container>
        </div>
    )
}

export default QueryCarGoods
