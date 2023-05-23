import React ,{useState,useEffect} from 'react'
import axios from "axios";
import picAsc from './pic/pic1.png';
import picDesc from './pic/pic2.png';
import picAll from './pic/pic3.png';

//商品訂單列表api
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsSales';

// 功能:後臺全部訂單頁面
const SalesReportHooks = () => {

    // 這邊是使用當日日期換算 六個月前的資料:
    const date = new Date();//取得當天日期
    const month = date.getMonth() + 1;//因為起始月:0開始 所以+1
    const endMonth = month < 10 ? `0${month}` : month; //當日月份:需判斷是否有0的
    const startMonth = month-6 < 1 ? month-6+12 : month-6;//上半年月份:需判斷是否跨年
    const dateStartMonth = startMonth <10 ? `0${startMonth}` : startMonth;//當日日期:需判斷是否有0的
    const startYear = month-6 < 1 ? date.getFullYear()-1 :date.getFullYear();//上半年年份:需判斷是否跨年
    const endYear = date.getFullYear();//當日年份不需要變動
    const nowday = date.getDate();
    const dateDay= nowday <10 ?  `0${nowday}` : nowday;
    const dateSText = `${startYear}-${dateStartMonth}-${dateDay}`;//組成開始的日期
    const dateEText = `${endYear}-${endMonth}-${dateDay}`;//組成結束的日期
    
    
    const [data, setData] = useState({

        // 各欄位的初始化:每頁十筆 頁碼按鈕5個 近半年~當日
        // reportData: null,
        currentPageNo:1,
        pageDataSize:10,
        pagesIconSize:5,
        startDate:dateSText, //預設傳入的是查詢當日~前六個月
        endDate:dateEText,//預設傳入的是查詢當日~前六個月
        orderByItem :'orderID', //預設就是用訂單編號排
        sort:'ASC',
        // //起始&結束日期 是否有選擇了 控制觸發使用
        // searchStart:false,
        // searchEnd:false,

         //回傳結果
         goodsReportSalesList: null, //放查詢回來的結果
         genericPageable: null,//放查詢回來相關頁碼資料使用
        
        //控制各欄位排序顯示圖片
        imagePicOrderID:picAsc,
        imagePicOrderDate:picAll,
        imagePicOrderCusName:picAll,
        imagePicOrderGoodID:picAll,
        imagePicOrderGoodName:picAll,
        imagePicOrderGoodPrice:picAll,
        imagePicOrderBuyQuantity:picAll,
    });

    // 解構 
    const {currentPageNo,pageDataSize,pagesIconSize,startDate,endDate,sort,orderByItem,
        // searchStart,searchEnd,
        goodsReportSalesList,genericPageable,
        imagePicOrderID,imagePicOrderDate,imagePicOrderCusName,imagePicOrderGoodID,
        imagePicOrderGoodName,imagePicOrderGoodPrice,imagePicOrderBuyQuantity} =data ;
   
    // 變更PageDataSize
    const changePageDataSize = (even)  => { 
        setData( e => ({
            ...e, //hooks無法部分更新,加...e為保持原先欄位
            pageDataSize:even.target.value}));
    }
    
     // 變更PagesIconSize
    const changePagesIconSize = (even)  => {
    setData( e => ({
        ...e,//hooks無法部分更新,加...e為保持原先欄位
        pagesIconSize:even.target.value}));
    }

    // 變更startDate
    const changeStartDate = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            startDate:even.target.value,
            // searchStart:true
        }));
    }

    // 變更endDate
    const changeEndDate = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            endDate:even.target.value,
            // searchEnd:true
        }));
    }

    // 最首頁點擊
    const clickPageStart = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo:1}));
    }

    // 最末頁點擊
    const clickPageEnd = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo:genericPageable.endPageNo}));
    }


    // 前一頁點擊
    const clickPageSub = (even)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo-1}));
    }


    // 下一頁點擊
    const clickPageAdd = ()  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: currentPageNo+1}));
    }

    // 每個頁面上的點擊
    const clickPage = (pageNo)  => {
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: pageNo}));
    }

    // 日期搜尋
    const clickSearch = ()  => {
        fetchList();
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            currentPageNo: 1,//當重新查詢時候 頁面從第一頁開始顯示
            //重新搜尋 將排序預定為訂單ID並且是ASC
            sort:'ASC',
            orderByItem :'orderID',
            imagePicOrderID: picAsc, 
            imagePicOrderDate: picAll,
            imagePicOrderCusName:picAll,
            imagePicOrderGoodID:picAll,
            imagePicOrderGoodName:picAll,
            imagePicOrderGoodPrice:picAll,
            imagePicOrderBuyQuantity: picAll,

        })); 
    }

    
    // 各欄位排序圖片狀態顯示:(在input那邊需要搭配箭頭函式才可以使用)
    const clickSortOrder = (even) => {
        // const { sort } = this.state;
        const newSort = sort === "ASC" ? "DESC" : "ASC"; // 點擊 ASC & DESC 互換
        const imageValue = sort === "ASC" ? picDesc : picAsc; // 判斷變圖
        const imagePicAll = picAll; // 原圖
        setData( e => ({
            ...e,//hooks無法部分更新,加...e為保持原先欄位
            sort: newSort ,
            // 傳給後端的值:因為後端訂單編號的順序跟日期順序是一樣的 沒有額外寫date排序
            orderByItem:even.target.name ==='orderDate'? 'orderID':even.target.name,
            
            //依照排序條件動態抽換圖片
            imagePicOrderBuyQuantity:even.target.name=== 'buyQuantity' ? imageValue : imagePicAll,
            imagePicOrderID:even.target.name === 'orderID' ? imageValue : imagePicAll, //even.target.name為的是要原本的觸發條件不要上面的
            imagePicOrderDate:even.target.name === 'orderDate' ? imageValue : imagePicAll,//even.target.name為的是要原本的觸發條件不要上面的
            imagePicOrderCusName:even.target.name === 'customerName' ? imageValue : imagePicAll,
            imagePicOrderGoodID:even.target.name === 'goodsID' ? imageValue : imagePicAll,
            imagePicOrderGoodName:even.target.name === 'goodsName' ? imageValue : imagePicAll,
            imagePicOrderGoodPrice:even.target.name === 'goodsBuyPrice' ? imageValue : imagePicAll,

        }));
    }
        
      
    useEffect(() => {
        fetchList();//componentDidMount
    },[currentPageNo,sort,orderByItem]);// componentDidUpdate:頁碼,升降冪,排序方式

    // 後端api
    const fetchList = async() => {
        const params =  { "currentPageNo": currentPageNo, "pageDataSize": pageDataSize, "pagesIconSize": pagesIconSize
        , "startDate": startDate, "endDate":endDate, "orderByItem": orderByItem,"sort": sort,
        };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        //判斷式原因是: 避免api傳回空值 塞值時 導致傳入有誤 進而引發畫面為空
        if (reportData && reportData.goodsReportSalesList && reportData.genericPageable) {
            setData( e => ({
                    ...e,//hooks無法部分更新,加...e為保持原先欄位
                    // reportData,
                    goodsReportSalesList: reportData.goodsReportSalesList, 
                    genericPageable: reportData.genericPageable
                }));
        }  else { 
            setData( e => ({
                ...e,//hooks無法部分更新,加...e為保持原先欄位
                // reportData,
                goodsReportSalesList: '', 
                genericPageable: ''
            }));
        }     
    };

    
    return (
        <div>
            <h3>訂單查詢</h3>
            {/* {!(searchStart && searchEnd) ? :null}   */}

            {/* <div>預設:當日~前半個月的,修改時:起訖日皆有選擇時,才可以搜尋喔!</div>     */}
            <label>查詢日期起：</label> <input type='date' onChange={changeStartDate} value={startDate}/>
            <label style={{ marginLeft: '20px' }} />
            <label>查詢日期迄：</label> <input type='date' onChange={changeEndDate} value={endDate}/>
            

            <label style={{ marginLeft: '20px' }} />
            {/* 起訖日皆有選擇時 查詢按鈕才可以點選 disabled={!(searchStart && searchEnd)}*/}
            <button onClick={clickSearch} >查詢</button>
           
            <br />
            <label>
                    pageDataSize: <input type='number' onChange={changePageDataSize} />
                    pagesIconSize: <input type='number'onChange={changePagesIconSize}/>
            </label>
            {/* 前提條件需要 goodsReportSalesList &  genericPageable 有值才會顯示表格 */}
            {goodsReportSalesList && genericPageable &&
                <div>
                <table border={'2'}>
                    <thead>
                        <tr>          
                            <th>訂單編號<img src={imagePicOrderID} onClick={(event) => clickSortOrder(event)} name='orderID'/></th>
                            <th>購買日期<img src={imagePicOrderDate} onClick={(event) => clickSortOrder(event)} name='orderDate'/></th> 
                            <th>顧客姓名<img src={imagePicOrderCusName}  onClick={(event) => clickSortOrder(event)} name='customerName'/></th>
                            <th>商品編號<img src={imagePicOrderGoodID} onClick={(event) => clickSortOrder(event)} name='goodsID'/></th>
                            <th>商品名稱<img src={imagePicOrderGoodName} onClick={(event) => clickSortOrder(event)} name='goodsName'/></th>
                            <th>商品價格<img src={imagePicOrderGoodPrice} onClick={(event) => clickSortOrder(event)}  name='goodsBuyPrice'/></th>
                            <th>購買數量<img src={imagePicOrderBuyQuantity} onClick={(event) => clickSortOrder(event)} name='buyQuantity'/></th>
                            
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
                    onClick={() => clickPageStart()}>{'<<'}</button>
                    <button disabled={genericPageable.currentPageNo <2}
                    onClick={() => clickPageSub()}>{'<'}</button>
                    
                    {genericPageable.pagination.map((pageNo, index) => (
                        
                        <span key={index}>
                            
                        <button onClick={() => clickPage(pageNo)}>
                            {/* 如果為當前頁面 粗體&下底線 */}
                            {currentPageNo ===pageNo ?<b><u>{pageNo}</u></b> :pageNo}
                        </button>
                        </span>
                    ))}

                    <button disabled={genericPageable.currentPageNo >= genericPageable.endPageNo } 
                    onClick={() => clickPageAdd()}>{'>'}</button>

                    <button disabled={currentPageNo==genericPageable.endPageNo  }
                    onClick={() => clickPageEnd()}>{'>>'}</button>
                </div> 
                </div>
                }
        <hr/>    
        Hooks 測試資料用:<br/>
        startDate:{startDate}<br/>
        endDate:{endDate}<br/>
        currentPageNo:{currentPageNo}<br/>
        pageDataSize:{pageDataSize}<br/>
        pagesIconSize:{pagesIconSize}<br/>
        sort:{sort}<br/>
        orderByItem:{orderByItem}<br/>
        {/* imagePicOrderID:<img src={imagePicOrderID}></img><br/> */}
        {/* {goodsReportSalesList} */}
        </div>
    )
}

export default SalesReportHooks
