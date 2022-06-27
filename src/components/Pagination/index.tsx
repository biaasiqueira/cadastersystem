//@ts-nocheck
import {useEffect, useState} from "react";
import firebase from "../../config/firebaseClient";
import * as A from "antd";
import Link from "next/link";

const pageSize = 4

interface PaginationModel {
    collection: string,
    page: string
}

const Pagination = (props: PaginationModel) => {
    const [data, setData] = useState([]);

    const [state, setState] = useState({
        totalPage: 0,
        current: 1,
        minIndex: 0,
        maxIndex: 0
    })

    useEffect(() => {
        firebase.firestore()
            .collection(props.collection)
            .onSnapshot(snap => {
                const dataNew = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // @ts-ignore
                setData(dataNew);
                setState(prevState => ({
                    ...prevState,
                    totalPage: dataNew.length / pageSize,
                    minIndex: 0,
                    maxIndex: pageSize
                }))
            });
    })

    const handleChange = (page: any) => {
        setState(prevState => ({
            ...prevState,
            current: page,
            minIndex: (page - 1) * pageSize,
            maxIndex: page * pageSize
        }))
    }
    const handleDelete = (id: string) => {
        firebase.firestore()
            .collection(props.collection)
            .doc(id)
            .delete()
    }

    return (
        <>
            {data.map((currentData, index) => (
                    index >= state.minIndex &&
                    index < state.maxIndex &&
                    (
                        <A.Space direction="vertical" size="middle" style={{display: 'flex'}}>
                            <A.Card title={
                                <div>
                                    <Link href={{
                                        pathname: `${props.page}/${currentData.id}`,
                                        query: {
                                            id: currentData.id
                                        }
                                    }}>
                                        <A.Button>Editar</A.Button>
                                    </Link>
                                    <A.Button danger onClick={() => {handleDelete(currentData.id)}}>Apagar</A.Button>
                                </div>
                            } size="small" key={currentData.id}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <p>
                                        {
                                            currentData.nameClient && `Cliente: ${currentData.nameClient}`
                                            ||
                                            currentData.name && `Nome: ${currentData.name}`
                                            ||
                                            currentData.title && `Filme: ${currentData.title}`

                                        }
                                    </p>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <p>
                                        {
                                            currentData.titleFilm && `Filme: ${currentData.titleFilm}`
                                            ||
                                            currentData.document && `CPF: ${currentData.document}`
                                        }
                                    </p>
                                </div>
                            </A.Card>
                        </A.Space>
                    )
                )
            )}
            <A.Pagination
                onChange={handleChange}
                pageSize={pageSize}
                current={state.current}
                total={data.length}
            />
        </>
    )
}

export default Pagination