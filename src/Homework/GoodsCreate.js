import React, { Component } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const apiAddGoodsUrl = 'http://localhost:8090/training/ecommerce/BackendController/createGoods';

// 功能:新增商品頁面
class GoodsCreate extends Component {

    // 建構函式 設定初始化值
    constructor(props) {
        super(props);
        this.state = {

            // 後端api傳入使用:
            goodsName: '',
            description: '',
            price: '',
            quantity: '',
            status: '1', //預設上架
            fileName: '',

            goodsID: '',
            createReport: null,
            // 輸入欄位驗證
            validated: false,
            // 遮罩使用
            isLoading: false,
            // 初始化 navigate 狀態
            navigate: ''
        };
        this.fileInputRef = React.createRef(); // 建立對 input 元素的參考 (用來圖片檔那選擇)
    }

    handleSubmit = async (event) => {
        // 防止瀏灠器預設submit跳頁
        event.preventDefault();
        // 解構欄位
        const { goodsName, description, price, quantity, imageName, fileName, status } = this.state;

        this.setState({
            validated: true
        });

        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            const uploadFile = form.uploadFile.files[0];

            const formData = new FormData();
            formData.append('imageName', fileName);
            formData.append('goodsName', goodsName);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('status', status);
            formData.append('file', uploadFile);

            const createReport = await axios.post(apiAddGoodsUrl, formData)
                .then(rs => rs.data)
                .catch(error => { console.log("error:", error); })

            this.setState({
                createReport,
                goodsID: createReport.goodsID,  //得到上架商品ID
                //送出商品後 驗證關閉 所有欄位清空
                validated: false,
                goodsName: '',
                description: '',
                price: '',
                quantity: '',
                fileName: '',
                isLoading: true,

            });
            this.fileInputRef.current.value = ''; //將原本選擇的圖片也清空 避免刷新已經有圖檔了
            if (createReport.goodsID > 0) {
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        navigate: '/GoodsCreate' // 只是又回到自己的頁面來而已
                    });
                }, 3000);
            }

        }
    };

    onChangeGoodName = (even) => {
        this.setState({
            goodsName: even.target.value
        });
    }

    onChangeDescription = (even) => {
        this.setState({
            description: even.target.value
        });
    }

    onChangePrice = (even) => {
        this.setState({
            price: even.target.value
        });
    }

    onChangeQuantity = (even) => {
        this.setState({
            quantity: even.target.value
        });
    }

    onChangeRadio = (even) => {
        this.setState({
            status: even.target.value
        })
    };

    onChangeImg = (event) => {
        // 取得圖片名稱
        this.setState({
            fileName: event.target.files[0].name
        });
    };

    render() {
        const { goodsName, description, price, quantity, imageName, fileName, status, createReport, validated, isLoading } = this.state;

        return (
            <div>
                <Container fluid="sm">
                    <p class="h2">商品新增上架</p>
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>商品名稱:</Form.Label>
                                    <FormControl
                                        type="text"
                                        value={goodsName} placeholder="Enter Goods Name" required onChange={this.onChangeGoodName}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                                <Form.Group >
                                    <Form.Label>商品描述(選填):</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={description} rows="3" placeholder="Enter Goods description" onChange={this.onChangeDescription}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>商品價格:</Form.Label>
                                    <FormControl
                                        type="number"
                                        value={price} placeholder="Enter Goods price" required onChange={this.onChangePrice} min={0}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!商品價格最低為0</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>初始數量:</Form.Label>
                                    <FormControl
                                        type="number"
                                        value={quantity} placeholder="Enter Goods quantity" required onChange={this.onChangeQuantity} min={0}
                                    />
                                    <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">欄位錯誤!初始數量最低為0</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>商品狀態:</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        id="radio1"
                                        label="上架"
                                        value="1"
                                        checked={status === '1'}
                                        onChange={this.onChangeRadio}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="radio2"
                                        label="下架"
                                        value="0"
                                        checked={status === '0'}
                                        onChange={this.onChangeRadio}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>圖片上傳:</Form.Label>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input ref={this.fileInputRef} name="uploadFile" onChange={this.onChangeImg} required />
                                        <Form.File.Label data-browse="選擇圖片">
                                            {fileName ? fileName : '選擇要上傳的檔案...'}
                                        </Form.File.Label>
                                        <Form.Control.Feedback type="valid">已選擇檔案!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">未選擇檔案!</Form.Control.Feedback>
                                    </Form.File>
                                </Form.Group>
                            </Col>
                            <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
                                <Button variant="outline-primary" type="submit" >新增</Button>
                            </Col>

                        </Row>

                    </Form>
                </Container>
                {/* 利用三元判斷式 成功新增才秀出下面資訊 否則為空 */}
                {isLoading && createReport != null ? (
                    <div className="overlay">

                        <p class="text-danger" style={{ fontSize: '30px' }}>
                            新增成功，商品號碼為:{this.state.goodsID}
                            <br />
                            <img src={`http://localhost:8090/training/goodsImg/${createReport.goodsImageName}`}
                                style={{ width: '200px', height: '150px' }} />
                        </p>
                    </div>
                ) : null}
            </div>

        );
    }
}

export default GoodsCreate;