import React, { Component  } from 'react';
import axios from "axios";

const apiAddGoodsUrl = 'http://localhost:8090/training/ecommerce/BackendController/createGoods';

// 功能:新增商品頁面
class GoodsCreate extends Component {
    
    // 建構函式 設定初始化值
    constructor(props) {
        super(props);
        this.state = {
            
            // 後端api傳入使用:
            goodsName:'',      
            description:'',
            price:'',
            quantity: '',
            status:'1', //預設上架
            fileName:'',

            goodsID: '',
            createReport:null,
        };
        
    }

    handleSubmit = async (event) => {
        // 解構欄位
        const { goodsName, description,price,quantity,imageName,fileName,status } = this.state;
        // 防止瀏灠器預設submit跳頁
        event.preventDefault(); 
        const form = event.currentTarget;
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
        .catch(error => {console.log("error:", error);} )

        this.setState({
            createReport,
            goodsID: createReport.goodsID  //得到上架商品ID
        });

    };

    onChangeGoodName = (even)  => {
        this.setState({
            goodsName: even.target.value
        });
    }

    onChangeDescription= (even)  => {
        this.setState({
            description: even.target.value
        });
    }

    onChangePrice= (even)  => {
        this.setState({
            price: even.target.value
        });
    }

    onChangeQuantity= (even)  => {
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
        const { goodsName, description,price,quantity,imageName,fileName,status,createReport } = this.state;

        return (
            <div>
                <h3>商品新增上架</h3>
                <form onSubmit={this.handleSubmit}>
                商品名稱:
                <input type="text" value={goodsName} placeholder="Enter Goods Name" required onChange={this.onChangeGoodName}></input>
                <br/>
                商品描述(選填):
                <textarea value={description} rows="3" placeholder="Enter Goods description" onChange={this.onChangeDescription}></textarea>
                <br/>
                商品價格:
                <input type="number" value={price} placeholder="Enter Goods price" required onChange={this.onChangePrice}></input>
                <br/>
                初始數量:
                <input type="number" value={quantity} placeholder="Enter Goods quantity" required onChange={this.onChangeQuantity}></input>
                <br/>
                圖片上傳:
                
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
                <button type="submit">新增</button> 
                </form>
                {/* goodsName :{goodsName};<br/>
                description :{description};<br/>
                price :{price};<br/>
                quantity :{quantity};<br/>
                fileName :{fileName};<br/>
                status :{status};<br/> */}
                {/* 利用三元判斷式 成功新增才秀出下面資訊 否則為空 */}
                {createReport !=null ? 
                    <div>
                    新增成功號碼為:{this.state.goodsID}<br/>
                    新增內容為:<pre>{JSON.stringify(createReport, null, 2)}</pre>
                    {/* http://localhost:8090/training/goodsImg/圖片名稱 */}
                    <img src={`http://localhost:8090/training/goodsImg/${fileName}`} 
                    style={{ width: '200px', height: '150px' }} />
 
                    </div>  :null
                    
                    


                }
            </div>
            
            
        );
    }
}

export default GoodsCreate;