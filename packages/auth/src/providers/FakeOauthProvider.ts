import { assertIsDefined } from '@yoota/common'
import { OAuthConfig } from 'next-auth/providers'

interface Profile {
    id: string
    name: string
    email: string
    image: string
}

const tokenToUser = new Map<string, Profile>([
    [
        'john',
        {
            id: 'john-123',
            name: 'John Doe',
            email: 'john@doe.com',
            image: 'https://avatars.dicebear.com/api/male/john@doe.com.svg?mood=happy'
        }
    ],
    [
        'jane',
        {
            id: 'jane-123',
            name: 'Jane Doe',
            email: 'jane@doe.com',
            image: 'https://avatars.dicebear.com/api/female/jane@doe.com.svg?mood=happy'
        }
    ]
])

export const FakeOauthProvider = (): OAuthConfig<Profile> => ({
    id: 'fake-oauth',
    name: 'Fake OAuth',
    type: 'oauth',
    version: '2.0',
    authorization: {
        url: `/login/fake-oauth/authorize`,
        params: {
            scope: 'read:user user:email'
        }
    },
    token: {
        // Pass on the code so userinfo may look up the user
        request: ctx => ({ tokens: { access_token: ctx.params.code } })
    },

    userinfo: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        async request(ctx) {
            assertIsDefined(ctx.tokens.access_token, 'No access token found')

            const user = tokenToUser.get(ctx.tokens.access_token)

            assertIsDefined(user, `Unable to find user for token ${ctx.tokens.access_token}`)

            return user
        }
    },

    profile(profile) {
        return {
            ...profile
        }
    },

    options: {
        clientId: 'fake-123',
        clientSecret: 'fake-123'
    }
})
