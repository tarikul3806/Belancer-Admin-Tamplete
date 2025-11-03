import { Card, Col, Collapse, Empty, Row, Typography } from "antd";
const { Title } = Typography;
const { Panel } = Collapse;

export default function QASection({ questions = [], faqs = [] }) {
    return (
        <Card>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Title level={5}>Custom Questions</Title>
                    {questions?.length ? (
                        <ul className="list-disc pl-5">
                            {questions.map((q, i) => <li key={i}>{q.text}</li>)}
                        </ul>
                    ) : <Empty description="No questions" />}
                </Col>
                <Col xs={24} md={12}>
                    <Title level={5}>FAQs</Title>
                    {faqs?.length ? (
                        <Collapse
                            accordion
                            items={faqs.map((f, i) => ({
                                key: i.toString(),
                                label: f.question,
                                children: <p>{f.answer}</p>,
                            }))}
                        />
                    ) : (
                        <Empty description="No FAQs" />
                    )}
                </Col>
            </Row>
        </Card>
    );
}
