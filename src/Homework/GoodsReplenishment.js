import React, { Component } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


//查詢全部商品清單
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryAllGoods';
//單一商品清單(維護使用)
const apiUrl2 = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsByID';
//更新商品
const apiUrl3 = 'http://localhost:8090/training/ecommerce/BackendController/updateGoods';

// 功能:商品維護補貨(先查後台的全部商品 ->查個別商品 ->更新商品)
class GoodsReplenishment extends Component {

    // 建構函式 設定初始化值
    constructor(props) {
        super(props);
        this.state = {

            goodsData: [], // 全部商品
            goods: [],//單一商品資訊
            reviseReport: [],//修改後的資料

            goodsName: '',
            description: '',
            price: '',
            quantity: '',
            status: '1',
            fileName: '',
            fileNameNew: '',
            goodQuantity: '',
            goodsID: '',
            addQuantity: '',
            // 遮罩使用
            isLoading: false,
            //驗證用
            validated: false,
        };

    }
    // 組件掛載:將全部商品資料預先載入
    componentDidMount() {
        this.fetchGoodsAllList();
        // this.fetchGoods();

    }

    // 全部商品列表api
    fetchGoodsAllList = async () => {
        const data = await fetch(apiUrl).then(rs => rs.json());
        this.setState({
            goodsData: data,
            goodsID: data[0].goodsID, //預設第一筆為預設資料
            goodsName: data[0].goodsName,
            description: data[0].description,
            price: data[0].goodsPrice,
            quantity: data[0].goodsQuantity,
            status: data[0].status,
            fileName: data[0].goodsImageName,
            isLoading: false,
        });

    }

    //選擇項目時 更新goodID 並呼叫單一商品api
    onChangeSelect = (even) => {
        this.setState({
            goodsID: even.target.value

        });
        this.fetchGoods();
    }

    // 單一商品api
    fetchGoods = async () => {
        const params = { "goodsID": this.state.goodsID };
        const goodData = await axios.get(apiUrl2, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({ //將商品更新內容
            goodsName: goodData.goodsName,
            description: goodData.description,
            price: goodData.goodsPrice,
            quantity: goodData.goodsQuantity,
            status: goodData.status,
            fileName: goodData.goodsImageName,
        });

    };

    onChangeGoodName = (even) => {
        this.setState({
            goodsName: even.target.value
        });
    }

    onChangeDescription = (even) => {
        this.setState({ description: even.target.value });
    }

    onChangePrice = (even) => {
        this.setState({ price: even.target.value });
    }

    onChangeAddQuantity = (even) => {
        this.setState({ addQuantity: even.target.value });
    }

    onChangeRadio = (e) => {
        this.setState({ status: e.target.value })
    };

    onChangeImg = (event) => {
        // 取得圖片名稱
        this.setState({ fileNameNew: event.target.files[0].name });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.goodsID !== this.state.goodsID) { //只要不等於代表有更換選擇項目 就重新取得單一商品內容
            this.fetchGoods();
        }
    }

