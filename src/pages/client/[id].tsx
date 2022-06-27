import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import firebase from "../../config/firebaseClient";
import {useRouter} from "next/router";
import {Form, Formik} from "formik";
import * as A from "antd";
import Swal from "sweetalert2";

interface ClientModel {
    name: string,
    document: string,
    bornDate: any
}

const ClientById: NextPage = () => {
    const {query} = useRouter()

    const [client, setClient] = useState<ClientModel>({
        name: '',
        document: '',
        bornDate: null
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const dateFormatted = new Date(client?.bornDate?.seconds * 1000)

    const handleSubmit = async (values: any) => {
        setLoading(true)
        if (query.id !== 'new') {
            firebase
                .firestore()
                .collection('locations')
                .doc(query.id)
                .update({
                    ...values,
                    bornDate: dateFormatted ? dateFormatted : values.bornDate
                }).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Cliente atualizado com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao atualizar o cliente!',
                    icon: 'error',
                    timer: 1000
                })
            })
        } else {
            firebase
                .firestore()
                .collection('locations')
                .add(values).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Cliente criado com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao criar o cliente!',
                    icon: 'error',
                    timer: 1000
                })
            })
        }
    }

    useEffect(() => {

        firebase.firestore()
            .collection('clients')
            .doc(query.id)
            .onSnapshot(snap => {
                const requestClient = snap.data()
                setClient(requestClient)
            });
    })
    return (
        <Formik
            initialValues={client}
            onSubmit={(values) => {
                handleSubmit(values)
            }}
        >
            {(props) => {
                return (
                    <A.Form
                        labelCol={{span: 10}}
                        wrapperCol={{span: 4}}
                        initialValues={{remember: true}}
                        autoComplete="off"
                    >
                        <A.Form.Item
                            label="Nome"
                            name="name"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.Input
                                value={props.values.name}
                                onChange={props.handleChange}
                                placeholder={"Nome"}
                            />
                        </A.Form.Item>
                        <A.Form.Item
                            label="CPF"
                            name="document"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.Input
                                value={props.values.document}
                                onChange={props.handleChange}
                                placeholder={"CPF"}
                            />
                        </A.Form.Item>
                        <A.Form.Item
                            label="Data de nascimento"
                            name="bornDate"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.DatePicker
                                value={dateFormatted}
                                onChange={(e) => {
                                    props.values.bornDate = e.toDate()
                                }}
                            />
                        </A.Form.Item>
                        <A.Form.Item wrapperCol={{offset: 10, span: 16}}>
                            <A.Button
                                type={'primary'}
                                onClick={() => {
                                    handleSubmit(props.values)
                                }}>
                                {
                                    query.id !== 'new' ? 'Atualizar' : 'Cadastrar'
                                }
                            </A.Button>
                        </A.Form.Item>

                    </A.Form>
                )
            }}
        </Formik>
    )
}

export default ClientById