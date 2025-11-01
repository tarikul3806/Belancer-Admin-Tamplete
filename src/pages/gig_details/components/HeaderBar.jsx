import { Breadcrumb, Button, Space, Tag, Typography } from "antd";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function HeaderBar({ gig, onOpenCompare }) {
    const navigate = useNavigate();
    const createdAt = new Date(gig.created_at).toLocaleString("en-GB", { hour12: false });
    const updatedAt = new Date(gig.updated_at).toLocaleString("en-GB", { hour12: false });

    return (
        <>
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item onClick={() => navigate("/")} className="font-medium text-gray-600">
                    <FaHome className="inline-flex w-5 h-5" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>Gigs</Breadcrumb.Item>
                <Breadcrumb.Item>#{gig.id}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <Title level={3} className="!mb-1">{gig.title}</Title>
                    <Space wrap>
                        <Tag color="green">Active</Tag>
                        <Tag>Seller #{gig.seller_id}</Tag>
                        <Tag>Lang: {gig.language || "—"}</Tag>
                        <Tag>Service: {gig.service_type || "—"}</Tag>
                    </Space>
                    <div className="text-gray-500 mt-1">
                        Created: {createdAt} • Updated: {updatedAt}
                    </div>
                </div>

                <Button className="sticky top-4" type="default" onClick={onOpenCompare} aria-label="Compare packages">
                    Compare packages
                </Button>
            </div>
        </>
    );
}
