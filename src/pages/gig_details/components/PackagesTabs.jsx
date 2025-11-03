import { Card, Descriptions, Empty, Space, Tabs, Tag, Typography, Tooltip } from "antd";
import { currency, maybeBDT } from "../utility/money";

const { Text } = Typography;

export default function PackagesTabs({ pkgEntries, defaultKey, onChange }) {
    if (!pkgEntries?.length) return (
        <Card id="packages" title="Packages" className="sticky top-0 z-10">
            <Empty description="No packages" />
        </Card>
    );

    const items = pkgEntries.map(([key, data]) => ({
        key,
        label: key[0].toUpperCase() + key.slice(1),
        children: (
            <Card>
                <Descriptions variant="true" column={1} styles={{ label: { width: 220 } }}>
                    {Object.entries(data).map(([k, v]) => (
                        <Descriptions.Item key={k} label={k}>
                            {k.toLowerCase() === "price" ? (
                                <Space size="small">
                                    <Text strong>{currency(v)}</Text>
                                    <Tooltip title="Buyer sees price plus platform fee & taxes; exact fee shown where applicable.">
                                        <Tag color="default">Fee info</Tag>
                                    </Tooltip>
                                    {maybeBDT(v) && <Tag>৳ {maybeBDT(v)}</Tag>}
                                </Space>
                            ) : String(v)}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </Card>
        )
    }));

    return (
        <Card id="packages" title="Packages" className="sticky top-0 z-10">
            <Tabs defaultActiveKey={defaultKey} items={items} onChange={onChange} />
        </Card>
    );
}
