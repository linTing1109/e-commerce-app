import React, { Component } from 'react';
import axios from "axios";


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
           
            goodsData:[], // 全部商品
            goods:[],//單一商品資訊
            reviseReport:[],//修改後的資料

            goodsName:'',      
            description:'',
            price:'',
            quantity: '',
            status:'1',
            fileName:'',
            fileNameNew:'',
            goodQuantity:'',
            goodsID: '',
            addQuantity:''
            // createReport:null,
        };
        
    }
    // 組件掛載:將全部商品資料預先載入
    componentDidMount(){
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
            description:data[0].description,
            price:data[0].goodsPrice,
            quantity:data[0].goodsQuantity,
            status:data[0].status,
            fileName:data[0].goodsImageName,
        });
    }

    //選擇項目時 更新goodID 並呼叫單一商品api
    onChangeSelect = (even)  => {
        // console.log("測試0:", this.state.goodsID);
        this.setState({
            goodsID: even.target.value
            
        });
        // console.log("測試1:", this.state.goodsID); 
        this.fetchGoods();
    }

    // 單一商品api
    fetchGoods = async () => {
        const params =  { "goodsID": this.state.goodsID};
        const goodData = await axios.get(apiUrl2, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        
        this.setState({ //將商品更新內容
            // goodsID: goodData.goodsID,
            goodsName:goodData.goodsName,
            description:goodData.description,
            price:goodData.goodsPrice,
            quantity:goodData.goodsQuantity,
            status:goodData.status,
            fileName:goodData.goodsImageName,
        });

    };

    onChangeGoodName = (even)  => {
        this.setState({
            goodsName: even.target.value
        });
    }

    onChangeDescription= (even)  => {
        this.setState({description: even.target.value});
    }

    onChangePrice= (even)  => {
        this.setState({price: even.target.value});
    }

    onChangeAddQuantity= (even)  => {
        this.setState({addQuantity: even.target.value});
    }

    onChangeRadio = (e) => {
        this.setState({ status: e.target.value})
    };

    onChangeImg = (event) => {
        // 取得圖片名稱
        this.setState({fileNameNew: event.target.files[0].name});
    };

    componentDidUpdate(prevProps, prevState){
        // console.log("4.componentDidUpdate 組件更新(Updating :更新)");
        // console.log("prevState userID:", prevState.goodsID);
        // console.log("state userID:", this.state.goodsID);
        if(prevState.goodsID !== this.state.goodsID){ //只要不等於代表有更換選擇項目 就重新取得單一商品內容
            this.fetchGoods();
        }
    }

    handleSubmit = async (event) => {
        const { goodsID,goodsName, description,price,addQuantity,status,fileNameNew } = this.state;
        // 防止瀏灠器預設submit跳頁
        event.preventDefault(); 
        const form = event.currentTarget;
        // const uploadFile=null;
        // {form.uploadFile.files[0] != null ? uploadFile =form.uploadFile.files[0]:uploadFile =null};
        const uploadFile = form.uploadFile.files[0];
        // console.log("測試",uploadFile);
        const formData = new FormData();
        formData.append('goodsID', goodsID);
        formData.append('goodsName', goodsName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('status', status);
        formData.append('imageName', fileNameNew);

        {addQuantity != '' ? formData.append('quantity', addQuantity):formData.append('quantity', 0)}//有可能沒有要補數
        {fileNameNew != '' && formData.append('file', uploadFile)}//沒有新的檔案名稱 代表沒有更新檔案
        
        const reviseReport= await axios.post(apiUrl3, formData)
        .then(rs => rs.data)
        .catch(error => {console.log("error:", error);} )

        this.setState({
            reviseReport,//更新後的資訊
            goodsID:reviseReport.goodsID,
            addQuantity:'', //更新完成後必須將要補貨的欄位清空
        });

    };

    render() {
        // const { ,createReport } = this.state;
        const { goodsData,goodsName, description,price,quantity,fileName,status,goodsID,goods,addQuantity,reviseReport} = this.state;

        return (
            <div>
                <h3>商品維護補貨</h3>
                <form onSubmit={this.handleSubmit}>
                    商品列表:
                    <select onChange={this.onChangeSelect} >
                        {
                        goodsData.map( (o) => <option key={o.goodsID} value={o.goodsID}>
                            <div>編號:{o.goodsID} /{o.goodsName}</div> 
                        </option> )
                        }
                    </select>
                    <br/>
                    商品名稱:
                    <input type="text" value={goodsName} placeholder="Enter Goods Name" required onChange={this.onChangeGoodName}></input>
                    <br/>
                    商品描述(選填):
                    <textarea value={description} rows="3" placeholder="Enter Goods description" onChange={this.onChangeDescription}></textarea>
                    <br/>
                    商品價格:
                    <input type="number" value={price} placeholder="Enter Goods price" required onChange={this.onChangePrice}></input>
                    <br/>    
                    庫存數量:{quantity} 
                    <br/>
                    補貨數量:
                    <input type="number" value={addQuantity} placeholder="Enter Add Quantity" onChange={this.onChangeAddQuantity}></input>
                    <br/>
                    原始檔案:{fileName}<br/>
                    <img src={`http://localhost:8090/training/goodsImg/${fileName}`} 
                    style={{ width: '200px', height: '150px' }} />  <br/>  
                    圖片更改:<br/>
                    
                    <input type='file' name='uploadFile' onChange={this.onChangeImg}/>
                    {/* onchange="validateImageFile(this); showFileName(this);" */}
                    <br/>
                    商品狀態:
                    <input type='radio' value={'1'}               
                        checked={status == '1'}
                        onChange={this.onChangeRadio}
                    />
                    <label>上架</label>

                    <input type='radio' value={'0'}
                            checked={status == '0'}
                            onChange={this.onChangeRadio}
                    />
                    <label>下架</label>

                    <br/>
                    <button type="submit">修改</button> 
                </form>

                <hr/>
               
                {/* 利用三元判斷式 成功新增才秀出下面資訊 否則為空 */}
                { reviseReport.length !=0 ? 
                    <div>
                    商品編號:{goodsID}更新成功!<br/>
                    修改後的內容為:<pre>{JSON.stringify(reviseReport, null, 2)}</pre>   
                    </div>  :null
                }        

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