import React from "react";
import { Alert, Card, Divider, Empty, Result, Skeleton, Space, Typography } from "antd";
import useAdminGig from "./hooks/useAdminGig";
import HeaderBar from "./components/HeaderBar";
import MediaSection from "./components/MediaSection";
import OverviewSection from "./components/OverviewSection";
import PackagesTabs from "./components/PackagesTabs";
import ExtrasTable from "./components/ExtrasTable";
import CustomExtrasTable from "./components/CustomExtrasTable";
import QASection from "./components/QASection";
import CompareDrawer from "./components/CompareDrawer";

const { Text } = Typography;

export default function GigDetailsPage() {
    const {
        loading, error, gig, readonly,
        initialTab, setTabQuery,
        compareOpen, setCompareOpen,
        pkgEntries,
    } = useAdminGig();

    if (loading) return <Card className="m-6"><Skeleton active paragraph={{ rows: 6 }} /></Card>;

    if (error) {
        return (
            <Result
                status="error"
                title="Couldn’t load gig"
                subTitle="Please try again or check network/API."
                extra={<button onClick={() => location.reload()} className="ant-btn ant-btn-default">Retry</button>}
            />
        );
    }

    if (!gig) return <Empty className="m-12" description="Gig not found" />;

    return (
        <div className="p-6 bg-blue-100">
            {readonly && (
                <Alert
                    type="info"
                    showIcon
                    message="Read-only mode"
                    description="Main server is offline; content is served from Redis. All mutations are disabled."
                    className="mb-4"
                />
            )}

            <Space direction="vertical" size={16} className="w-full">
                <HeaderBar gig={gig} onOpenCompare={() => setCompareOpen(true)} />
                <MediaSection
                    images={gig.images}
                    videos={gig.video}          
                    documents={gig.documents}  
                    apiBase={import.meta.env.VITE_API_URL}
                />
                <OverviewSection gig={gig} />
                <PackagesTabs pkgEntries={pkgEntries} defaultKey={initialTab} onChange={setTabQuery} />
                <ExtrasTable dataSource={gig.extras} />
                <CustomExtrasTable dataSource={gig.custom_extras} />
                <QASection questions={gig.custom_questions} faqs={gig.faqs} />
            </Space>

            <CompareDrawer
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                packages={gig.packages}
            />
        </div>
    );
}
