import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Snap01 from './pic/Snap01.png';
import Snap02 from './pic/Snap02.png';
import Snap03 from './pic/Snap03.png';
import Snap04 from './pic/Snap04.png';
import Snap05 from './pic/Snap05.png';
import Snap06 from './pic/Snap06.png';
import Snap07 from './pic/Snap07.png';
import Snap08 from './pic/Snap08.png';
import Snap09 from './pic/Snap09.png';
import Snap10 from './pic/Snap10.png';

// 輪播設置與圖片
const Carousels = () => {

    return (
        <Container>
            {/* <Carousel fade> 淡入淡出效果 */}
            <Carousel fade>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap01}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap02}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap03}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap04}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap05}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap06}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap07}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap08}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap09}/>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={Snap10}/>
                </Carousel.Item>
                
            </Carousel>
        </Container>
    )
};

export default Carousels;
