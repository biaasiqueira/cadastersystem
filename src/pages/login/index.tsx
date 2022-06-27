import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {firebaseClient} from '../../config/firebaseClient';
import * as A from "antd";
import {parseCookies} from "nookies";
import {useRouter} from "next/router";

export default (_props: any) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const {'cadaster_system_token': token} = parseCookies()
    const router = useRouter()

    useEffect(() => {
        if(token) {
            router.push('/')
        }
    })

    return (
        <A.Form
            name="basic"
            labelCol={{span: 10}}
            wrapperCol={{span: 4}}
            initialValues={{remember: true}}
            autoComplete="off"
        >
            <A.Form.Item
                label="Email"
                name="email"
                rules={[{required: true, message: 'Please input your email!'}]}
            >
                <A.Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={"Email"}
                />
            </A.Form.Item>

            <A.Form.Item
                label='Password'
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
            >
                <A.Input
                    type={'password'}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder={'Password'}
                />
            </A.Form.Item>

            <A.Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                <A.Button
                    onClick={async () => {
                        await firebaseClient
                            .auth()
                            .createUserWithEmailAndPassword(email, pass);
                        window.location.href = '/';
                    }}
                >
                    Create account
                </A.Button>
                <A.Button type="primary"
                          onClick={async () => {
                              await firebaseClient.auth().signInWithEmailAndPassword(email, pass);
                              window.location.href = '/';
                          }}
                >
                    Log in
                </A.Button>
            </A.Form.Item>
        </A.Form>
    );
};