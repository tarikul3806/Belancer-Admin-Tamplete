import { Card, Table } from "antd";
import { currency } from "../utility/money";

const extrasCols = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price (USD)", dataIndex: "price", key: "price", render: (v) => currency(v) },
    { title: "Extra Days", dataIndex: "delivery_days", key: "delivery_days" }
];

export default function ExtrasTable({ dataSource }) {
    return (
        <Card title="Extras">
            <Table
                rowKey={(r, i) => i}
                dataSource={dataSource || []}
                columns={extrasCols}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                locale={{ emptyText: "No extras" }}
            />
        </Card>
    );
}
