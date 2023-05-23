import React, { Component } from 'react';
import axios from "axios";
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
            currentPageNo :1, 
            pageDataSize:10,
            pagesIconSize:5,
            //頁面輸入欄位
            goodsID:null,
            goodsName: null,
            quantity:null,
            startPrice:null,
            endPrice:null,
            status : null,
            //回傳結果
            listReport:[],
            genericPageable:[],
            goodsDatas:[],
            //排序
            orderByItem :'goodsID', //預設就是用商品編號排 所以只有imagePicGoodID:picAsc
            sort:'ASC',
            //各欄位圖片預設
            imagePicGoodID:picAsc,
            imagePicGoodName:picAll,
            imagePicGoodPrice:picAll,
            imagePicBuyQuantity:picAll,
            imagePicStatus:picAll,
        };
        
    }

    // 呼叫後端api:查詢商品列表
    fetchList = async () => {
        const { currentPageNo, pageDataSize,pagesIconSize,goodsID,goodsName,quantity,startPrice,endPrice,status,orderByItem,sort} = this.state;

        const params =  { 
        'currentPageNo': currentPageNo,'pageDataSize': pageDataSize,'pagesIconSize': pagesIconSize,'goodsID': goodsID,'goodsName': goodsName,
        'quantity': quantity,'status': status,'startPrice': startPrice,'endPrice': endPrice,'orderByItem': orderByItem,'sort': sort};

        const listReport = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        
        this.setState({ 
            listReport,
            genericPageable:listReport.genericPageable,
            goodsDatas:listReport.goodsDatas,
            
        });


    };

    // 組件掛載:資料預先掛載 查沒有任何條件的全部商品
    componentDidMount() {
        this.fetchList(); 
    }

     // 組件更新: 目前頁面 單頁顯示筆數 排序方式 升降冪  (顯示頁碼數沒有寫可變 所以這邊沒有)
     componentDidUpdate(prevProps, prevState){
        if(prevState.currentPageNo !== this.state.currentPageNo){
            this.fetchList();
        }
        if(prevState.pageDataSize !== this.state.pageDataSize){
            this.fetchList();
        }
        if(prevState.sort !== this.state.sort){
            this.fetchList();
        }
        if(prevState.orderByItem !== this.state.orderByItem){
            this.fetchList();
        }
    }


    onClickSumit = () => {
        this.setState({
            currentPageNo: 1  //重新按查詢會從第一頁開始顯示
        })
        
        this.fetchList();
    }

    onChangePageDataSize = (even) => {
        this.setState({
            pageDataSize: even.target.value,
            currentPageNo:1//避免已經選到後面頁面導致畫面有空資料
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
        this.setState({
            status: even.target.value
        })
    };

    // 每個頁面上的點擊
    onClickPage = (pageNo) => {
        this.setState({
            currentPageNo: pageNo
        });
        // this.fetchList();
    }

    // 下一頁點擊
    onClickPageAdd = () => {
        this.setState({
            currentPageNo: this.state.currentPageNo+1
        });
    }

    // 前一頁點擊
    onClickPageSub = () => {
        this.setState({
            currentPageNo: this.state.currentPageNo-1
        });
    }

    // 最首頁點擊
    onClickPageStart = () => {
        this.setState({
            currentPageNo:1
        });
    }

    // 最末頁點擊
    onClickPageEnd = () => {
        this.setState({
            currentPageNo:this.state.genericPageable.endPageNo
        });
    }

    // 各欄位排序圖片狀態顯示:(在input那邊需要搭配箭頭函式才可以使用)
    onClickSort = (event,orderByItem) => {
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
        const { goodsID,goodsName,quantity,startPrice,endPrice,status,genericPageable,goodsDatas,currentPageNo,sort,
            imagePicGoodID,imagePicGoodName,imagePicGoodPrice,imagePicBuyQuantity,imagePicStatus } = this.state;
        
        return (
            <div>
                <h3>商品列表</h3>
                {/* <form onSubmit={this.handleSubmit}> */}
                    商品編號:
                    <input type="number"  placeholder="Enter Goods Number" value={goodsID} onChange={this.onChangeGoodsID}/>
                    <br/>
                    商品名稱(不區分大小寫):
                    <input type="text"  placeholder="Enter Goods Name" value={goodsName} onChange={this.onChangeGoodsName}/>
                    <br/>
                    
                    商品價格最低價:
                    <input type="number"  placeholder="Enter goods price Min" value={startPrice} onChange={this.onChangeStartPrice}/>
                    <br/>

                    商品價格最高價:
                    <input type="number"  placeholder="Enter goods price Max" value={endPrice} onChange={this.onChangeEndPrice}/>
                    <br/>

                    排序方式:
                    <select id="orderByItem" value={sort} onChange={this.onChangePriceSort}>
                        <option value='asc' selected={sort == "asc"}> ASC(低-高)</option>
                        <option value='desc' selected={sort == "desc"}>DESC(高-低)</option>
                    </select>
                    <br/>

                    商品低於庫存量:
                    <input type="number"  placeholder="Enter goods stock quantity" value={quantity} onChange={this.onChangeQuantity} />
                    <br/>

                    商品狀態:
                    <select onChange={this.onChangeStatus}>
                        <option value="">ALL</option>
                        <option value="1" selected={status === "1"}>上架</option>
                        <option value="0" selected={status === "0"}>下架</option>
                    </select>
                    <br/>
                    <button onClick={this.onClickSumit}>查詢</button>
                    目前排序為:{sort}
                {/* </form> */}
                <hr/>
                {goodsDatas && genericPageable &&
                <div>
                    
                    <table border={'2'}>
                        <thead>
                            <tr>
                                <th>商品編號<img src={imagePicGoodID} onClick={(event) => this.onClickSort(event, 'goodsID')}/></th>
                                <th>商品名稱<img src={imagePicGoodName}  onClick={(event) => this.onClickSort(event, 'goodsName')}/></th>
                                <th>商品價格<img src={imagePicGoodPrice}  onClick={(event) => this.onClickSort(event, 'goodsPrice')}/></th>
                                <th>現有庫存<img src={imagePicBuyQuantity}  onClick={(event) => this.onClickSort(event, 'goodsQuantity')} /></th>
                                <th>商品狀態<img src={imagePicStatus}  onClick={(event) => this.onClickSort(event, 'status')} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {goodsDatas.map((item, index) => (
                            <tr key={item.goodsID}> 
                                <td>{item.goodsID}</td>                      
                                <td>{item.goodsName}</td>
                                <td>{item.goodsPrice}</td>
                                <td>{item.goodsQuantity}</td>
                                <td>{item.status =='1' ?'上架中':'下架中'}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                {/* </div> */}
                          
                <div>
                    <button disabled={genericPageable.currentPageNo ==1}
                    onClick={() => this.onClickPageStart()}>{'<<'}</button>

                    <button disabled={genericPageable.currentPageNo <2}
                    onClick={() => this.onClickPageSub()}>{'<'}</button>

                    {genericPageable.pagination && genericPageable.pagination.map((pageNo, index) => (
                        
                        <span key={index}>
                            
                        <button onClick={() => this.onClickPage(pageNo)}>
                            {/* 如果為當前頁面 粗體&下底線 */}
                            {currentPageNo ===pageNo ?<b><u>{pageNo}</u></b> :pageNo}
                        </button>
                        </span>
                    ))}           
                    <button disabled={genericPageable.currentPageNo >= genericPageable.endPageNo } 
                    onClick={() => this.onClickPageAdd()}>{'>'}</button>

                    <button disabled={currentPageNo==genericPageable.endPageNo  }
                    onClick={() => this.onClickPageEnd()}>{'>>'}</button>

                    <select onChange={this.onChangePageDataSize}>
                        <option value="">更改每頁顯示筆數</option>
                        <option value="3" selected={status === "3"}>3/page</option>
                        <option value="6" selected={status === "6"}>6/page</option>
                        <option value="9" selected={status === "9"}>9/page</option>
                    </select>    

                    共{genericPageable.dataTotalSize}件商品
                </div>            
                </div>
    }
                <hr/>
                {/* 下面是拿來看測試資料的
                ID:{goodsID}<br/>
                名稱:{goodsName}<br/>
                開始:{startPrice}<br/>
                結束:{endPrice}<br/>
                排序:{priceSort}<br/>
                庫存:{quantity}<br/>
                狀態:{status}<br/>
                currentPageNo:{this.state.currentPageNo},
                pageDataSize:{this.state.pageDataSize},
                pagesIconSize:{this.state.pagesIconSize},
                <pre>{JSON.stringify(listReport, null, 2)}</pre>
                {genericPageable.pagination} */}
            </div>

            
        );
    }
}

export default GoodsList;