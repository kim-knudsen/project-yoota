import { Card, Grid, Page, Text } from '@geist-ui/core'
import Head from 'next/head'

// See https://stackoverflow.com/questions/66343512/how-to-generate-and-add-privacy-policy-on-google-play
// See https://www.docracy.com/6016/mobile-privacy-policy

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Yoota. Privacy Policy</title>
            </Head>
            <Page width="800px" padding={0}>
                <Grid.Container gap={3} mt="25px">
                    <Card shadow>
                        <Text h3>Privacy Policy</Text>
                        <Text>
                            This privacy policy governs your use of the software application Yoota (“Application”) for
                            mobile devices. The Application was created by 3 friendly software engineers.
                        </Text>

                        <Text h3>What information does the Application obtain and how is it used?</Text>
                        <Text>
                            This section is designed to inform Users of the types of data that the app obtains and how
                            that information is used. You&apos;ll find several types of data that are often obtained by
                            apps, but you should provide Users with a clear, illustrative list of the most important
                            data points obtained by your app.
                        </Text>

                        <Text h3>User Provided Information</Text>
                        <Text>
                            The Application obtains the information you provide when you download and register the
                            Application. Registration with us is optional. However, please keep in mind that you may not
                            be able to use some of the features offered by the Application unless you register with us.
                        </Text>
                        <Text>
                            When you register with us and use the Application, you generally provide (a) your name and
                            your email address; (b) information you provide us when you contact us for help; (d)
                            information you enter into our system when using the Application, such as contact
                            information and project management information.
                        </Text>
                        <Text>
                            We may also use the information you provided us to contact your from time to time to provide
                            you with important information, required notices and marketing promotions.
                        </Text>

                        <Text h3>Automatically Collected Information</Text>
                        <Text>
                            In addition, the Application may collect certain information automatically, including, but
                            not limited to, the type of mobile device you use, your mobile devices unique device ID, the
                            IP address of your mobile device, your mobile operating system, the type of mobile Internet
                            browsers you use, and information about the way you use the Application.
                        </Text>

                        <Text h3>
                            Does the Application collect precise real time location information of the device?
                        </Text>
                        <Text>
                            This Application does not collect precise information about the location of your mobile
                            device.
                        </Text>

                        <Text h3>
                            Do third parties see and/or have access to information obtained by the Application?
                        </Text>
                        <Text>
                            No third parties can see and/or have access to information obtained by the Application
                        </Text>
                        <Text h3>What are my opt-out rights?</Text>
                        <Text>
                            You can stop all collection of information by the Application easily by uninstalling the
                            Application. You may use the standard uninstall processes as may be available as part of
                            your mobile device or via the mobile application marketplace or network. You can also
                            request to opt-out via email, at devs@yoota.app.
                        </Text>
                        <Text h3>Data Retention Policy, Managing Your Information</Text>
                        <Text>
                            We will retain User Provided data for as long as you use the Application and for a
                            reasonable time thereafter. We will retain Automatically Collected information for up to 24
                            months and thereafter may store it in aggregate. If you&apos;d like us to delete User
                            Provided Data that you have provided via the Application, please contact us at
                            devs@yoota.app and we will respond in a reasonable time. Please note that some or all of the
                            User Provided Data may be required in order for the Application to function properly.
                        </Text>
                        <Text h3>Security</Text>
                        <Text>
                            We are concerned about safeguarding the confidentiality of your information. We provide
                            physical, electronic, and procedural safeguards to protect information we process and
                            maintain. For example, we limit access to this information to authorized employees and
                            contractors who need to know that information in order to operate, develop or improve our
                            Application. Please be aware that, although we endeavor provide reasonable security for
                            information we process and maintain, no security system can prevent all potential security
                            breaches.
                        </Text>
                        <Text h3>Changes</Text>
                        <Text>
                            This Privacy Policy may be updated from time to time for any reason. We will notify you of
                            any changes to our Privacy Policy by posting the new Privacy Policy here and informing you
                            via email or text message. You are advised to consult this Privacy Policy regularly for any
                            changes, as continued use is deemed approval of all changes. You can check the history of
                            this policy by clicking here.
                        </Text>
                        <Text h3>Your Consent</Text>
                        <Text>
                            By using the Application, you are consenting to our processing of your information as set
                            forth in this Privacy Policy now and as amended by us. &quot;Processing&quot; means using
                            cookies on a computer/hand held device or using or touching information in any way,
                            including, but not limited to, collecting, storing, deleting, using, combining and
                            disclosing information, all of which activities will take place in the United States. If you
                            reside outside the United States your information will be transferred, processed and stored
                            there under United States privacy standards.
                        </Text>
                        <Text h3>Contact us</Text>
                        <Text>
                            If you have any questions regarding privacy while using the Application, or have questions
                            about our practices, please contact us via email at devs@yoota.app.
                        </Text>
                    </Card>
                </Grid.Container>
            </Page>
        </>
    )
}
