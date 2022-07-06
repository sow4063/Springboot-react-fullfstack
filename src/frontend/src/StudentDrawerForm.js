// StudentDrawerForm.js

import {addNewStudent, updateStudent} from "./client";
import {useState} from "react";
import {successNotification, errorNotification} from "./Notification";

import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {LoadingOutlined} from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const {Option} = Select;

function StudentDrawerForm({editMode, showDrawer, setShowDrawer, fetchStudents, values}) {
    const [submitting, setSubmitting] = useState(false);
    const onCLose = () => setShowDrawer(false);

    const title = editMode ? "Edit Student": "Create New Student";

    const id = values ? values.id : "";
    const name = values ? values.name : "";
    const email = values ? values.email : "";
    const gender = values ? values.gender : "";

    const [form] = Form.useForm();

    form.setFieldsValue({
        name: name,
        email: email,
        gender: gender
    });

    const editStudent = (student, callback) => {
        updateStudent(student)
            .then(() => {
                console.log("student updated");
                onCLose();
                successNotification(
                    "Student successfully updateded",
                    `${student.name} was updated to the server`,
                    "bottomLeft");
                callback();
            })
            .catch(err => {
                console.log(err);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`,
                        "bottomLeft"
                    )
                });
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const insertStudent = (student, callback) => {
        addNewStudent(student)
            .then(() => {
                console.log("student added");
                onCLose();
                successNotification(
                    "Student successfully added",
                    `${student.name} was added to the server`,
                    "bottomLeft");
                callback();
            })
            .catch(err => {
                console.log(err);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`,
                        "bottomLeft"
                    )
                });
            })
            .finally(() => {
                setSubmitting(false);
            })
    }

    const onFinish = student => {
        setSubmitting(true);
        console.log(JSON.stringify(student, null, 2));
        if(editMode) {
            student.id = id;
            editStudent(student, fetchStudents);
        } else {
            insertStudent(student, fetchStudents);
        }

    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title={title}
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              form = {form}
              hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter student name'}]}
                    >
                        <Input placeholder="Please enter student name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter student email'}]}
                    >
                        <Input placeholder="Please enter student email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="gender"
                        rules={[{required: true, message: 'Please select a gender'}]}
                    >
                        <Select placeholder="Please select a gender">
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;