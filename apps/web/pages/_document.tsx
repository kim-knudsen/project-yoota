import { CssBaseline } from '@geist-ui/core'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { Fragment } from 'react'

class BaseDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        const styles = CssBaseline.flush()

        return {
            ...initialProps,
            styles: (
                <Fragment key="1">
                    {initialProps.styles}
                    {styles}
                </Fragment>
            )
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default BaseDocument
