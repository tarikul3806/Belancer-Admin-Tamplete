import { Card, Table } from "antd";
import { currency } from "../utility/money";

const customExtrasCols = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price (USD)", dataIndex: "price", key: "price", render: (v) => currency(v) },
    { title: "Add'l Days", dataIndex: "additional_days", key: "additional_days" }
];

export default function CustomExtrasTable({ dataSource }) {
    return (
        <Card title="Custom Extras">
            <Table
                rowKey={(r, i) => i}
                dataSource={dataSource || []}
                columns={customExtrasCols}
                locale={{ emptyText: "No custom extras" }}
            />
        </Card>
    );
}
