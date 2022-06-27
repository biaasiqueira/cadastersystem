import type {NextPage} from 'next'
import * as A from "antd";
import Link from 'next/link'
import Pagination from "../components/Pagination";
import {destroyCookie} from "nookies";
import { useRouter } from 'next/router'

const Home: NextPage = () => {
    const router = useRouter()

    const logout = () => {
        destroyCookie(null, 'cadaster_system_token')
        router.push('/login')
    }

    return (
        <div>
            <A.Button onClick={logout}>
                Loggout
            </A.Button>
            <div className="site-card-wrapper" style={{marginTop: 20}}>
                <A.Row gutter={16}>
                    <A.Col span={8}>
                        <A.Card title="Locações" bordered={false}>
                            <Pagination
                                collection={'locations'}
                                page={'locations'}
                            />
                            <p>Cadastre sua nova locação para saber quais clientes estão com que filme e qual será a
                                data de expiração.</p>
                            <Link href={'/locations/new'}>
                                <A.Button type={'primary'}>
                                    Cadastre
                                </A.Button>
                            </Link>
                        </A.Card>
                    </A.Col>
                    <A.Col span={8}>
                        <A.Card title="Clientes" bordered={false}>
                            <Pagination
                                collection={'clients'}
                                page={'client'}
                            />
                            <p>Cadastre um novo cliente para ter controle de quem está com os filmes.</p>
                            <Link href={'/client/new'}>
                                <A.Button type={'primary'}>
                                    Cadastre
                                </A.Button>
                            </Link>
                        </A.Card>
                    </A.Col>
                    <A.Col span={8}>
                        <A.Card title="Filmes" bordered={false}>
                            <Pagination
                                collection={'films'}
                                page={'films'}
                            />
                            <p>Cadastre novos filmes para seus clientes.</p>
                            <Link href={'/films/new'}>
                                <A.Button type={'primary'}>
                                    Cadastre
                                </A.Button>
                            </Link>
                        </A.Card>
                    </A.Col>
                </A.Row>
            </div>
        </div>
    )
}

export default Home
