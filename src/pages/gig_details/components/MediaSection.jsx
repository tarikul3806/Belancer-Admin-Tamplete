import { Card, Empty, Image, List, Modal, Button, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import { FileTextOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

const { Text } = Typography;

const fullUrl = (base, p) => (p?.startsWith("http") ? p : `${base}/${p}`);
const basename = (u) => {
    try { return decodeURIComponent(u.split("/").pop() || u); } catch { return u; }
};

export default function MediaSection({ images = [], videos = [], documents = [], apiBase }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [playerOpen, setPlayerOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    const normalized = useMemo(() => {
        const imgs = (images || []).map((s) => ({ url: fullUrl(apiBase, typeof s === "string" ? s : s.url || s.path) }));
        const vids = (videos || []).map((v) => {
            const url = fullUrl(apiBase, typeof v === "string" ? v : v.url || v.path);
            return { url, name: basename(url) };
        });
        const docs = (documents || []).map((d) => {
            const url = fullUrl(apiBase, typeof d === "string" ? d : d.url || d.path);
            const name = typeof d === "object" && d.name ? d.name : basename(url);
            return { url, name };
        });
        return { imgs, vids, docs };
    }, [images, videos, documents, apiBase]);

    const defaultKey =
        searchParams.get("media") ||
        (normalized.imgs.length ? "images" : normalized.vids.length ? "videos" : "docs");

    const onTabChange = (k) => {
        const next = new URLSearchParams(searchParams);
        next.set("media", k);
        setSearchParams(next);
        window.analytics?.track?.("AdminMediaTabChanged", { tab: k });
    };

    const items = [
        {
            key: "images",
            label: "Images",
            children: normalized.imgs.length ? (
                <Image.PreviewGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {normalized.imgs.map((it, i) => (
                            <Image
                                key={i}
                                src={it.url}
                                width="100%"
                                height={160}
                                className="object-cover rounded-lg"
                                alt={`Gig image ${i + 1}`}
                            />
                        ))}
                    </div>
                </Image.PreviewGroup>
            ) : (
                <Empty description="No images" />
            ),
        },
        {
            key: "videos",
            label: "Videos",
            children: normalized.vids.length ? (
                <>
                    <List
                        grid={{ gutter: 12, column: 3 }}
                        dataSource={normalized.vids}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="rounded-xl overflow-hidden border">
                                    <video src={item.url} className="h-40 w-full object-cover" muted />
                                    <div className="flex items-center justify-between p-2">
                                        <Text className="truncate max-w-[200px]" title={item.name}>
                                            {item.name}
                                        </Text>
                                        <Button
                                            size="small"
                                            icon={<PlayCircleOutlined />}
                                            onClick={() => {
                                                setActiveVideo(item.url);
                                                setPlayerOpen(true);
                                                window.analytics?.track?.("AdminVideoPlayed", { url: item.url });
                                            }}
                                        >
                                            Play
                                        </Button>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Modal
                        open={playerOpen}
                        onCancel={() => setPlayerOpen(false)}
                        footer={null}
                        width={900}
                        destroyOnClose
                        title="Video player"
                    >
                        {activeVideo && (
                            <video
                                src={activeVideo}
                                controls
                                className="w-full h-[480px] rounded-lg"
                                controlsList="nodownload"
                            />
                        )}
                    </Modal>
                </>
            ) : (
                <Empty description="No videos" />
            ),
        },
        {
            key: "docs",
            label: "Documents",
            children: normalized.docs.length ? (
                <List
                    itemLayout="horizontal"
                    dataSource={normalized.docs}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="open"
                                    type="link"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open
                                </Button>,
                                <Button key="download" type="link" href={item.url} download>
                                    Download
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<FileTextOutlined className="text-xl" aria-hidden="true" />}
                                title={<span className="truncate">{item.name}</span>}
                                description={item.url}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="No documents" />
            ),
        },
    ];

    return (
        <Card title="Media">
            <Tabs defaultActiveKey={defaultKey} onChange={onTabChange} items={items} />
        </Card>
    );
}
