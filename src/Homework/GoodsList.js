import React, { Component } from 'react';
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

//查詢商品列表api
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsData';

// 功能:後臺商品頁面
class GoodsList extends Component {
    // 建構函式 設定初始化值
    constructor(props) {
        super(props);
        this.state = {
            //頁碼
            currentPageNo: 1,
            pageDataSize: 10,
            pagesIconSize: 5,
            //頁面輸入欄位
            goodsID: null,
            goodsName: null,
            quantity: null,
            startPrice: null,
            endPrice: null,
            status: null,
            //回傳結果
            listReport: [],
            genericPageable: [],
            goodsDatas: [],
            //排序
            orderByItem: 'goodsID', //預設就是用商品編號排 所以只有imagePicGoodID:picAsc
            sort: 'ASC',
            //各欄位圖片預設
            imagePicGoodID: picAsc,
            imagePicGoodName: picAll,
            imagePicGoodPrice: picAll,
            imagePicBuyQuantity: picAll,
            imagePicStatus: picAll,
            //驗證
            validated: false,
        };

    }

    // 呼叫後端api:查詢商品列表
    fetchList = async () => {
        const { currentPageNo, pageDataSize, pagesIconSize, goodsID, goodsName, quantity, startPrice, endPrice, status, orderByItem, sort } = this.state;

        const params = {
            'currentPageNo': currentPageNo, 'pageDataSize': pageDataSize, 'pagesIconSize': pagesIconSize, 'goodsID': goodsID, 'goodsName': goodsName,
            'quantity': quantity, 'status': status, 'startPrice': startPrice, 'endPrice': endPrice, 'orderByItem': orderByItem, 'sort': sort
        };

        const listReport = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            listReport,
            genericPageable: listReport.genericPageable,
            goodsDatas: listReport.goodsDatas,

        });
    };

    // 組件掛載:資料預先掛載 查沒有任何條件的全部商品
    componentDidMount() {
        this.fetchList();
    }

    // 組件更新: 目前頁面 單頁顯示筆數 排序方式 升降冪  (顯示頁碼數沒有寫可變 所以這邊沒有)
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPageNo !== this.state.currentPageNo) {
            this.fetchList();
        }
        if (prevState.pageDataSize !== this.state.pageDataSize) {
            this.fetchList();
        }
        if (prevState.sort !== this.state.sort) {
            this.fetchList();
        }
        if (prevState.orderByItem !== this.state.orderByItem) {
            this.fetchList();
        }
      
    }

    handleSubmit = async (event) => {
        event.preventDefault(); // 防止瀏灠器預設submit跳頁
        // 使用者送出開啟表單欄位驗証功能
        this.setState({
            validated: true
        })
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            this.setState({
                currentPageNo: 1  //重新按查詢會從第一頁開始顯示
            })
            this.fetchList();
        }
    }

    onChangePageDataSize = (even) => {
        this.setState({
            pageDataSize: even.target.value,
            currentPageNo: 1//避免已經選到後面頁面導致畫面有空資料
        })
    };


    onChangeGoodsID = (even) => {
        this.setState({
            goodsID: even.target.value
        })
    };

    onChangeGoodsName = (even) => {
        this.setState({
            goodsName: even.target.value
        })
    };

    onChangeStartPrice = (even) => {
        this.setState({
            startPrice: even.target.value
        })
    };


    onChangeEndPrice = (even) => {
        this.setState({
            endPrice: even.target.value
        })
    };

    onChangePriceSort = (even) => {
        this.setState({
            sort: even.target.value
        })
    };

    onChangeQuantity = (even) => {
        this.setState({
            quantity: even.target.value
        })
    };

    onChangeStatus = (even) => {
        const { value } = even.target;
        const status = value === "" ? null : value; //要有這段 不然傳入數值會是"" 打到後端會找不到
        this.setState({ status });
    };

    // 每個頁面上的點擊
    onClickPage = (pageNo) => {
        this.setState({
            currentPageNo: pageNo
        });
    }

    // 下一頁點擊
    onClickPageAdd = () => {
        this.setState({
            currentPageNo: this.state.currentPageNo + 1
        });
    }

    // 前一頁點擊
    onClickPageSub = () => {
        this.setState({
            currentPageNo: this.state.currentPageNo - 1
        });
    }

    // 最首頁點擊
    onClickPageStart = () => {
        this.setState({
            currentPageNo: 1
        });
    }

    // 最末頁點擊
    onClickPageEnd = () => {
        this.setState({
            currentPageNo: this.state.genericPageable.endPageNo
        });
    }

    // 各欄位排序圖片狀態顯示:(在input那邊需要搭配箭頭函式才可以使用)
    onClickSort = (event, orderByItem) => {
        const { sort } = this.state;
        const newSort = sort === "ASC" ? "DESC" : "ASC"; // 點擊 ASC & DESC 互換
        const imageValue = sort === "ASC" ? picDesc : picAsc; // 判斷變圖
        const imagePicAll = picAll; // 原圖

        this.setState({
            sort: newSort,
            orderByItem: orderByItem, // 將排序條件更換 (這樣畫面值才會更新到)
            imagePicGoodID: orderByItem === 'goodsID' ? imageValue : imagePicAll,
            imagePicGoodName: orderByItem === 'goodsName' ? imageValue : imagePicAll,
            imagePicGoodPrice: orderByItem === 'goodsPrice' ? imageValue : imagePicAll,
            imagePicBuyQuantity: orderByItem === 'goodsQuantity' ? imageValue : imagePicAll,
            imagePicStatus: orderByItem === 'status' ? imageValue : imagePicAll,
        });
    }

    render() {
        const { goodsID, goodsName, quantity, startPrice, endPrice, status, genericPageable, goodsDatas, currentPageNo, sort,
            imagePicGoodID, imagePicGoodName, imagePicGoodPrice, imagePicBuyQuantity, imagePicStatus, validated } = this.state;

        return (
            <div>
                <Container fluid="sm">
                    <p class="h2">商品列表</p>

                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品編號:</Form.Label>
                                    <FormControl
                                        type="number" min="1"
                                        placeholder="Enter Goods Number" value={goodsID} onChange={this.onChangeGoodsID}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!編號從1開始</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品名稱(不區分大小寫):</Form.Label>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter Goods Name" value={goodsName} onChange={this.onChangeGoodsName}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品價格最低價:</Form.Label>
                                    <FormControl
                                        type="number" min="0"
                                        placeholder="Enter goods price Min" value={startPrice} onChange={this.onChangeStartPrice}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!價格最低為0</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品價格最高價:</Form.Label>
                                    <FormControl
                                        type="number" min="1"
                                        placeholder="Enter goods price Max" value={endPrice} onChange={this.onChangeEndPrice}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!價格最低為1</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品低於庫存量:</Form.Label>
                                    <FormControl
                                        type="number" min="0"
                                        placeholder="Enter goods stock quantity" value={quantity} onChange={this.onChangeQuantity}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!庫存最低為0</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Form.Label>商品狀態:</Form.Label>
                                    <FormControl
                                        as="select"
                                        defaultValue={sort} onChange={this.onChangeStatus}>
                                        <option value="">ALL</option>
                                        <option value="1">上架</option>
                                        <option value="0">下架</option>
                                    </FormControl>
                                </Form.Group>
                            </Col>

                            <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
                                <Button variant="outline-primary" type="submit">查詢</Button>
                            </Col>
                        </Row>
                    </Form>
                    目前排序為:{sort}
                </Container>


                {goodsDatas && genericPageable &&
                    <div>
                        <Container fluid="sm">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>商品編號<img src={imagePicGoodID} onClick={(event) => this.onClickSort(event, 'goodsID')} style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                        <th>商品名稱<img src={imagePicGoodName} onClick={(event) => this.onClickSort(event, 'goodsName')} style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                        <th>商品價格<img src={imagePicGoodPrice} onClick={(event) => this.onClickSort(event, 'goodsPrice')} style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                        <th>現有庫存<img src={imagePicBuyQuantity} onClick={(event) => this.onClickSort(event, 'goodsQuantity')} style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                        <th>商品狀態<img src={imagePicStatus} onClick={(event) => this.onClickSort(event, 'status')} style={{ width: '25px', height: '25px', marginLeft: '10px' }} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goodsDatas.map((item, index) => (
                                        <tr key={item.goodsID}>
                                            <td>{item.goodsID}</td>
                                            <td>{item.goodsName}</td>
                                            <td>{item.goodsPrice}</td>
                                            <td>{item.goodsQuantity}</td>
                                            <td>{item.status == '1' ? '上架' : '下架'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Pagination>
                                    <Pagination.First disabled={genericPageable.currentPageNo == 1}
                                        onClick={() => this.onClickPageStart()}></Pagination.First>

                                    <Pagination.Prev disabled={genericPageable.currentPageNo < 2}
                                        onClick={() => this.onClickPageSub()}></Pagination.Prev>

                                    {genericPageable.pagination && genericPageable.pagination.map((pageNo, index) => (
                                        <Pagination.Item onClick={() => this.onClickPage(pageNo)}
                                            active={currentPageNo === pageNo}>{pageNo}
                                        </Pagination.Item>
                                    ))}

                                    <Pagination.Next disabled={genericPageable.currentPageNo >= genericPageable.endPageNo}
                                        onClick={() => this.onClickPageAdd()}></Pagination.Next>

                                    <Pagination.Last disabled={currentPageNo == genericPageable.endPageNo}
                                        onClick={() => this.onClickPageEnd()}></Pagination.Last>


                                    <Form.Group style={{ marginRight: '10px' }}>

                                        <FormControl
                                            as="select" onChange={this.onChangePageDataSize}>
                                            <option value="" disabled selected>更改每頁顯示筆數</option>
                                            <option value="3" selected={status === "3"}>3/page</option>
                                            <option value="6" selected={status === "6"}>6/page</option>
                                            <option value="9" selected={status === "9"}>9/page</option>
                                        </FormControl>
                                    </Form.Group>
                                    <p class="text-primary" style={{ margin: '5px' }}>共{genericPageable.dataTotalSize}件商品</p>

                                </Pagination>
                            </div>
                        </Container>
                    </div>
                }
                <hr />
                {/* 下面是拿來看測試資料的
                <pre>{JSON.stringify(listReport, null, 2)}</pre>
                {genericPageable.pagination} */}
            </div>


        );
    }
}

export default GoodsList;