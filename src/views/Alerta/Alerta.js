import React, { useState, useEffect } from "react";

import api from "../../services/api";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";

export default function AtividadeItem(props) {
  const [atividadeSearch, setAtividadeSearch] = useState([]);

  useEffect(() => {
    getAssociado();
  }, []);

  function associadoEdit(e, id = null) {
    e.preventDefault();
    if (id != 0 && id != null) {
      props.history.push({
        pathname: `/console/alerta/edit/${id}`,
      });
    } else {
      props.history.push({
        pathname: `/console/alerta/edit/`,
      });
    }
  }

  const handlePesquisa = (text) => {
    if (text.length == 0) {
      getAssociado();
    }
    const searchData = atividadeSearch.filter((item) => {
      const itemData = `${item.nome.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setAtividadeSearch(searchData);
  };

  function associadoDelete(e, id) {
    e.preventDefault();
    if (window.confirm("Deseja realmente deletar este atividade ?")) {
      deleteAssociado(id);
    }
  }

  async function deleteAssociado(id) {
    try {
      const url = "/alerta/" + id;
      await api.delete(url);
      getAssociado();
    } catch (e) {}
  }

  async function getAssociado() {
    let url = `/alerta/all`;
    const response = await api.get(url);
    setAtividadeSearch(response.data);
  }

  function renderAssociados() {
    return atividadeSearch?.map((d, i) => (
      <tr key={i.id}>
        <td>{d.inicio}</td>
        <td>{d.fim}</td>
        <td>
          <Button
            color="info"
            onClick={(e) => {
              associadoEdit(e, d.id);
            }}
          >
            <i className="icon-note" />
          </Button>{" "}
          <Button
            color="danger"
            onClick={(e) => {
              associadoDelete(e, d.id);
            }}
          >
            <i className="icon-trash" />
          </Button>{" "}
        </td>
      </tr>
    ));
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Alerta
              <div className="card-header-actions">
                <Button
                  className="card-header-action btn-setting"
                  onClick={(e) => {
                    associadoEdit(e);
                  }}
                >
                  <i className="icon-note" /> Novo Alerta
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {/* <Row>
                <Col>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <Button type="button" color="primary" disabled>
                          <i className="fa fa-search"></i> Consulta
                        </Button>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Consulte a Atividade..."
                        onChange={(e) => {
                          handlePesquisa(e.target.value);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row> */}

              <Table className="table table-responsive-sm table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr className="text-left">
                    <th>Inicio</th>
                    <th>Fim</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{renderAssociados()}</tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
