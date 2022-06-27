import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import firebase from "../../config/firebaseClient";
import {useRouter} from "next/router";
import * as A from "antd";
import {Formik} from "formik";
import Swal from "sweetalert2";

interface LocationModel {
    dateDevolution: any,
    dateLocation: any,
    nameClient: string,
    titleFilm: string
}

const LocationById: NextPage = () => {
    const [locations, setLocations] = useState<LocationModel>({
        dateDevolution: null,
        dateLocation: null,
        nameClient: '',
        titleFilm: ''
    })
    const [clients, setClients] = useState([])
    const [films, setFilms] = useState([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const {query} = useRouter()

    useEffect(() => {
        firebase.firestore()
            .collection('locatios')
            .doc(query.id)
            .onSnapshot(snap => {
                const requestLocations = snap.data()
                setLocations(requestLocations)
            });

        firebase.firestore()
            .collection('clients')
            .onSnapshot(snap => {
                const clientsNew = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // @ts-ignore
                setClients(clientsNew);
            });
        firebase.firestore()
            .collection('films')
            .onSnapshot(snap => {
                const filmsNew = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // @ts-ignore
                setFilms(filmsNew);
            });
    })

    const handleSubmit = async (values: any) => {
        setLoading(true)
        if (query.id !== 'new') {
            firebase
                .firestore()
                .collection('locations')
                .doc(query.id)
                .update({
                    ...values,
                    dateDevolution: new Date
                }).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Locação atualizada com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao atualizar a locação!',
                    icon: 'error',
                    timer: 1000
                })
            })
        } else {
            firebase
                .firestore()
                .collection('locations')
                .add({
                    ...values,
                    dateDevolution: new Date
                }).then(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Locação criada com sucesso!',
                    icon: 'success',
                    timer: 1000
                }).then(() => {
                    router.push('/')
                })
            }).catch(() => {
                setLoading(false)
                Swal.fire({
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao criar a locação!',
                    icon: 'error',
                    timer: 1000
                })
            })
        }
    }
    return (
        <Formik
            initialValues={locations}
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
                            label="Cliente"
                            name="nameClient"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.Select
                                value={props.values.nameClient}
                                onChange={(e) => {
                                    props.values.nameClient = e
                                }}
                                placeholder={"Cliente"}
                            >
                                {clients.map((client) => {
                                    return (
                                        <A.Select.Option value={client.name}>
                                            {client.name}
                                        </A.Select.Option>
                                    )
                                })}
                            </A.Select>
                        </A.Form.Item>
                        <A.Form.Item
                            label="Título"
                            name="Título"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.Select
                                value={props.values.titleFilm}
                                onChange={(e) => {
                                    props.values.titleFilm = e
                                }}
                                placeholder={"Name"}
                            >
                                {films.map((film) => {
                                    return (
                                        <A.Select.Option value={film.title}>
                                            {film.title}
                                        </A.Select.Option>
                                    )
                                })}

                            </A.Select>
                        </A.Form.Item>
                        <A.Form.Item
                            label="Data de devolução"
                            name="dateDevolution"
                            rules={[{required: true, message: 'Please input your email!'}]}
                        >
                            <A.DatePicker
                                value={props.values.dateLocation}
                                onChange={(e) => {
                                    props.values.dateLocation = e.toDate()
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

export default LocationById