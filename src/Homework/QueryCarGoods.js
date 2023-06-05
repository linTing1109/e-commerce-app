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

const area_data = {
    '臺北市': [
        '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
    ],
    '新北市': [
        '板橋區', '新莊區', '泰山區', '林口區', '淡水區', '金山區', '八里區', '萬里區', '石門區', '三芝區', '瑞芳區', '汐止區', '平溪區', '貢寮區', '雙溪區', '深坑區', '石碇區', '新店區', '坪林區', '烏來區', '中和區', '永和區', '土城區', '三峽區', '樹林區', '鶯歌區', '三重區', '蘆洲區', '五股區'
    ],
    '基隆市': [
        '仁愛區', '中正區', '信義區', '中山區', '安樂區', '暖暖區', '七堵區'
    ],
    '桃園市': [
        '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '龜山區', '龍潭區', '大溪區', '大園區', '觀音區', '新屋區', '復興區'
    ],
    '新竹縣': [
        '竹北市', '竹東鎮', '新埔鎮', '關西鎮', '峨眉鄉', '寶山鄉', '北埔鄉', '橫山鄉', '芎林鄉', '湖口鄉', '新豐鄉', '尖石鄉', '五峰鄉'
    ],
    '新竹市': [
        '東區', '北區', '香山區'
    ],
    '苗栗縣': [
        '苗栗市', '通霄鎮', '苑裡鎮', '竹南鎮', '頭份鎮', '後龍鎮', '卓蘭鎮', '西湖鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '造橋鄉', '三灣鄉', '南庄鄉', '大湖鄉', '獅潭鄉', '泰安鄉'
    ],
    '臺中市': [
        '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '東勢區', '石岡區', '新社區', '和平區', '神岡區', '潭子區', '大雅區', '大肚區', '龍井區', '沙鹿區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'
    ],
    '南投縣': [
        '南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'
    ],
    '彰化縣': [
        '彰化市', '員林鎮', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'
    ],
    '雲林縣': [
        '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '莿桐鄉', '林內鄉', '古坑鄉', '大埤鄉', '崙背鄉', '二崙鄉', '麥寮鄉', '臺西鄉', '東勢鄉', '褒忠鄉', '四湖鄉', '口湖鄉', '水林鄉', '元長鄉'
    ],
    '嘉義縣': [
        '太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'
    ],
    '嘉義市': [
        '東區', '西區'
    ],
    '臺南市': [
        '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'
    ],
    '高雄市': [
        '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區', '新興區', '苓雅區', '前鎮區', '小港區', '旗津區', '鳳山區', '大寮區', '鳥松區', '林園區', '仁武區', '大樹區', '大社區', '岡山區', '路竹區', '橋頭區', '梓官區', '彌陀區', '永安區', '燕巢區', '田寮區', '阿蓮區', '茄萣區', '湖內區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '茂林區', '桃源區', '那瑪夏區'
    ],
    '屏東縣': [
        '屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉', '三地門鄉'
    ],
    '宜蘭縣': [
        '宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'
    ],
    '花蓮縣': [
        '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '秀林鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '富里鄉', '卓溪鄉'
    ],
    '臺東縣': [
        '臺東市', '成功鎮', '關山鎮', '長濱鄉', '海端鄉', '池上鄉', '東河鄉', '鹿野鄉', '延平鄉', '卑南鄉', '金峰鄉', '大武鄉', '達仁鄉', '綠島鄉', '蘭嶼鄉', '太麻里鄉'
    ],
    '澎湖縣': [
        '馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'
    ],
    '金門縣': [
        '金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'
    ],
    '連江縣': [
        '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
    ]
}



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
    //這邊為撰寫地址使用
    const [selectedCity, setSelectedCity] = useState('');//選擇的縣市
    const [selectedDistrict, setSelectedDistrict] = useState('');//選擇的區域
    const [districts, setDistricts] = useState([]);
    const [orderAddr, setOrderAddr] = useState('');
    //當選擇縣市的時候
    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        setDistricts(area_data[city] || []);
    };
    //當選擇區域的時候
    const handleDistrictChange = (event) => {
        const district = event.target.value;
        setSelectedDistrict(district);
        setOrderAddr(`${selectedCity} ${district}`);
      };


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
        const orderAddr=inputRefs.current[3].value;
        setData((prevState) => ({
            ...prevState,
            customer: {
                cusName: inputRefs.current[0].value,
                homeNumber: inputRefs.current[1].value,
                mobileNumber: inputRefs.current[2].value,
                //將縣市區域跟其他地址合併起來在orderAddr內
                orderAddr: `${selectedCity}${selectedDistrict}${orderAddr}`,
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

                                {/* <Col xs={12}>
                                    <Form.Group >
                                        <Form.Label>收件地址:</Form.Label>
                                        <Form.Control col={3} required
                                            type="text" ref={el => (inputRefs.current[3] = el)} onChange={onChangeData} />
                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col> */}
                                
                                <Col xs={3}>
                                
                                    <Form.Group >
                                        {/* <Form.Label>收件地址2:</Form.Label> */}
                                        <Form.Label>縣市</Form.Label>
                                        <Form.Control col={3} required as="select" value={selectedCity} onChange={handleCityChange}>
                                                <option value="">請選擇城市</option> 
                                                {Object.entries(area_data).map(([city, districts]) => (
                                                    <option key={city}>{city}</option>
                                                ))}
                                        </Form.Control>
                                    </Form.Group>
                                  </Col>
                                  <Col xs={3}>  
                                    <Form.Group >    
                                        <Form.Label>區域</Form.Label>
                                        <Form.Control col={3} required as="select" value={selectedDistrict} onChange={handleDistrictChange}>
                                                <option value="">請選擇區域</option>
                                                {districts.map((district) => (
                                                <option key={district} value={district}>{district}</option>
                                                ))}
                                        </Form.Control>

                                        <Form.Control.Feedback>欄位正確!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">欄位錯誤!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>  
                                    <Form.Group >    
                                        <Form.Label>其他詳細地址</Form.Label>
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
