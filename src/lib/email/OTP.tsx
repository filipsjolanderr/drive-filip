import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Text,
    Tailwind,
    Section,
} from "@react-email/components";

interface OTPProps {
    otp: string;
}



export const OTP = ({ otp }: OTPProps) => {
    const previewText = `Your OTP`;





    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-300 rounded my-10 mx-auto p-6 max-w-md">
                        <Heading className="text-black text-xl font-bold text-center">
                            Verify Your Email Address
                        </Heading>
                        <Text className="text-black text-sm">

                            Your OTP is {otp},
                        </Text>
                        <Hr className="border-gray-300 my-6" />
                        <Text className="text-gray-600 text-xs">

                            If you didn't request this, please ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