    handleSubmit = async (event) => {
        const { goodsID, goodsName, description, price, addQuantity, status, fileNameNew, validated } = this.state;
        // 防止瀏灠器預設submit跳頁
        event.preventDefault();
        this.setState({
            validated: true
        });
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            const uploadFile = form.uploadFile.files[0];
            const formData = new FormData();
            formData.append('goodsID', goodsID);
            formData.append('goodsName', goodsName);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('status', status);
            formData.append('imageName', fileNameNew);

            { addQuantity != '' ? formData.append('quantity', addQuantity) : formData.append('quantity', 0) }//有可能沒有要補數
            { fileNameNew != '' && formData.append('file', uploadFile) }//沒有新的檔案名稱 代表沒有更新檔案

            const reviseReport = await axios.post(apiUrl3, formData)
                .then(rs => rs.data)
                .catch(error => { console.log("error:", error); })

            this.setState({
                reviseReport,//更新後的資訊
                goodsID: reviseReport.goodsID,
                addQuantity: '', //更新完成後必須將要補貨的欄位清空
                isLoading: true,
            });

            if (reviseReport != null) {
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        // navigate: '/GoodsCreate' // 只是又回到自己的頁面來而已
                    });
                }, 1000);
            }
            // 驗證完成 更新後 將驗證的紅色綠色狀態關閉
            this.setState({
                validated: false
            });
        }
        //刷新商品顯示
        this.fetchGoods();
    };

    render() {
        const { goodsData, goodsName, description, price, quantity, fileName, status, goodsID, goods,
            addQuantity, reviseReport, fileNameNew, isLoading, validated } = this.state;

        return (
            <div>
                <Container fluid="sm">
                    <p class="h2">商品維護補貨</p>
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>商品列表:</Form.Label>
                                <Col sm={6}>
                                    <FormControl
                                        as="select"
                                        onChange={this.onChangeSelect}>
                                        {
                                            goodsData.map((o) => <option key={o.goodsID} value={o.goodsID}>
                                                <div>編號:{o.goodsID} /{o.goodsName}</div>
                                            </option>)
                                        }
                                    </FormControl>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>商品名稱:</Form.Label>
                                <Col sm={9}>
                                    <FormControl
                                        type="text" value={goodsName} placeholder="Enter Goods Name" required onChange={this.onChangeGoodName}
                                    />
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group >
                            <Form.Row>
                                <Form.Label column sm={1}>商品描述(選填):</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        as="textarea"
                                        value={description} rows="3" placeholder="Enter Goods description" onChange={this.onChangeDescription}
                                    />
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>商品價格:</Form.Label>
                                <Col sm={3}>
                                    <FormControl
                                        type="number" min={1} value={price} placeholder="Enter Goods price" required onChange={this.onChangePrice}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!商品價格最低為1</Form.Control.Feedback>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>庫存數量:</Form.Label>
                                <Col sm={3}>
                                    <Form.Label column sm={3}>{quantity}  </Form.Label>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>補貨數量:</Form.Label>
                                <Col sm={3}>
                                    <FormControl
                                        type="number" min={0} value={addQuantity} placeholder="Enter Add Quantity" onChange={this.onChangeAddQuantity}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!補貨數量最低為0</Form.Control.Feedback>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column sm={1}>原始檔案:(縮圖)</Form.Label>
                                <Col sm={3}>
                                    <Form.Label column sm={11}>
                                        {fileName}<br />
                                        <img src={`http://localhost:8090/training/goodsImg/${fileName}`}
                                            style={{ width: '200px', height: '150px' }} />
                                    </Form.Label>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group >
                            <Form.Row>
                                <Form.Label column sm={1}>圖片修改:</Form.Label>
                                <Col sm={5}>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input name='uploadFile' onChange={this.onChangeImg} />
                                        <Form.File.Label data-browse="選擇圖片">
                                            {fileNameNew ? fileNameNew : '選擇要上傳的檔案...'}
                                        </Form.File.Label>
                                    </Form.File>
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Form.Group >
                            <Form.Row>
                                <Form.Label column sm={1}>商品狀態:</Form.Label>
                                <Col sm={3}>
                                    <Form.Check
                                        type="radio"
                                        id="radio1"
                                        label="上架"
                                        value="1"
                                        checked={status == '1'}
                                        onChange={this.onChangeRadio}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="radio2"
                                        label="下架"
                                        value="0"
                                        checked={status == '0'}
                                        onChange={this.onChangeRadio}
                                    />
                                </Col>
                            </Form.Row>
                        </Form.Group>

                        <Button variant="outline-primary" type="submit" >修改</Button>
                    </Form>
                </Container>
                <hr />

                {isLoading && reviseReport.length != 0 ? (
                    <div className="overlay">

                        <p class="text-danger" style={{ fontSize: '30px' }}>
                            商品號碼:{goodsID}  更新成功!
                            <br />
                            {/* <img src={`http://localhost:8090/training/goodsImg/${createReport.goodsImageName}`} 
                    style={{ width: '200px', height: '150px' }} /> */}
                        </p>
                    </div>
                ) : null}



                {/* 利用三元判斷式 成功新增才秀出下面資訊 否則為空 */}
                {/* { reviseReport.length !=0 ? 
                    <div>
                    商品編號:{goodsID}更新成功!<br/>
                    修改後的內容為:<pre>{JSON.stringify(reviseReport, null, 2)}</pre>   
                    </div>  :null
                }         */}

                {/* { reviseReport.length} */}
                {/* 下面只是測試再用的<br/>
                {goodsID}<br/>
                
                單一商品資訊:{goods}<br/>
                庫存數量:{quantity}<br/> */}


            </div>

        );
    }
}

export default GoodsReplenishment;