import { createNextAuth } from '@yoota/auth'
import { getLocaleFromPreferredLocales } from '@yoota/i18n'
import { NextApiHandler } from 'next'
import { getPreferredLocales } from '../../../utils/localeUtils'

const apiHandler: NextApiHandler = async (req, res) => {
    const locales = getPreferredLocales(req)
    const locale = getLocaleFromPreferredLocales(locales)
    const authHandler = createNextAuth({ locale })

    return authHandler(req, res)
}

export default apiHandler
