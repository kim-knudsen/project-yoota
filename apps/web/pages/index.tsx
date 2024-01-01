import { YootaLogo } from '@yoota/client'
import Head from 'next/head'
import TWGrid from '../components/TWGrid'
import TWPage from '../components/TWPage'
import TWText from '../components/TWText'

export default function Index() {
    return (
        <>
            <Head>
                <title>Yoota.</title>
            </Head>

            <TWPage>
                <TWGrid.Container>
                    <YootaLogo color="blue" />
                    <TWText.P className="text-blue-800" style={{ marginTop: 20 }}>
                        Coming soon..
                    </TWText.P>
                </TWGrid.Container>
            </TWPage>
        </>
    )
}
