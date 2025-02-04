import React, {Component} from "react";
import {Button, Progress, Row, Space, Switch, Tooltip} from "antd";
import Col from "antd/es/grid/col";
import DeleteOutlined from "@ant-design/icons/es/icons/DeleteOutlined";
import sberLogo from "./../../assets/images/sber-logo.svg";
import Icon from "@ant-design/icons/lib";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";

const emptyContent = (<span style={{color: "rgba(0, 0, 0, 0)"}}>&nbsp;</span>);
const displayHeader = [emptyContent, "Beverage", "Volume", "Ice", "Status"];

export default class Beverages extends Component {

    render() {
        return (
            <Row id="beverages-control-panel" align="middle" justify="center">
                <Col style={{backgroundColor: "#C8C8C8", borderRadius: 5, padding: 10}}>
                    <Space direction="vertical">
                        <Row>
                            <Col>
                                <Display id="display"
                                         content={this.props.order}
                                         onSelectIce={this.props.selectIce}
                                         onRemoveVolume={this.props.removeBeverageVolume}
                                         processBeverage={this.props.processBeverage}
                                         processingBeverage={this.props.processingBeverage}
                                         orderConfirmed={this.props.orderConfirmed}
                                />
                            </Col>
                        </Row>
                        {this.props.beverages.map(beverage =>
                            <Beverage key={beverage.id}
                                      item={beverage}
                                      addVolume={this.props.addVolume}
                                      maxSize={this.props.order.length === 5}
                                      onSelectVolume={this.props.addBeverageVolume}
                                      orderConfirmed={this.props.orderConfirmed}
                            />)
                        }
                        <Row align="middle" justify="center">
                            <Col>
                                <Tooltip
                                    title={this.props.totalCost === 0 || this.props.balance < this.props.totalCost
                                        ? "Внесите количество средств, покрывающих стоимость заказа"
                                        : ""}
                                >
                                    <Button id="submit-order"
                                            type="primary"
                                            shape="round"
                                            size="large"
                                            loading={false}
                                            disabled={
                                                this.props.totalCost === 0 ||
                                                this.props.balance < this.props.totalCost ||
                                                this.props.orderConfirmed
                                            }
                                            style={{width: 200, height: 50, fontSize: 24}}
                                            onClick={this.props.submit}
                                    >
                                        Подтвердить
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row align="middle" justify="center">
                            <Col>
                                <Tooltip title="Удалить активный заказ">
                                    <Button id="cancel-order"
                                            type="danger"
                                            shape="round"
                                            size="large"
                                            // loading={false}
                                            // disabled={
                                            //     this.props.totalCost === 0 ||
                                            //     this.props.balance < this.props.totalCost ||
                                            //     this.props.orderConfirmed
                                            // }
                                            style={{width: 200, height: 50, fontSize: 24}}
                                            onClick={this.props.cancelActiveOrder}
                                    >
                                        Отменить
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row align="middle" justify="center">
                            <Col>
                                <Progress id="beverage-processing-progress-bar"
                                          strokeLinecap="square"
                                          percent={this.props.progress}
                                          steps={20}
                                />
                            </Col>
                        </Row>
                    </Space>
                </Col>
            </Row>
        );
    }
}

class Display extends Component {

    render() {
        return (
            <div id="display" className="resp-table">
                <div className="resp-table-header">
                    {displayHeader.map((column, key) => <div key={key} className="table-header-cell">{column}</div>)}
                </div>
                <div className="resp-table-body">
                    {this.tableRow(0)}
                    {this.tableRow(1)}
                    {this.tableRow(2)}
                    {this.tableRow(3)}
                    {this.tableRow(4)}
                </div>
            </div>
        );
    }

    tableRow(index) {
        let volume = this.props.content[index];

        return (
            <div id={`order-beverage-${index}`} className="resp-table-row">
                <div className="table-body-cell">
                    {volume
                        ? <Tooltip title={`Delete '${volume.beverageType}' (${volume.beverageVolume.volume})`}>
                            <Button type="text"
                                    icon={<DeleteOutlined/>}
                                    disabled={this.props.orderConfirmed}
                                    style={{color: "white"}}
                                    onClick={() => this.props.onRemoveVolume(index)}
                            />
                        </Tooltip>
                        : emptyContent}
                </div>
                <div className="table-body-cell">
                    {volume ? volume.beverageType : emptyContent}
                </div>
                <div className="table-body-cell">
                    {volume ? volume.beverageVolume.volume : emptyContent}
                </div>
                <div className="table-body-cell">
                    {volume
                        ? <Switch checked={volume.selectedIce}
                                  disabled={this.props.orderConfirmed}
                                  onChange={checked => this.props.onSelectIce(index, checked)}/>
                        : emptyContent}
                </div>
                <div className="table-body-cell">
                    {volume ? this.statusColumnContent(index) : emptyContent}
                </div>
            </div>
        );
    }

    statusColumnContent(index) {
        let volume = this.props.content[index];

        if (volume.status === 'SELECTED') {
            return emptyContent;
        } else if (volume.status === 'READY_TO_PROCESS') {
            return this.actionButton(volume, 'Process');
        } else if (volume.status === 'READY') {
            return this.actionButton(volume, 'Take');
        } else {
            return <Icon component={sberLogo} style={{color: 'white', fontSize: 14}}/>;
        }
    }

    actionButton(volume, action) {
        let beverage = this.props.processingBeverage;
        let notPickedUpCount = this.props.content.filter(beverage => beverage.status === 'READY').length;
        let notPickedUp = volume.status !== 'READY' && notPickedUpCount > 0;

        return (
            <Button type="text"
                    shape="round"
                    size="small"
                    loading={beverage && beverage === volume.id}
                    disabled={beverage && beverage !== volume.id || notPickedUp}
                    onClick={() => this.props.processBeverage(volume.id, action.toUpperCase())}
                    style={{color: 'white'}}
            >
                {action}
            </Button>
        );
    }
}

class Beverage extends Component {

    render() {
        return (
            <Row className="beverage" align="middle" justify="center" style={{color: "white"}}>
                <Col>
                    <Tooltip title="Добавить 0.5L">
                        <Button className="beverage-fill"
                                type="secondary"
                                shape="circle"
                                size="large"
                                icon={<PlusOutlined/>}
                                disabled={this.props.orderConfirmed}
                                onClick={() => {
                                    // ОЖИДАЕМАЯ ОШИБКА - некорректно увеличивается доступный объем напитка
                                    let volumes = [0.5, 1.0, 1.5];
                                    let volume = volumes[Math.floor(Math.random() * volumes.length)];
                                    this.props.addVolume(this.props.item.id, volume);
                                }}
                        />
                    </Tooltip>
                </Col>
                <Col className="beverage-label"
                     style={{
                         backgroundColor: "#B0B0B0",
                         fontSize: 24,
                         width: 220,
                         textAlign: "center"
                     }}
                >
                    <span>{`${this.props.item.beverageType} (${this.props.item.availableVolume.toFixed(2)}L)`}</span>
                </Col>
                {this.props.item.beverageVolumes.map(beverageVolume =>
                    <Col key={beverageVolume.id}>
                        <Tooltip title={`${beverageVolume.price}₽`}>
                            <Button className="beverage-volume"
                                    shape="circle"
                                    size="large"
                                    disabled={this.props.maxSize || this.props.orderConfirmed}
                                    onClick={() => this.props.onSelectVolume(this.props.item.beverageType, beverageVolume)}
                            >
                                {beverageVolume.volume}
                            </Button>
                        </Tooltip>
                    </Col>
                )}
            </Row>
        );
    }
}