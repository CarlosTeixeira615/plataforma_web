import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Carousel,
  CarouselItem,
  CarouselControl,
  Jumbotron,
} from 'reactstrap';


export default function ComunicadoView(props) {

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [comunicado, setComunicado] = useState({});
  const [comunicadoImages, setComunicadoImages] = useState([]);
  const id = props.location.state && props.location.state.id ? props.location.state.id : null;
  api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('crcl-web-token')}`;

  useEffect(() => {
    getComunicado()
    return () => { }
  }, [])

  async function getComunicado() {
    try {
      if (id) {
        const url = "/comunicado/" + id
        const response = await api.get(url)
        setComunicado(response.data.data)
        if (response.data[0].imagem) {
          setComunicadoImages(comunicadoImages.concat({
            src: response.data[0].imagem,
            altText: '...',
            caption: '...',
          }))
        }
      }
    }
    catch (e) {
    }
  }

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === comunicadoImages.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? comunicadoImages.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = comunicadoImages.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img className="d-block w-100" src={item.src} alt={item.altText} />
      </CarouselItem>
    );
  });

  function handleComunicado() {
    return (
      <Jumbotron className='bg-transparent'>
        <h1 className="display-4">{comunicado.assunto}</h1>
        <hr className="my-2" />
        <p className="lead" style={{ whiteSpace: 'pre-line' }}>{comunicado.descricao}</p>
      </Jumbotron>
    )
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <i className="fa fa-edit"></i><strong>Comunicado</strong>
            </CardHeader>
            <CardBody>
              <div className='row justify-content-center'>
                <Carousel activeIndex={activeIndex}
                  next={next}
                  previous={previous}
                  className='w-50'
                  interval={false}>
                  {slides}
                  <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                  <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Carousel>
              </div>
              <div>
                {handleComunicado()}
              </div>
            </CardBody>
            <CardFooter>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

