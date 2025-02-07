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

interface ResetPasswordEmailProps {
    username: string;
    resetLink: string;
}

export const ResetPasswordEmail = ({ username, resetLink }: ResetPasswordEmailProps) => {
    const previewText = `Reset your password`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-gray-300 rounded my-10 mx-auto p-6 max-w-md">
                        <Heading className="text-black text-xl font-bold text-center">
                            Reset Your Password
                        </Heading>
                        <Text className="text-black text-sm">
                            Hello {username},
                        </Text>
                        <Text className="text-black text-sm">
                            We received a request to reset your password. Click the button below to continue:
                        </Text>
                        <Section className="text-center my-6">
                            <Button
                                className="bg-black text-white text-sm font-semibold px-5 py-3 rounded"
                                href={resetLink}
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="text-black text-sm">
                            Or copy this URL into your browser:{" "}
                            <Link href={resetLink} className="text-blue-600">
                                {resetLink}
                            </Link>
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
