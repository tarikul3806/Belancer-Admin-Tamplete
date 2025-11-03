import { Card, Descriptions, Space, Tag, Tooltip, Typography } from "antd";
import { currency, maybeBDT } from "../utility/money";

const { Text } = Typography;

export default function OverviewSection({ gig }) {
    return (
        <Card title="Overview">
            <Descriptions variant="true" column={1} styles={{ label: { width: 220 } }}>
                <Descriptions.Item label="Description">{gig.description}</Descriptions.Item>
                <Descriptions.Item label="Tags">
                    <Space wrap>{(gig.tags || []).map((t, i) => <Tag key={i}>{t}</Tag>)}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Medium">{gig.delivery_medium || "—"}</Descriptions.Item>
                <Descriptions.Item label="Target Audiences">{gig.target_audiences?.join(", ") || "—"}</Descriptions.Item>
                <Descriptions.Item label="Category IDs">{gig.category_id} / {gig.subcategory_id}</Descriptions.Item>
                <Descriptions.Item label="Tools">{gig.tools?.join(", ") || "—"}</Descriptions.Item>
                <Descriptions.Item label="Base Price">
                    <Space size="small">
                        <Text strong>{currency(gig.price)}</Text>
                        {maybeBDT(gig.price) && <Tag>৳ {maybeBDT(gig.price)}</Tag>}
                        <Tooltip title="Platform fee tooltip; show % and VAT per settings."><Tag color="default">Fee info</Tag></Tooltip>
                    </Space>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
}
