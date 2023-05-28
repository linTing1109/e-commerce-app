import React, { Component } from 'react';
import axios from "axios";
import picAsc from './pic/pic1.png';
import picDesc from './pic/pic2.png';
import picAll from './pic/pic3.png';

// 後端訂單查詢api
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsSales';

class SalesReportLifeCycle extends Component {

    // 建構函式 設定初始化值
    constructor(props) {
        super(props);
        this.state = {
            reportData: null,
            goodsReportSalesList: null,
            genericPageable: null,
            currentPageNo: 1,
            pageDataSize: 5,
            pagesIconSize: 5,
            startDate: '2023-01-01',
            endDate: '2023-05-31',
            orderByItem: 'orderID', //預設就是用訂單編號排
            sort: 'ASC',
            //控制各欄位排序顯示圖片
            imagePicOrderID: picAsc,
            imagePicOrderDate: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
            //起始&結束日期 是否有選擇了 控制觸發使用
            searchStart: false,
            searchEnd: false,

        };
    }

    // 組件掛載:資料預先掛載
    componentDidMount() {
        this.fetchList();
    }
    // 呼叫後端api部分
    fetchList = async () => {
        const params = {
            "currentPageNo": this.state.currentPageNo, "pageDataSize": this.state.pageDataSize, "pagesIconSize": this.state.pagesIconSize
            , "startDate": this.state.startDate, "endDate": this.state.endDate
            , "orderByItem": this.state.orderByItem, "sort": this.state.sort
        };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        //判斷式原因是: 避免api傳回空值 塞值時 導致傳入有誤 進而引發畫面為空
        if (reportData && reportData.goodsReportSalesList && reportData.genericPageable) {
            this.setState({
                reportData,
                goodsReportSalesList: reportData.goodsReportSalesList,
                genericPageable: reportData.genericPageable

            });
        } else {
            this.setState({
                reportData: '',
                goodsReportSalesList: '',
                genericPageable: ''
            });
        }
        // console.log("goodsReportSalesList:", reportData.goodsReportSalesList);
        // console.log("genericPageable:", reportData.genericPageable);

    };

    // 組件更新:
    componentDidUpdate(prevProps, prevState) {
        // console.log(prevProps.sort);
        if (prevState.currentPageNo !== this.state.currentPageNo) {
            this.fetchList();
        }
        if (prevState.sort !== this.state.sort) {
            this.fetchList();
        }
        if (prevState.orderByItem !== this.state.orderByItem) {
            this.fetchList();
        }

    }
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

    // 日期搜尋
    onClickSearch = () => {
        this.fetchList();
        this.setState({
            currentPageNo: 1, //重新按查詢時 將頁面倒回第一頁
        });
    }

    // 變更PageDataSize
    onChangePageDataSize = (even) => {
        this.setState({
            pageDataSize: parseInt(even.target.value),
        });
    }

    // 變更PagesIconSize
    onChangePagesIconSize = (even) => {
        this.setState({
            pagesIconSize: parseInt(even.target.value)
        });
    }

    // 變更起始日期
    onChangeStartDate = (even) => {
        this.setState({
            startDate: even.target.value,
            searchStart: true
        });
    }
    // 變更結束日期
    onChangeEndDate = (even) => {
        this.setState({
            endDate: even.target.value,
            searchEnd: true
        });
    }

    // updateSearchButtonState = () => {
    //     const { startDate, endDate } = this.state;
    //     const isSearchDisabled = !startDate || !endDate;
    //     this.setState({ isSearchDisabled });
    //   }

