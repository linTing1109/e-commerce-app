import React, { Component } from 'react';
import axios from "axios";

// const apiUrl = 'http://localhost:8090/ecommerce/BackendController/queryGoodsSales';
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsSales';

class SalesReportSetState extends Component {
    
    
    constructor(props) {
        
        super(props);
        this.state = {
          reportData: null,
          goodsReportSalesList: null,
          genericPageable: null,
          currentPageNo:1,
          
          pageDataSize:2,
          pagesIconSize:3,
          startDate:'',
          endDate:''
        };
    }

    onClickSearch = async (event) => {
        
        // const params =  { "currentPageNo": 1, "pageDataSize": 2, "pagesIconSize": 2, "startDate": "2023/01/01", "endDate": "2023/05/31" };
        
        const params =  { "currentPageNo": this.state.currentPageNo, "pageDataSize": this.state.pageDataSize, "pagesIconSize": this.state.pagesIconSize, "startDate": this.state.startDate, "endDate": this.state.endDate };
        
        
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        

        this.setState({ 
            reportData, 
            goodsReportSalesList: reportData.goodsReportSalesList, 
            genericPageable: reportData.genericPageable
            
        });

        
        console.log("goodsReportSalesList:", reportData.goodsReportSalesList);
        console.log("genericPageable:", reportData.genericPageable);

    };


    onChangePageDataSize = (even)  => {
        this.setState({
            pageDataSize: parseInt(even.target.value),
            
        });
    }

    onChangePagesIconSize = (even)  => {
        this.setState({         
            pagesIconSize: parseInt(even.target.value)
        });
    }

    onChangeStartDate = (even)  => {
        this.setState({         
            startDate: even.target.value
        });
    }

    onChangeEndDate = (even)  => {
        this.setState({         
            endDate: even.target.value
        });
    }
    onClickPage = (pageNo) => {
        console.log("clickPage",pageNo);
         this.setState({ currentPageNo: pageNo }, 
        () => 
           this.onClickSearch()
        )
    };

    onClickPageAdd = () => {
        // 下一頁點擊
         this.setState({ currentPageNo: this.state.currentPageNo+1}, 
        () => 
           this.onClickSearch()
        )
    };

    onClickPageSub = () => {
        // 前一頁點擊
         this.setState({ currentPageNo: this.state.currentPageNo-1}, 
        () => 
           this.onClickSearch()
        )
    };

    onClickPageStart = () => {
        // 最首頁點擊
         this.setState({ currentPageNo: 1}, 
        () => 
           this.onClickSearch()
        )
    };

    onClickPageEnd = () => {
        // 最末頁點擊
         this.setState({ currentPageNo:this.state.genericPageable.endPageNo }, 
        () => 
           this.onClickSearch()
        )
    };
   
    render() {
        const { goodsReportSalesList, genericPageable,pageDataSize,pagesIconSize,currentPageNo,startDate,endDate } = this.state;
        
        return (
            <div>
                <label>查詢日期起：</label> <input type='date' onChange={this.onChangeStartDate}/>
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' onChange={this.onChangeEndDate} />
                
                <label style={{ marginLeft: '20px' }} />
                <button onClick={this.onClickSearch}>查詢</button>
                <hr />
                <label>
                    pageDataSize: <input type='number' value={pageDataSize} onChange={this.onChangePageDataSize} />
                    pagesIconSize: <input type='number' value={pagesIconSize} onChange={this.onChangePagesIconSize} />
                </label>
                <hr></hr>
                
                {goodsReportSalesList && genericPageable &&
                <div>
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
                <hr/> 
                <div>
                
                    
                    <button disabled={genericPageable.currentPageNo ==1}
                    onClick={() => this.onClickPageStart()}>{'<<'}</button>
                    <button disabled={genericPageable.currentPageNo <2}
                    onClick={() => this.onClickPageSub()}>{'<'}</button>
                    
                    {genericPageable.pagination.map((pageNo, index) => (
                        
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
                </div> 
                </div>
                }
            </div>
        );
    }
}

export default SalesReportSetState;