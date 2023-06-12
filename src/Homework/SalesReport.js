import React, { Component } from 'react';
import axios from "axios";

// 商品訂單查詢api
const apiUrl = 'http://localhost:8090/ecommerce/BackendController/queryGoodsSales';


class SalesReport extends Component {

    onClickSearch = async () => {
        const params =  { "currentPageNo": 1, "pageDataSize": 5, "pagesIconSize": 5, "startDate": "2023-01-01", "endDate": "2023-05-01" };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
    };

    render() {
        return (
            <div>
                <label>查詢日期起：</label> <input type='date' />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' />
                <label style={{ marginLeft: '20px' }} />
                <button onClick={this.onClickSearch}>查詢</button>
                <hr />
                <table border={'2'}>
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>購買日期</th>
                            <th>顧客姓名</th>
                            <th>商品編號</th>
                            <th>商品名稱</th>
                            <th>商品價格</th>
                            <th>購買數量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>94</td>
                            <td>2023-05-02 19:45:43</td>
                            <td>Jolin</td>
                            <td>28</td>
                            <td>Java Chip</td>
                            <td>145</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>93</td>
                            <td>2023-05-02 19:45:43</td>
                            <td>Jolin</td>
                            <td>27</td>
                            <td>Caramel Java Chip</td>
                            <td>145</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>92</td>
                            <td>2023-05-02 19:45:43</td>
                            <td>Jolin</td>
                            <td>26</td>
                            <td>Caramel Frappuccino</td>
                            <td>130</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>91</td>
                            <td>2023-05-02 19:45:43</td>
                            <td>Jolin</td>
                            <td>25</td>
                            <td>Coffee</td>
                            <td>105</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>90</td>
                            <td>2023-05-02 19:45:43</td>
                            <td>Jolin</td>
                            <td>24</td>
                            <td>Dark Caramel Coffee</td>
                            <td>145</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
                <hr/>                
                <div>
                    <button disabled={true}>{'<<'}</button>
                    <button disabled={true}>{'<'}</button>
                    <button>{'1'}</button>
                    <button><u><b>{'2'}</b></u></button>
                    <button>{'3'}</button>
                    <button>{'4'}</button>
                    <button>{'5'}</button>
                    <button disabled={false}>{'>'}</button>
                    <button disabled={false}>{'>>'}</button>
                </div>
            </div>
        );
    }
}

export default SalesReport;