    //訂單編號排序圖片顯示
    onClickSortOrderID = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderID: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //訂單日期排序圖片顯示
    onClickSortOrderDate = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: 'orderID',//因為orderID& orderDate原理相同 springBoot合併寫一起用orderID判斷
            imagePicOrderDate: imageValue,
            imagePicOrderID: picAll,//其餘的需要將圖變回原圖
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //客戶姓名排序圖片顯示
    onClickSortCusName = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderCusName: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderID: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //商品編號排序圖片顯示
    onClickSortGoodID = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderGoodID: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderID: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //商品名稱排序圖片顯示
    onClickSortGoodName = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderGoodName: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderID: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //商品價格排序圖片顯示
    onClickSortGoodPrice = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderGoodPrice: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderID: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodName: picAll,
            imagePicOrderBuyQuantity: picAll,
        });
    }
    //訂單數量排序圖片顯示
    onClickSortBuyQuantity = (even) => {
        const { sort } = this.state;
        const newSort = sort === 'ASC' ? 'DESC' : 'ASC'; //點擊ASC&DESC互換
        const imageValue = sort === 'ASC' ? picDesc : picAsc; //判斷變圖
        this.setState({
            sort: newSort,
            orderByItem: even.target.name,//將排序條件更換
            imagePicOrderBuyQuantity: imageValue,
            imagePicOrderDate: picAll,//其餘的需要將圖變回原圖
            imagePicOrderID: picAll,
            imagePicOrderCusName: picAll,
            imagePicOrderGoodID: picAll,
            imagePicOrderGoodPrice: picAll,
            imagePicOrderGoodName: picAll,
        });
    }
    render() {
        const { goodsReportSalesList, genericPageable, pageDataSize, pagesIconSize, currentPageNo,
            startDate, endDate, imagePicOrderID, imagePicOrderDate, imagePicOrderCusName, imagePicOrderGoodID,
            imagePicOrderGoodName, imagePicOrderGoodPrice, imagePicOrderBuyQuantity, sort, searchStart, searchEnd } = this.state;

        return (
            <div>
                <label>查詢日期起：</label> <input type='date' onChange={this.onChangeStartDate} />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' onChange={this.onChangeEndDate} />

                <label style={{ marginLeft: '20px' }} />
                {/* 起訖日皆有選擇時 查詢按鈕才可以點選 */}
                <button onClick={this.onClickSearch} disabled={!(searchStart && searchEnd)}>查詢</button>
                <hr />
                <label>
                    pageDataSize: <input type='number' value={pageDataSize} onChange={this.onChangePageDataSize} />
                    pagesIconSize: <input type='number' value={pagesIconSize} onChange={this.onChangePagesIconSize} />
                    目前排序方式:{sort}
                </label>
                <hr />
                {/* 前提條件需要 goodsReportSalesList &  genericPageable 有值才會顯示表格 */}
                {goodsReportSalesList && genericPageable &&
                    <div>
                        <table border={'2'}>
                            <thead>
                                <tr>

                                    <th>訂單編號<img src={imagePicOrderID} onClick={this.onClickSortOrderID} name='orderID' /></th>
                                    <th>購買日期<img src={imagePicOrderDate} onClick={this.onClickSortOrderDate} name='orderDate' /></th>
                                    <th>顧客姓名<img src={imagePicOrderCusName} onClick={this.onClickSortCusName} name='customerName' /></th>
                                    <th>商品編號<img src={imagePicOrderGoodID} onClick={this.onClickSortGoodID} name='goodsID' /></th>
                                    <th>商品名稱<img src={imagePicOrderGoodName} onClick={this.onClickSortGoodName} name='goodsName' /></th>
                                    <th>商品價格<img src={imagePicOrderGoodPrice} onClick={this.onClickSortGoodPrice} name='goodsBuyPrice' /></th>
                                    <th>購買數量<img src={imagePicOrderBuyQuantity} onClick={this.onClickSortBuyQuantity} name='buyQuantity' /></th>
                                </tr>
                            </thead>

                            <tbody>
                                {goodsReportSalesList.map((item, index) => (
                                    <tr key={item.orderID}>

                                        <td>{item.orderID}</td>
                                        <td>{new Date(item.orderDate).toLocaleString()}</td>
                                        {/* 將字串轉換成符合當地環境日期格式 */}
                                        {/* <td>{item.customerID}</td> */}
                                        <td>{item.customerName}</td>
                                        <td>{item.goodsID}</td>
                                        <td>{item.goodsName}</td>
                                        <td>{item.goodsBuyPrice}</td>
                                        <td>{item.buyQuantity}</td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <hr />
                        <div>


                            <button disabled={genericPageable.currentPageNo == 1}
                                onClick={() => this.onClickPageStart()}>{'<<'}</button>
                            <button disabled={genericPageable.currentPageNo < 2}
                                onClick={() => this.onClickPageSub()}>{'<'}</button>

                            {genericPageable.pagination.map((pageNo, index) => (

                                <span key={index}>

                                    <button onClick={() => this.onClickPage(pageNo)}>
                                        {/* 如果為當前頁面 粗體&下底線 */}
                                        {currentPageNo === pageNo ? <b><u>{pageNo}</u></b> : pageNo}
                                    </button>
                                </span>
                            ))}

                            <button disabled={genericPageable.currentPageNo >= genericPageable.endPageNo}
                                onClick={() => this.onClickPageAdd()}>{'>'}</button>

                            <button disabled={currentPageNo == genericPageable.endPageNo}
                                onClick={() => this.onClickPageEnd()}>{'>>'}</button>
                        </div>
                    </div>
                }
                {/* 測試用:
               <pre>{JSON.stringify(goodsReportSalesList, null, 2)}</pre> */}
            </div>
        );
    }
}

export default SalesReportLifeCycle;