import { Card, Drawer, Empty } from "antd";
import { currency } from "../utility/money";

export default function CompareDrawer({ open, onClose, packages }) {
    return (
        <Drawer
            title="Compare packages"
            placement="right"
            width={Math.min(840, window.innerWidth - 80)}
            onClose={onClose}
            open={open}
        >
            {packages ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["basic", "standard", "premium"].map((tier) => (
                        <Card key={tier} title={tier.toUpperCase()}>
                            <ul className="space-y-2">
                                {Object.entries(packages[tier] || {}).map(([k, v]) => (
                                    <li key={k} className="flex justify-between gap-4">
                                        <span className="text-gray-500">{k}</span>
                                        <span className="font-medium">{k.toLowerCase() === "price" ? currency(v) : String(v)}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            ) : <Empty />}
        </Drawer>
    );
}
