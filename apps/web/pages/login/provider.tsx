import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getVercelBaseUrl } from '../../utils/getVercelBaseUrl'

export default function Provider() {
    const router = useRouter()
    const { redirect_uri, type, authorization_params = '' } = router.query

    useEffect(() => {
        const callbackUrl = `${getVercelBaseUrl()}/api/mobile-auth-callback?redirect_uri=${redirect_uri}`
        const params = new URLSearchParams(decodeURIComponent(authorization_params as string))
        if (typeof type === 'string') signIn(type, { callbackUrl }, params)
    }, [redirect_uri, type, authorization_params])

    return null
}
