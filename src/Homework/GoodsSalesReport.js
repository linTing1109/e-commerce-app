import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';


/**
 * 這兩個是為了下載PDF檔案使用 需額外安裝
 * npm install html2canvas
 * npm install jspdf
 */
import html2canvas from 'html2canvas'; //html2canvas 可以將 HTML 元素轉換成 Canvas
import { jsPDF } from 'jspdf'; //jspdf 可以將 Canvas 轉換為 PDF 檔案

//商品訂單列表api
const apiUrl = 'http://localhost:8090/training/ecommerce/BackendController/queryGoodsSalesReport';

const GoodsSalesReport = () => {

  const tableRef = useRef();

  // 這邊是使用當日日期換算 六個月前的資料:
  const date = new Date();//取得當天日期
  const month = date.getMonth() + 1;//因為起始月:0開始 所以+1
  const endMonth = month < 10 ? `0${month}` : month; //當日月份:需判斷是否有0的
  const startMonth = month - 6 < 1 ? month - 6 + 12 : month - 6;//上半年月份:需判斷是否跨年
  const dateStartMonth = startMonth < 10 ? `0${startMonth}` : startMonth;//當日日期:需判斷是否有0的
  const startYear = month - 6 < 1 ? date.getFullYear() - 1 : date.getFullYear();//上半年年份:需判斷是否跨年
  const endYear = date.getFullYear();//當日年份不需要變動
  const nowday = date.getDate();
  const dateDay = nowday < 10 ? `0${nowday}` : nowday;
  const dateSText = `${startYear}-${dateStartMonth}-${dateDay}`;//組成開始的日期
  const dateEText = `${endYear}-${endMonth}-${dateDay}`;//組成結束的日期

  //驗證用
  const [validated, setValidated] = useState(false);


  const [data, setData] = useState({
    startDate: dateSText, //預設傳入的是查詢當日~前六個月
    endDate: dateEText,//預設傳入的是查詢當日~前六個月
    // 判斷起訖日期順序的
    isStartDateValid: true, // 設定初始值為 true
    isEndDateValid: true, // 設定初始值為 true
    //回傳結果
    reportData: null,
    goodsID: null,
    goodsName: null,
    total: null,
  });
  // 解構 
  const { startDate, endDate, isStartDateValid, isEndDateValid, reportData } = data;

  // 變更startDate (並且開始要早於結束)
  const changeStartDate = (event) => {
    const newStartDate = event.target.value;
    if (newStartDate <= endDate) {
      setData((prevData) => ({
        ...prevData,
        startDate: newStartDate,
        isStartDateValid: true
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        startDate: newStartDate,
        isStartDateValid: false
      }));
    }
  };
  // 變更endDate (並且結束要晚於開始)
  const changeEndDate = (event) => {
    const newEndDate = event.target.value;
    if (startDate <= newEndDate) {
      setData((prevData) => ({
        ...prevData,
        endDate: newEndDate,
        isEndDateValid: true
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        endDate: newEndDate,
        isEndDateValid: false
      }));
    }
  };

  // 日期搜尋
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止瀏灠器預設submit跳頁
    // 使用者送出開啟表單欄位驗証功能
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      fetchList();
      //成功送出的時候驗證同時就要關掉
      setValidated(false);
    }
  }

  useEffect(() => {
    fetchList();//componentDidMount
  }, []);// componentDidUpdate


  // 後端api
  const fetchList = async () => {
    const params = { "startDate": startDate, "endDate": endDate };
    const reportData = await axios.get(apiUrl, { params })
      .then(rs => rs.data)
      .catch(error => { console.log(error); });
    setData(e => ({
      ...e,//hooks無法部分更新,加...e為保持原先欄位
      reportData: reportData
    }));
  };

  //下載檔案使用
  const handlePrintPDF = () => {
    const tableElement = tableRef.current;

    html2canvas(tableElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //使用今天的日期當下載檔名 ex:table20230528.pdf
      const today = new Date();
      const formattedDate = today.getFullYear() + '' + (today.getMonth() + 1).toString().padStart(2, '0') + '' + today.getDate().toString().padStart(2, '0');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`table${formattedDate}.pdf`);
    });
  };

  return (
    <div>
      <Container fluid="sm">
        <p class="h2">銷售報表</p>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col xs={3}>
              <Form.Group controlId="startDate">
                <Form.Label>查詢日期起：</Form.Label>
                <FormControl
                  type="date"
                  value={startDate} required
                  onChange={changeStartDate}
                  isInvalid={!isStartDateValid} // 根據狀態設置 isInvalid 屬性
                />
                <Form.Control.Feedback type="invalid">欄位錯誤!必填 且 起始必須早於結束</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group controlId="endDate">
                <Form.Label>查詢日期迄：</Form.Label>
                <FormControl
                  type="date"
                  value={endDate} required
                  onChange={changeEndDate}
                  isInvalid={!isEndDateValid} // 根據狀態設置 isInvalid 屬性
                />
                <Form.Control.Feedback type="invalid">欄位錯誤!必填 且 結束必須晚於起始</Form.Control.Feedback>

              </Form.Group>
            </Col>

            <Col xs={3} className="align-self-center" style={{ marginTop: '15px' }}>
              <Button variant="outline-primary" type="submit">查詢</Button>
            </Col>

          </Row>
        </Form>
        {reportData && reportData.length > 0 &&
          <div>
            符合的日期商品總筆數:{reportData.length} {'  '}
            <Button variant="outline-primary" onClick={handlePrintPDF}>下載報表</Button>
          </div>}
      
        {reportData && reportData.length == 0 &&
          <div><p class="text-danger">此區間無任何銷售紀錄 請重新查詢</p></div>}
      </Container>

      {reportData && reportData.length > 0 && <div>
        <Container fluid="sm">
          <Table striped bordered hover ref={tableRef}>
            <thead>
              <tr>
                <th>銷售排行</th>
                <th>商品編號</th>
                <th>商品名稱</th>
                <th>總銷售數</th>
              </tr>
            </thead>

            <tbody>
              {reportData.map((item, index) => (

                <tr key={item.goodsID}>
                  {/* 序號顯示 */}
                  <td>{index + 1}</td>
                  <td>{item.goodsID}</td>
                  <td>{item.goodsName}</td>
                  <td>{item.total}</td>

                </tr>
              ))}
            </tbody>
          </Table>

        </Container>
      </div>
      }
      {/* 測試結果:<pre>{JSON.stringify(reportData, null, 2)}</pre> */}
      {/* {reportData && <PieChart data={reportData} />} */}
      {/* <ReactChart data={reportData} />。 */}
    </div>
  )
}

export default GoodsSalesReport;
