import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import firebase from "../../config/firebaseClient";
import {useRouter} from "next/router";
import * as A from "antd";
import {Formik} from "formik";
import Swal from "sweetalert2";

interface FilmModel {
    title: string,
    indicativeClassification: number,
    release: any
}

const FilmById: NextPage = () => {
    const router = useRouter()
    const [films, setFilms] = useState<FilmModel>({
        title: '',
        indicativeClassification: 0,
        release: null
    })
    const [loading, setLoading] = useState(false)

    const {query} = useRouter()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        if (query.id !== 'new') {
            firebase
                .firestore()
                .collection('films')
                .doc(query.id)
                .update(values).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Filme atualizado com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao atualizar o filme!',
                    icon: 'error',
                    timer: 1000
                })
            })
        } else {
            firebase
                .firestore()
                .collection('films')
                .add(values).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Filme criado com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao criar o filme!',
                    icon: 'error',
                    timer: 1000
                })
            })
        }

    }

    useEffect(() => {
        firebase.firestore()
            .collection('films')
            .doc(query.id)
            .onSnapshot(snap => {
                const requestFilms = snap.data()
                setFilms(requestFilms)
            });
    })

    return (
        <Formik
            initialValues={films}
            onSubmit={() => {
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
                            label="Título"
                            name="title"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.Input
                                value={props.values.title}
                                onChange={props.handleChange}
                                placeholder={"Título"}
                            />
                        </A.Form.Item>
                        <A.Form.Item
                            label="Data de lançamento"
                            name="release"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.DatePicker
                                value={props.values.release}
                                onChange={(e) => {
                                    props.values.release = e.toDate()
                                }}
                            />
                        </A.Form.Item>
                        <A.Form.Item
                            label="Classificação"
                            name="indicativeClassification"

                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.InputNumber
                                value={props.values.indicativeClassification}
                                onChange={(e) => {
                                    props.values.indicativeClassification = e.valueOf()
                                    console.log(props.values)
                                }}
                            />
                        </A.Form.Item>
                        <A.Form.Item wrapperCol={{offset: 10, span: 16}}>
                            <A.Button
                                type={'primary'}
                                loading={loading}
                                onClick={() => {
                                    handleSubmit(props.values)
                                }}>
                                {query.id !== 'new' ? 'Atualizar' : 'Cadastrar'}
                            </A.Button>
                        </A.Form.Item>

                    </A.Form>
                )
            }}
        </Formik>
    )
}

export default FilmById